Feature: System-level low-flow alarm
  A sustained low-flow condition must alarm, and a transient dip must not,
  so clinicians are alerted without being desensitised by nuisance alarms.

  @tests:HPD-8
  Scenario: Sustained low flow raises an alarm
    Given estimated flow falls to 2.1 L/min
    When the condition persists for 12 seconds
    Then a low-flow alarm is raised

  @tests:HPD-8
  Scenario: A transient dip does not raise an alarm
    Given estimated flow falls to 2.1 L/min
    When the condition persists for 4 seconds
    Then no low-flow alarm is raised
