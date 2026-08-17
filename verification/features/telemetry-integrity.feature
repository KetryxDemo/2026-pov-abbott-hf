Feature: Operating-parameter log integrity
  Every operating-parameter sample published by the pump must survive the round
  trip to the telemetry gateway, in order, so the clinical record is complete.

  @tests:HPD-9
  Scenario: All published samples are retrievable in order
    Given the pump has published 90 operating-parameter samples
    When the gateway is queried for the operating-parameter log
    Then all 90 samples are returned in order
