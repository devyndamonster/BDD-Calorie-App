Feature: Meals

  Background:
    Given I open the app
    And I add a food "Apple" with 95 calories
    And I add a food "Banana" with 105 calories
    And I view the date "2026-11-01"

  Scenario: Log a food under a meal
    When I log the food "Apple" for "Lunch"
    Then I see "Apple" under "Lunch"

  Scenario: Logged foods are grouped by meal
    When I log the food "Apple" for "Breakfast"
    And I log the food "Banana" for "Snack"
    Then I see "Apple" under "Breakfast"
    And I see "Banana" under "Snack"
    And I do not see the meal "Dinner"

  Scenario: Totals include every meal
    When I log the food "Apple" for "Breakfast"
    And I log the food "Banana" for "Dinner"
    Then the daily total is 200 calories

  Scenario: Remove a food from a meal
    When I log the food "Apple" for "Dinner"
    And I remove "Apple" from the daily log
    Then I do not see the meal "Dinner"

  Scenario: Meals persist after reloading
    When I log the food "Apple" for "Lunch"
    And I reload the app
    And I view the date "2026-11-01"
    Then I see "Apple" under "Lunch"
