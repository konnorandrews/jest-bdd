'use strict';

const after = (promise, callback) => {
  try{
    return promise()
      .then(result => { callback(result); return result })
      .catch(e => { callback(e); return Promise.reject(e) })
  }catch(e){
    callback(e);
    return Promise.reject(e)
  }
}

const define = ({scope, name, block}) => {
  let value, isEvaluated = false
  Object.defineProperty(scope, name, {
    configurable: true,
    get() {
      if (!isEvaluated) {
        try {
          value = block.call(scope)
        } finally {
          isEvaluated = true
        }
      }
      return value
    },
  })
}

const undefine = ({scope, name}) => {
  Object.defineProperty(scope, name, {
    configurable: true,
    get() { return undefined },
  })
}

const Rules = () => new Proxy({
  $list: [],
  $apply() {
    this.$list.forEach(rule => define({scope: rule.scope, name: rule.prop, block: () => rule.value(rule.name)}))
  },
  $remove(){
    this.$list.forEach(rule => undefine({scope: rule.scope, name: rule.prop}))
  },
  $add(prop, name, value, scope){
    this.$list.push({prop, name, value, scope})
  },
  useWith(callback){
    this.$apply()
    callback()
    this.$remove()
  }
}, {
  get(obj, prop) {
    if(prop == '$apply' || prop == '$remove' || prop == '$add' || prop == 'useWith'){
      return obj[prop].bind(obj)
    }else{
      return {obj, prop}
    }
  }
})

const bindToRules = (binds) => (rules, ...args) =>
  binds.forEach(bind =>
    rules.obj.$add(rules.prop, rules.prop.replace(/\_/g, ' '), name => bind.clause(name, ...args), bind.scope)
  )

const group = (title) => (name, code, whens) => {
  describe(title + name, () => {
    beforeEach(() => {
      define({scope: global, name: 'scope', block: () => ({})})
      return Promise.resolve(code()).then(result => {
        Object.keys(scope ? scope : {}).forEach(key => define({scope: global, name: key, block: (x => () => x)(scope[key])}))
        return result
      })
    })
    afterEach(() => {
      Object.keys(scope ? scope : {}).forEach(key => undefine({scope: global, name: key}))
      undefine({scope: global, name: 'scope'})
    })
    whens.forEach(when => when())
  })
}

const given = (name, code, ...whens) => () => group('Given: ')(name, code, whens)
const when = (name, code, ...thens) => () => group('When: ')(name, code, thens)
const then = (name, code) => () => test('Then: ' + name, code)

then.only = (name, code) => () => test.only('Then: ' + name, code)

const Given = bindToRules([
  //{scope: given, clause: (name, code) => (...tests) => () => group('Given: ')(name, code, tests)},
  {scope: given, clause: (name, code) => (...args) => {
    console.log('given args', args)
    if(!(args[0] instanceof Function)){
      return (...tests) => () => group('Given: ')(name, () => {
        Object.entries(args[0]).forEach(([ key, value ]) => define({scope: global, name: key, block: () => value}))
        return after(() => Promise.resolve(code()), () => {
          Object.keys(args[0]).forEach(key => undefine({scope: global, name: key}))
        })
      }, tests)
    }else{
      return () => group('Given: ')(name, code, args)
    }
  }},
])

const When = bindToRules([{scope: when, clause: (name, code) => (...tests) => () => group('When: ')(name, code, tests)}])

const Then = bindToRules([
  {scope: then, clause: (name, code) => () => test('Then: ' + name, code)},
  //{scope: then.only, clause: (name, code) => () => test.only('Then only: ' + name, code)}
  {scope: then.only, clause: (name, code) => (args) => {
    console.log('then args', args)
    if(args){
      return () => test.only('Then only: ' + name, () => {
        Object.entries(args).forEach(([ key, value ]) => define({scope: global, name: key, block: () => value}))
        return after(() => Promise.resolve(code()), () => {
          Object.keys(args).forEach(key => undefine({scope: global, name: key}))
        })
      })
    }else{
      return test.only('Then only: ' + name, code)
    }
  }}
])

const unit = (...clauses) => clauses.forEach(clause => clause())

module.exports = {
  given, when, then, /*and,*/ // use inline
  Given, When, Then, /*And,*/ // use to define reusable version
  Rules, // use for rule based tests
  unit,
}
