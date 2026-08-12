/*
 * battery_monitor.c
 *
 * Supporting unit feeding telemetry_publisher.c's non-clinical channel
 * (SWR-PCF-5). Demo content only - not a real fuel-gauge driver.
 */

#include "battery_monitor.h"

static uint8_t s_simulated_pct;

void battery_monitor_init(void)
{
    /* Demo stub starts at a plausible mid-life charge level. */
    s_simulated_pct = 62;
}

uint8_t battery_monitor_read_pct(void)
{
    /* Demo stub: real implementation reads the fuel gauge over I2C.
     * Returns the last simulated value; a real driver would sample
     * hardware here. */
    return s_simulated_pct;
}
