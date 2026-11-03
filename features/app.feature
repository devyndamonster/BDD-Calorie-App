Feature: App shell

  Scenario: The app loads
    Given I open the app
    Then I do not see an app title
    And I see the budget summary "0 Cal"
