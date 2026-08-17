Feature: Patient-facing device status
  The companion app presents device state to a patient in plain language, drawn
  only from the approved non-clinical vocabulary and the non-clinical channel.

  @tests:HPD-10
  Scenario Outline: Battery level maps to approved plain-language status
    Given the device reports a battery level of <percent> percent
    When the companion app renders the device status
    Then the status shown is "<status>"
    And the status text comes from the approved non-clinical vocabulary
    And no clinical field is present on the non-clinical channel

    Examples:
      | percent | status      |
      | 85      | Good        |
      | 40      | Getting low |
      | 12      | Charge now  |
