/*
 * flow_estimation.c
 *
 * Design doc: pump-controller/design/flow-estimation-unit-design.md
 * Unit: UNIT-PCF-2 - Flow Estimation Unit
 * Implements: SWR-PCF-2 (Flow estimation from motor telemetry)
 *
 * Illustrative flow estimation from motor power/speed signals. Demo
 * content only - the coefficients below are not derived from any real
 * bench characterization.
 */

#include "flow_estimation.h"

/* Illustrative linear model coefficients relating motor power and speed
 * to estimated flow. Not derived from real bench data. */
#define POWER_COEFF_X1000 37
#define SPEED_COEFF_X1000 (-9)
#define BASELINE_OFFSET_CENTILITERS 12

/* Simple exponential smoothing to avoid noisy single-sample spikes
 * feeding directly into the low-flow alarm path (see alarm_manager.c). */
#define SMOOTHING_SHIFT 2

static flow_estimate_centiliters_per_min_t s_smoothed_estimate;

void flow_estimation_init(void)
{
    s_smoothed_estimate = 0;
}

void flow_estimation_update(uint32_t motor_power_mw, uint16_t rpm_x10)
{
    int64_t raw_estimate;

    raw_estimate = ((int64_t)motor_power_mw * POWER_COEFF_X1000
        + (int64_t)rpm_x10 * SPEED_COEFF_X1000) / 1000
        + BASELINE_OFFSET_CENTILITERS;

    if (raw_estimate < 0) {
        raw_estimate = 0;
    }

    /* Exponential smoothing: new = old + (raw - old) / 2^SMOOTHING_SHIFT */
    s_smoothed_estimate += ((int32_t)raw_estimate - s_smoothed_estimate)
        >> SMOOTHING_SHIFT;
}

flow_estimate_centiliters_per_min_t flow_estimation_get_estimate(void)
{
    return s_smoothed_estimate;
}
