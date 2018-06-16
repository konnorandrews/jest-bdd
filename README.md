Jest BDD
=========

Behavior-driven development wrapper for Jest

## Installation

  `npm install jest-bdd`

## Usage

### In-line

    const { unit, given, when, then } = require('jest-bdd')

    unit(
      given('two numbers', () => {
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

    Output:
      Given: two numbers
        ✓ Then: num1 is 3
        When: the numbers are added
          ✓ Then: the sum is 11

### Rules

Rules allow reusable clauses to be created.

    const { Rules, Given, when, Then, unit } = require('jest-bdd')

    const rules = RuleGroup()

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

    useRules(rules, () => unit(
      given.two_numbers(
        then.num1_is_3,
        when.the_numbers_are_added(
          then.the_sum_is_11
        )
      )
    ))

    Output:
      Given: two numbers
        ✓ Then: num1 is 3
        When: the numbers are added
          ✓ Then: the sum is 11

## Tests

  `npm test`

<!-- ## Contributing -->
