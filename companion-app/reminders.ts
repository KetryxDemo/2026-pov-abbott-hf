/*
 * reminders.ts
 *
 * Design doc: companion-app/design/reminder-scheduling-unit-design.md
 * Unit: UNIT-PCA-3 - Reminder Scheduling Unit
 * Implements: SWR-PCA-2 (Appointment reminders),
 *             SWR-PCA-4 (Supply reorder reminders)
 *
 * Illustrative reminder scheduler. Demo content only.
 */

export interface AppointmentReminder {
  appointmentId: string;
  scheduledUnix: number;
  reminderLeadHours: number; // illustrative default: 24
}

export interface SupplyReorderReminder {
  supplyType: "battery" | "dressing-kit";
  lastRestockUnix: number;
  reorderIntervalDays: number; // illustrative per-supply default
}

const SUPPLY_REORDER_INTERVAL_DAYS: Record<SupplyReorderReminder["supplyType"], number> = {
  battery: 90,
  "dressing-kit": 14,
};

/**
 * Returns true if an appointment reminder should fire now, based on the
 * configured lead time (SWR-PCA-2). Pulled from the care-team calendar
 * integration (not modeled in this repo).
 */
export function shouldFireAppointmentReminder(
  reminder: AppointmentReminder,
  nowUnix: number
): boolean {
  const leadSeconds = reminder.reminderLeadHours * 3600;
  return nowUnix >= reminder.scheduledUnix - leadSeconds && nowUnix < reminder.scheduledUnix;
}

/**
 * Returns true if a supply reorder reminder should fire, based on
 * elapsed-time logistics rules (SWR-PCA-4). Illustrative per-supply
 * intervals only - not derived from real consumable lifetime data.
 */
export function shouldFireSupplyReorderReminder(
  reminder: SupplyReorderReminder,
  nowUnix: number
): boolean {
  const intervalSeconds =
    (reminder.reorderIntervalDays || SUPPLY_REORDER_INTERVAL_DAYS[reminder.supplyType]) * 86400;
  return nowUnix - reminder.lastRestockUnix >= intervalSeconds;
}
