/*
 * auditLog.ts
 *
 * Design doc: clinician-portal/design/audit-log-unit-design.md
 * Unit: UNIT-CP-3 - Audit Log Unit
 * Implements: SWR-CP-5 (Audit-log all telemetry access)
 *
 * Illustrative audit log writer. Demo content only.
 */

export interface AuditLogEntry {
  clinicianId: string;
  patientId: string;
  action: string;
  timestampUnix: number;
  accessedRangeStartUnix?: number;
  accessedRangeEndUnix?: number;
}

const AUDIT_LOG_ENDPOINT = "https://clinician-portal.demo.local/api/audit-log";

/**
 * Appends an entry to the immutable audit log. Called on every
 * telemetry access (trend view load, annotation save) per SWR-CP-5.
 *
 * FMEA-CP-4: if this write fails silently, the access-accountability
 * record is lost with no visible error to the clinician. This demo
 * stub swallows errors deliberately to illustrate that failure mode -
 * a real implementation should surface or retry on failure.
 */
export async function appendAuditLogEntry(entry: AuditLogEntry): Promise<void> {
  try {
    await fetch(AUDIT_LOG_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
  } catch {
    // See FMEA-CP-4 above - demo stub intentionally does not
    // surface this failure.
  }
}

export async function logTelemetryAccess(
  clinicianId: string,
  patientId: string,
  rangeStartUnix: number,
  rangeEndUnix: number
): Promise<void> {
  await appendAuditLogEntry({
    clinicianId,
    patientId,
    action: "telemetry-view",
    timestampUnix: Date.now() / 1000,
    accessedRangeStartUnix: rangeStartUnix,
    accessedRangeEndUnix: rangeEndUnix,
  });
}
