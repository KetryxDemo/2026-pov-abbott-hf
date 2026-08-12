/*
 * flow_estimation.h
 *
 * Design doc: pump-controller/design/flow-estimation-unit-design.md
 * Unit: UNIT-PCF-2 - Flow Estimation Unit
 *
 * Illustrative interface for estimating flow rate from motor telemetry.
 */

#ifndef FLOW_ESTIMATION_H
#define FLOW_ESTIMATION_H

#include <stdint.h>

/* Estimated flow rate, in L/min x100 for two decimals of precision
 * without floating point (illustrative units). */
typedef int32_t flow_estimate_centiliters_per_min_t;

/* Initialize flow estimation filter state. */
void flow_estimation_init(void);

/* Update the flow estimate from the latest motor power (mW) and speed
 * (RPM x10) samples. Runs at 1 Hz per SWR-PCF-2. */
void flow_estimation_update(uint32_t motor_power_mw, uint16_t rpm_x10);

/* Returns the current estimated flow rate. */
flow_estimate_centiliters_per_min_t flow_estimation_get_estimate(void);

#endif /* FLOW_ESTIMATION_H */
