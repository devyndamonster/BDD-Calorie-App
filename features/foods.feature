Feature: Foods

  Scenario: Create a food with calories
    Given I open the app
    When I add a food "Apple" with 95 calories
    Then I see the food "Apple" with 95 calories in the food list

  Scenario: Create a food with a serving size
    Given I open the app
    When I add a food "Apple" with 95 calories per "1 medium"
    Then I see the food "Apple" with 95 calories per "1 medium" in the food list

  Scenario: A food needs a name
    Given I open the app
    When I add a food "" with 95 calories
    Then I see the error "Name is required"
    And the food list is empty

  Scenario: Calories cannot be negative
    Given I open the app
    When I add a food "Apple" with -5 calories
    Then I see the error "Calories must be zero or more"
    And the food list is empty

  Scenario: Foods persist after reloading
    Given I open the app
    And I add a food "Banana" with 105 calories
    When I reload the app
    Then I see the food "Banana" with 105 calories in the food list

  Scenario: Edit an existing food
    Given I open the app
    And I add a food "Apple" with 95 calories
    When I edit the food "Apple"
    And I change the food to "Green apple" with 80 calories per "1 small"
    Then I see the food "Green apple" with 80 calories per "1 small" in the food list

  Scenario: Edited foods persist after reloading
    Given I open the app
    And I add a food "Apple" with 95 calories
    And I edit the food "Apple"
    And I change the food to "Green apple" with 80 calories per "1 small"
    When I reload the app
    Then I see the food "Green apple" with 80 calories per "1 small" in the food list
