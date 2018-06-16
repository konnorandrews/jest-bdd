const {
  given, when, then,
  Given, When, Then,
  Rules,
  unit,
} = require('./index')

unit( // start unit test, can contain any number of [given, when, then] clauses
  given('in-line', () => {},
    given('two numbers', () => { // setup the test environment
      scope.num1 = 3
      scope.num2 = 8
    },
      then('num1 is 3', () => { // check the setup
        expect(num1).toBe(3)
      }),
      when('the numbers are added', () => { // perform the action to test
        scope.sum = num1 + num2
      },
        then('the sum is 11', () => { // check the result of the action
          expect(sum).toBe(11)
        })
      )
    )
  )
)

const rules = Rules()

Given(rules.rules, () => {})

Given(rules.two_numbers, () => {
  scope.num1 = 3
  scope.num2 = 8
})

When(rules.the_numbers_are_added, () => {
  scope.sum = num1 + num2
})

Then(rules.num1_is_3, () => {
  expect(num1).toBe(3)
})

Then(rules.the_sum_is_11, () => {
  expect(sum).toBe(11)
})

rules.useWith(() => unit(
  given.rules(
    given.two_numbers(
      then.num1_is_3,
      when.the_numbers_are_added(
        then.the_sum_is_11
      )
    )
  )
))

Given(rules.rules_with_args, () => {})

Given(rules.the_number, () => {
  scope.num = n
})

Then(rules.the_number_is, () => {
  expect(num).toBe(typeof n != 'undefined' ? n : 0)
})

rules.useWith(() => unit(
  given.rules_with_args(
    given.the_number({n: 103})(
      then.only.the_number_is({n: 103})
    )
  )
))

// const after = (promise, callback) => {
//   try{
//     return promise()
//       .then(result => { callback(result); return result })
//       .catch(e => { callback(e); return Promise.reject(e) })
//   }catch(e){
//     callback(e);
//     return Promise.reject(e)
//   }
// }
//
// test.only('demo', () => {
//   return after(() => Promise.resolve((() => {
//     return 10
//   })()), x => {
//     console.log('what is this?')
//     console.log('test', x)
//   })
// })
