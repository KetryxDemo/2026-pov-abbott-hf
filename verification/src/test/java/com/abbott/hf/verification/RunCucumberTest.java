package com.abbott.hf.verification;

import io.cucumber.junit.Cucumber;
import io.cucumber.junit.CucumberOptions;
import org.junit.runner.RunWith;

/**
 * System-level verification suite for the Heart Pump Digital Platform.
 *
 * Scenarios are tagged with the system requirement they verify. Ketryx reads
 * those tags when it scans the repository and creates the Test Case to
 * requirement trace links from them.
 */
@RunWith(Cucumber.class)
@CucumberOptions(
    features = "features",
    glue = "com.abbott.hf.verification",
    plugin = { "pretty", "json:target/cucumber-report.json" }
)
public class RunCucumberTest {
}
