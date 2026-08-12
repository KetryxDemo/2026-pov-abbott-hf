/*
 * telemetry_publisher.h
 *
 * Design doc: pump-controller/design/telemetry-publisher-unit-design.md
 * Unit: UNIT-PCF-4 - Telemetry Publisher Unit
 */

#ifndef TELEMETRY_PUBLISHER_H
#define TELEMETRY_PUBLISHER_H

#include <stdint.h>

typedef enum {
    PATIENT_STATUS_NOMINAL = 0,
    PATIENT_STATUS_ATTENTION = 1,
    PATIENT_STATUS_CHARGE_NOW = 2,
} patient_status_flag_t;

/* Clinical channel payload - full fidelity, see
 * telemetry-gateway/api-spec.yaml "Clinical Channel" section. */
typedef struct {
    uint16_t speed_rpm;
    int32_t  flow_estimate_centiliters_per_min;
    int16_t  filling_pressure_trend_proxy_x10;
    uint32_t timestamp_unix;
} clinical_telemetry_sample_t;

/* Non-clinical channel payload - filtered, see
 * telemetry-gateway/api-spec.yaml "Non-Clinical Channel" section.
 * Deliberately does NOT include speed, flow, pressure, or alarm state. */
typedef struct {
    uint8_t battery_pct;
    patient_status_flag_t status_flag;
    uint32_t timestamp_unix;
} nonclinical_telemetry_sample_t;

void telemetry_publisher_init(void);

/* Publishes clinical channel sample at 1 Hz per SWR-PCF-4. */
void telemetry_publisher_publish_clinical(const clinical_telemetry_sample_t *sample);

/* Publishes non-clinical channel sample per SWR-PCF-5. */
void telemetry_publisher_publish_nonclinical(const nonclinical_telemetry_sample_t *sample);

/* Watchdog check - see design doc for FMEA-PCF-4 control-gap discussion.
 * Returns 1 if the publisher task has missed its expected publish
 * cadence beyond a staleness threshold. */
uint8_t telemetry_publisher_watchdog_check(void);

#endif /* TELEMETRY_PUBLISHER_H */
