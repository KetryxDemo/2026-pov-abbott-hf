/*
 * battery_monitor.h
 *
 * Supporting unit (not separately spec'd in the build sheet) - feeds
 * battery state-of-charge and general status flag into
 * telemetry_publisher.c's non-clinical channel payload (SWR-PCF-5).
 */

#ifndef BATTERY_MONITOR_H
#define BATTERY_MONITOR_H

#include <stdint.h>

/* Illustrative thresholds for the plain-language status flag consumed
 * by the Patient Companion App (SWR-PCA-1). */
#define BATTERY_ATTENTION_THRESHOLD_PCT 30
#define BATTERY_CHARGE_NOW_THRESHOLD_PCT 15

void battery_monitor_init(void);

/* Sample the battery fuel gauge. Demo stub returns a simulated value. */
uint8_t battery_monitor_read_pct(void);

#endif /* BATTERY_MONITOR_H */
