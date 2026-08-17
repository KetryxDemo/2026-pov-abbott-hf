Feature: System-level flow-rate accuracy
  Delivered pump output must track the commanded flow across the operating
  envelope, since therapy adequacy depends on it.

  @tests:HPD-7
  Scenario: Delivered flow holds setpoint across the operating envelope
    Given the pump is running at a commanded flow of 4.5 L/min
    When afterload is swept across the operating envelope
    Then delivered flow stays within 0.2 L/min of the commanded flow
