/*
 * motor_drive_control.c
 *
 * Design doc: pump-controller/design/motor-drive-control-unit-design.md
 * Unit: UNIT-PCF-1 - Motor Drive Control Unit
 * Implements: SWR-PCF-1 (Rotor speed control loop)
 *
 * Illustrative PID-style speed control loop. Demo content only - not a
 * real motor control implementation.
 */

#include "motor_drive_control.h"

/* +/-50 RPM tolerance band from SWR-PCF-1 (illustrative). */
#define SPEED_TOLERANCE_RPM 50

/* Simple PID gains, tuned informally for demo purposes only. */
#define KP_GAIN 12
#define KI_GAIN 2
#define KD_GAIN 4

static int32_t s_integral_accum;
static uint16_t s_measured_rpm_x10;
static uint16_t s_setpoint_rpm;
static uint8_t s_auth_ok;

void motor_drive_init(void)
{
    s_integral_accum = 0;
    s_measured_rpm_x10 = 0;
    s_setpoint_rpm = 0;
    s_auth_ok = 0;
}

int motor_drive_set_setpoint(const motor_setpoint_t *setpoint)
{
    if (setpoint == NULL) {
        return -1;
    }

    /* SWR-PCF-6: reject setpoint changes without a valid clinician auth
     * token; the rejected attempt is logged by the caller. */
    if (!setpoint->clinician_auth_token_present) {
        return -2;
    }

    s_setpoint_rpm = setpoint->setpoint_rpm;
    s_auth_ok = 1;
    return 0;
}

void motor_drive_update(uint16_t measured_rpm_x10)
{
    int32_t error;
    int32_t drive_current_adjust;

    s_measured_rpm_x10 = measured_rpm_x10;

    if (!s_auth_ok) {
        return;
    }

    error = ((int32_t)s_setpoint_rpm * 10) - (int32_t)measured_rpm_x10;
    s_integral_accum += error;

    drive_current_adjust = (KP_GAIN * error) + (KI_GAIN * s_integral_accum)
        - (KD_GAIN * error);

    /* Demo stub: real implementation drives the motor current DAC here.
     * Kept as a no-op to keep this file self-contained. */
    (void)drive_current_adjust;
}

uint16_t motor_drive_get_measured_rpm_x10(void)
{
    return s_measured_rpm_x10;
}
