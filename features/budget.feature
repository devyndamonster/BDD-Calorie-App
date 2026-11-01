Feature: Daily calorie budget

  Background:
    Given I open the app
    And I add a food "Apple" with 95 calories
    And I add a food "Banana" with 105 calories
    And I view the date "2026-11-01"

  Scenario: Set a budget for the day
    When I set the budget to 2050 calories
    Then I see the budget summary "0/2050 Cal"

  Scenario: Logging a food updates the budget
    When I set the budget to 2050 calories
    And I log the food "Apple" for "Breakfast"
    And I log the food "Banana" for "Breakfast"
    Then I see the budget summary "200/2050 Cal"

  Scenario: A budget cannot be zero
    When I set the budget to 0 calories
    Then I see the error "Budget must be greater than zero"

  Scenario: The budget carries over to the following days
    When I set the budget to 2050 calories
    And I log the food "Apple" for "Breakfast"
    And I view the date "2026-11-02"
    Then I see the budget summary "0/2050 Cal"
    When I log the food "Banana" for "Breakfast"
    Then I see the budget summary "105/2050 Cal"
    When I view the date "2026-11-01"
    Then I see the budget summary "95/2050 Cal"

  Scenario: Changing the budget on a later day leaves earlier days alone
    When I set the budget to 2050 calories
    And I view the date "2026-11-02"
    And I set the budget to 1800 calories
    Then I see the budget summary "0/1800 Cal"
    When I view the date "2026-11-03"
    Then I see the budget summary "0/1800 Cal"
    When I view the date "2026-11-01"
    Then I see the budget summary "0/2050 Cal"

  Scenario: Days before the first budget have no budget
    When I view the date "2026-11-02"
    And I set the budget to 2050 calories
    And I view the date "2026-11-01"
    Then I see the budget summary "0 Cal"

  Scenario: The budget persists after reloading
    When I set the budget to 2050 calories
    And I reload the app
    And I view the date "2026-11-01"
    Then I see the budget summary "0/2050 Cal"
