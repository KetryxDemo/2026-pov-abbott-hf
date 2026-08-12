/*
 * alarm_manager.c
 *
 * Design doc: pump-controller/design/alarm-management-unit-design.md
 * Unit: UNIT-PCF-3 - Alarm Management Unit
 * Implements: SWR-PCF-3 (Low-flow alarm threshold and debounce)
 *
 * Illustrative low-flow alarm detection with a 10-second debounce.
 * Demo content only.
 */

#include "alarm_manager.h"

/*
 * LOW_FLOW_ALARM_THRESHOLD implements SWR-PCF-3: "Firmware shall raise a
 * Low Flow Alarm when estimated flow remains below 2.5 L/min (illustrative)
 * continuously for more than 10 seconds."
 *
 * Units: L/min x100 (centiliters/min-equivalent), to match
 * flow_estimation.h's fixed-point representation. 250 == 2.50 L/min.
 *
 * DEMO SEAM: this is the constant the mid-train requirement-change demo
 * edits when SWR-PCF-3's threshold moves from 2.5 to 2.8 L/min.
 */
#define LOW_FLOW_ALARM_THRESHOLD 250

/* Debounce window per SWR-PCF-3: alarm must persist continuously for
 * more than 10 seconds before latching. Update runs at 1 Hz. */
#define DEBOUNCE_SECONDS 10

static uint8_t s_seconds_below_threshold;
static alarm_state_t s_state;

void alarm_manager_init(void)
{
    s_seconds_below_threshold = 0;
    s_state = ALARM_STATE_NONE;
}

void alarm_manager_update(int32_t flow_estimate_centiliters_per_min)
{
    if (flow_estimate_centiliters_per_min < LOW_FLOW_ALARM_THRESHOLD) {
        if (s_seconds_below_threshold < 255) {
            s_seconds_below_threshold++;
        }
    } else {
        s_seconds_below_threshold = 0;
    }

    if (s_seconds_below_threshold > DEBOUNCE_SECONDS) {
        /* Latches - see alarm_manager_acknowledge(). Drives the LED +
         * buzzer indicator per IFACE-PCF-2. */
        s_state = ALARM_STATE_LOW_FLOW;
    }
}

alarm_state_t alarm_manager_get_state(void)
{
    return s_state;
}

void alarm_manager_acknowledge(void)
{
    s_state = ALARM_STATE_NONE;
    s_seconds_below_threshold = 0;
}
