Feature: Daily log

  Background:
    Given I open the app
    And I add a food "Apple" with 95 calories
    And I add a food "Banana" with 105 calories

  Scenario: Log a food on a given day
    When I view the date "2026-11-01"
    And I log the food "Apple" for "Breakfast"
    Then I see "Apple" in the daily log
    And the daily total is 95 calories

  Scenario: Logging a food shows a toast
    When I view the date "2026-11-01"
    And I log the food "Apple" for "Breakfast"
    Then I see the toast "Logged Apple to Breakfast"

  Scenario: Totals add up across the day
    When I view the date "2026-11-01"
    And I log the food "Apple" for "Breakfast"
    And I log the food "Banana" for "Breakfast"
    Then the daily total is 200 calories

  Scenario: Each day has its own log
    When I view the date "2026-11-01"
    And I log the food "Apple" for "Breakfast"
    And I view the date "2026-11-02"
    Then the daily log is empty
    And the daily total is 0 calories
    When I log the food "Banana" for "Breakfast"
    And I view the date "2026-11-01"
    Then I see "Apple" in the daily log
    And the daily total is 95 calories

  Scenario: Remove a logged food
    When I view the date "2026-11-01"
    And I log the food "Apple" for "Breakfast"
    And I remove "Apple" from the daily log
    Then the daily log is empty
    And the daily total is 0 calories

  Scenario: The log persists after reloading
    When I view the date "2026-11-01"
    And I log the food "Apple" for "Breakfast"
    And I reload the app
    And I view the date "2026-11-01"
    Then I see "Apple" in the daily log
    And the daily total is 95 calories

  Scenario: Remove is hidden until a food is slid left
    When I view the date "2026-11-01"
    And I log the food "Apple" for "Breakfast"
    Then the remove button for "Apple" is hidden
    When I slide "Apple" to the left
    Then the remove button for "Apple" is shown
    When I slide "Apple" to the right
    Then the remove button for "Apple" is hidden