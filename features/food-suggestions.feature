Feature: Food suggestions

  Background:
    Given I open the app

  Scenario: Suggest foods while typing a name
    When I type "banana" in the food name
    Then I see the suggestion "Bananas, raw"

  Scenario: Choosing a suggestion fills in the food
    When I type "banana" in the food name
    And I choose the suggestion "Bananas, raw"
    Then the food name is "Bananas, raw"
    And the calories are 112
    And I see no suggestions

  Scenario: A suggested food can be added
    When I type "banana" in the food name
    And I choose the suggestion "Bananas, raw"
    And I add the food
    Then I see the food "Bananas, raw" with 112 calories per "1 serving" in the food list

  Scenario: No suggestions for unknown text
    When I type "zzzzqq" in the food name
    Then I see no suggestions
