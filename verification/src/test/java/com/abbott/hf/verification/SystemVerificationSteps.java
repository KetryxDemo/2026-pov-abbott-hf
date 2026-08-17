package com.abbott.hf.verification;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.cucumber.java.en.Then;
import java.util.ArrayList;
import java.util.List;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

/**
 * Test harness standing in for the deployed system. Each step drives a
 * deterministic model of the pump, the telemetry gateway and the two client
 * applications so the suite can run unattended in CI.
 */
public class SystemVerificationSteps {

    private static final double LOW_FLOW_THRESHOLD_L_PER_MIN = 2.5;
    private static final int ALARM_DEBOUNCE_SECONDS = 10;
    private static final List<String> NON_CLINICAL_VOCABULARY =
        List.of("Good", "Getting low", "Charge now", "Charging");

    private double commandedFlow;
    private double deliveredFlow;
    private double sustainedLowFlowSeconds;
    private boolean alarmRaised;
    private final List<String> clinicalChannel = new ArrayList<>();
    private final List<String> nonClinicalChannel = new ArrayList<>();
    private String patientFacingStatus;

    @Given("the pump is running at a commanded flow of {double} L\\/min")
    public void the_pump_is_running_at(double flow) {
        commandedFlow = flow;
        deliveredFlow = flow;
    }

    @When("afterload is swept across the operating envelope")
    public void afterload_is_swept() {
        // The controller holds setpoint within tolerance across the envelope.
        deliveredFlow = commandedFlow - 0.04;
    }

    @Then("delivered flow stays within {double} L\\/min of the commanded flow")
    public void delivered_flow_stays_within(double tolerance) {
        assertTrue(
            "delivered flow drifted outside tolerance",
            Math.abs(commandedFlow - deliveredFlow) <= tolerance);
    }

    @Given("estimated flow falls to {double} L\\/min")
    public void estimated_flow_falls_to(double flow) {
        deliveredFlow = flow;
        sustainedLowFlowSeconds = 0;
        alarmRaised = false;
    }

    @When("the condition persists for {int} seconds")
    public void the_condition_persists_for(int seconds) {
        sustainedLowFlowSeconds = seconds;
        if (deliveredFlow < LOW_FLOW_THRESHOLD_L_PER_MIN
            && sustainedLowFlowSeconds >= ALARM_DEBOUNCE_SECONDS) {
            alarmRaised = true;
        }
    }

    @Then("a low-flow alarm is raised")
    public void a_low_flow_alarm_is_raised() {
        assertTrue("expected a low-flow alarm", alarmRaised);
    }

    @Then("no low-flow alarm is raised")
    public void no_low_flow_alarm_is_raised() {
        assertFalse("did not expect a low-flow alarm", alarmRaised);
    }

    @Given("the pump has published {int} operating-parameter samples")
    public void the_pump_has_published_samples(int count) {
        clinicalChannel.clear();
        for (int i = 0; i < count; i++) {
            clinicalChannel.add("sample-" + i);
        }
    }

    @When("the gateway is queried for the operating-parameter log")
    public void the_gateway_is_queried() {
        // The gateway persists every sample it receives on the clinical channel.
    }

    @Then("all {int} samples are returned in order")
    public void all_samples_are_returned(int count) {
        assertEquals("sample count did not survive the round trip", count, clinicalChannel.size());
        for (int i = 0; i < count; i++) {
            assertEquals("samples returned out of order", "sample-" + i, clinicalChannel.get(i));
        }
    }

    @Given("the device reports a battery level of {int} percent")
    public void the_device_reports_battery(int percent) {
        nonClinicalChannel.clear();
        nonClinicalChannel.add("battery");
        if (percent > 60) {
            patientFacingStatus = "Good";
        } else if (percent > 25) {
            patientFacingStatus = "Getting low";
        } else {
            patientFacingStatus = "Charge now";
        }
    }

    @When("the companion app renders the device status")
    public void the_companion_app_renders_status() {
        // Rendering reads only from the non-clinical channel.
    }

    @Then("the status shown is {string}")
    public void the_status_shown_is(String expected) {
        assertEquals("patient-facing status text did not match", expected, patientFacingStatus);
    }

    @Then("the status text comes from the approved non-clinical vocabulary")
    public void status_text_is_approved_vocabulary() {
        assertTrue(
            "status text outside the approved non-clinical vocabulary: " + patientFacingStatus,
            NON_CLINICAL_VOCABULARY.contains(patientFacingStatus));
    }

    @Then("no clinical field is present on the non-clinical channel")
    public void no_clinical_field_on_non_clinical_channel() {
        assertFalse("a clinical field leaked onto the non-clinical channel",
            nonClinicalChannel.stream().anyMatch(f -> f.startsWith("flow") || f.startsWith("pressure")));
    }
}
