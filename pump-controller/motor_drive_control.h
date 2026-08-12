/*
 * motor_drive_control.h
 *
 * Design doc: pump-controller/design/motor-drive-control-unit-design.md
 * Unit: UNIT-PCF-1 - Motor Drive Control Unit
 *
 * Illustrative interface for the rotor speed control loop. All figures
 * are demo values, not real device specifications.
 */

#ifndef MOTOR_DRIVE_CONTROL_H
#define MOTOR_DRIVE_CONTROL_H

#include <stdint.h>

/* Commanded rotor speed setpoint, in RPM (illustrative). */
typedef struct {
    uint16_t setpoint_rpm;
    uint8_t  clinician_auth_token_present;
} motor_setpoint_t;

/* Initialize the motor drive control loop and PID state. */
void motor_drive_init(void);

/* Apply a new commanded setpoint. Rejected if auth token is missing
 * (see SWR-PCF-6, enforced in alarm_manager.c / auth path). */
int motor_drive_set_setpoint(const motor_setpoint_t *setpoint);

/* Called at the control loop rate (illustrative 100 Hz) to update motor
 * drive current based on measured vs commanded rotor speed. */
void motor_drive_update(uint16_t measured_rpm_x10);

/* Returns the current measured rotor speed, RPM x10 for one decimal
 * of precision without floating point. */
uint16_t motor_drive_get_measured_rpm_x10(void);

#endif /* MOTOR_DRIVE_CONTROL_H */
