/*
 * nonClinicalTelemetryClient.ts
 *
 * Client for the Device Telemetry Gateway API, Non-Clinical Channel.
 * Every companion app widget that needs device status goes through
 * this client - it is the only place in this subsystem that talks to
 * the gateway, which keeps the classification boundary enforcement
 * (SWR-PCA-5) easy to audit in one place.
 *
 * Illustrative client. Demo content only.
 */

export type PatientStatusFlag = "Nominal" | "Attention" | "Charge Now";

export interface NonClinicalStatus {
  batteryPct: number;
  statusFlag: PatientStatusFlag;
  timestampUnix: number;
}

const NONCLINICAL_CHANNEL_BASE_URL = "https://telemetry-gateway.demo.local/nonclinical";

/**
 * Fetches the current non-clinical status for a device. The response
 * shape intentionally only contains batteryPct, statusFlag, and a
 * timestamp - there is no field here that could carry speed, flow,
 * pressure, or alarm data (see telemetry-gateway/api-spec.yaml,
 * Non-Clinical Channel section).
 */
export async function fetchNonClinicalStatus(
  deviceId: string
): Promise<NonClinicalStatus> {
  const response = await fetch(
    `${NONCLINICAL_CHANNEL_BASE_URL}/devices/${deviceId}/status`,
    { headers: { Accept: "application/json" } }
  );

  if (!response.ok) {
    throw new Error(`Non-clinical status retrieval failed: ${response.status}`);
  }

  return (await response.json()) as NonClinicalStatus;
}
