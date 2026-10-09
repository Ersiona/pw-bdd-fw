@login @regression
Feature: Login

  As a registered user
  I want to log in with my credentials
  So that I can access my dashboard

  Background:
    Given the user is on the login page

  @smoke
  Scenario: User logs in with valid credentials
    When the user enters valid credentials
    And the user clicks the login button
    Then the user should be successfully logged in
    And the user should see the welcome message

  @regression
  Scenario: User logs in with invalid credentials
    When the user enters invalid credentials
    And the user clicks the login button
    Then the user should see an error message

  @regression
  Scenario Outline: User attempts to log in with missing fields
    When the user enters username "<username>" and password "<password>"
    And the user clicks the login button
    Then the user should see the error message "<error>"

    Examples:
      | username | password | error                                |
      |          |          | Username and password are required. |
