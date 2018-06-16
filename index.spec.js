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

Given(rules.the_number, ({ n }) => {
  scope.num = n
}, {hiddenArgs: ['n']})

Then(rules.the_number_is, ({ n }) => {
  expect(num).toBe(n)
})

Given(rules.a_and_b, ({ a, b }) => {
  scope.a = a
  scope.b = b
})

When(rules.added, () => {
  scope.sum = a + b
})

When(rules.subtracted, () => {
  scope.sum = a - b
})

When(rules.custom_operator, ({ operator }) => {
  scope.sum = operator(a, b)
}, {hiddenArgs: ['operator']})

Then(rules.the_result_is, ({ n }) => {
  expect(sum).toBe(n)
})

rules.useWith(() => unit(
  given.rules_with_args(
    given.the_number({n: 104})(
      then.the_number_is({n: 104})
    ),
    given.the_number({n: 5})(
      then.the_number_is({n: 5})
    ),
    given.a_and_b({a:10, b: 5})(
      when.added(
        then.the_result_is({n: 15})
      ),
      when.subtracted(
        then.the_result_is({n: 5})
      ),
      when.custom_operator('*')({operator: (a, b) => a * b})(
        then.the_result_is({n: 50})
      )
    )
  )
))
