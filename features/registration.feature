@registration @regression
Feature: Registration

  As a new user
  I want to register an account
  So that I can access the application

  @smoke
  Scenario: User registers with random details
    Given the user is on the registration page
    When the user fills the registration form with random details
    And the user submits the registration form
    Then the user should see a success message
