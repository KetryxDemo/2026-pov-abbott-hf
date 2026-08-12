/*
 * alarm_manager.h
 *
 * Design doc: pump-controller/design/alarm-management-unit-design.md
 * Unit: UNIT-PCF-3 - Alarm Management Unit
 */

#ifndef ALARM_MANAGER_H
#define ALARM_MANAGER_H

#include <stdint.h>

typedef enum {
    ALARM_STATE_NONE = 0,
    ALARM_STATE_LOW_FLOW = 1,
} alarm_state_t;

/* Initialize alarm manager debounce state. */
void alarm_manager_init(void);

/* Feed the latest flow estimate (L/min x100, illustrative) in at 1 Hz.
 * Internally debounces per SWR-PCF-3 before latching the alarm. */
void alarm_manager_update(int32_t flow_estimate_centiliters_per_min);

/* Returns the current latched alarm state. Latches until acknowledged
 * via alarm_manager_acknowledge(). */
alarm_state_t alarm_manager_get_state(void);

/* Clinician/patient acknowledgment clears the latch (device-side only,
 * per UC-3 - this path is deliberately not exposed to the companion
 * app). */
void alarm_manager_acknowledge(void);

#endif /* ALARM_MANAGER_H */
