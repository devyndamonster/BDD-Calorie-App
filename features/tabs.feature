Feature: Tabs

  Background:
    Given I open the app

  Scenario: The log tab is shown first
    Then I see the "Log" tab selected
    And I see the daily log section

  Scenario: Switch to the food tab
    When I open the "Food" tab
    Then I see the "Food" tab selected
    And I see the food form

  Scenario: Switch to the me tab
    When I open the "Me" tab
    Then I see the "Me" tab selected
    And I see the budget form

  Scenario: Only the current tab's content is shown
    When I open the "Food" tab
    Then I do not see the daily log section
    And I do not see the budget form

  Scenario: The date is kept when switching tabs
    When I view the date "2026-11-02"
    And I open the "Me" tab
    And I open the "Log" tab
    Then the date is "2026-11-02"
