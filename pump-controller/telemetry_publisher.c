/*
 * telemetry_publisher.c
 *
 * Design doc: pump-controller/design/telemetry-publisher-unit-design.md
 * Unit: UNIT-PCF-4 - Telemetry Publisher Unit
 * Implements: SWR-PCF-4 (clinical channel), SWR-PCF-5 (non-clinical channel)
 *
 * Illustrative publisher that pushes operating parameters to the
 * Device Telemetry Gateway on both channels. Demo content only.
 *
 * NOTE on FMEA-PCF-4: at 1.0 this task has no staleness detection - if
 * the publisher task starves under high CPU load, the gateway keeps
 * showing the last-known sample with no flag that it is stale. The
 * watchdog below is the 1.0.1 hotfix that closes that gap
 * (TASK-PCF-2).
 */

#include "telemetry_publisher.h"

#define EXPECTED_PUBLISH_INTERVAL_SEC 1
#define STALENESS_THRESHOLD_SEC 5

static uint32_t s_last_clinical_publish_unix;
static uint32_t s_last_nonclinical_publish_unix;
static uint32_t s_current_time_unix;

void telemetry_publisher_init(void)
{
    s_last_clinical_publish_unix = 0;
    s_last_nonclinical_publish_unix = 0;
    s_current_time_unix = 0;
}

void telemetry_publisher_publish_clinical(const clinical_telemetry_sample_t *sample)
{
    if (sample == NULL) {
        return;
    }

    /* Demo stub: real implementation writes to the gateway transport.
     * See telemetry-gateway/api-spec.yaml, Clinical Channel section. */
    s_last_clinical_publish_unix = sample->timestamp_unix;
    s_current_time_unix = sample->timestamp_unix;
}

void telemetry_publisher_publish_nonclinical(const nonclinical_telemetry_sample_t *sample)
{
    if (sample == NULL) {
        return;
    }

    /* Demo stub: real implementation writes to the gateway transport.
     * See telemetry-gateway/api-spec.yaml, Non-Clinical Channel section.
     * Field allow-list is enforced by the sample struct shape itself -
     * there is no field on nonclinical_telemetry_sample_t that could
     * leak speed/flow/pressure/alarm data (SWR-PCF-5). */
    s_last_nonclinical_publish_unix = sample->timestamp_unix;
    s_current_time_unix = sample->timestamp_unix;
}

uint8_t telemetry_publisher_watchdog_check(void)
{
    uint32_t clinical_age = s_current_time_unix - s_last_clinical_publish_unix;
    uint32_t nonclinical_age = s_current_time_unix - s_last_nonclinical_publish_unix;

    if (clinical_age > STALENESS_THRESHOLD_SEC
        || nonclinical_age > STALENESS_THRESHOLD_SEC) {
        return 1;
    }
    return 0;
}
