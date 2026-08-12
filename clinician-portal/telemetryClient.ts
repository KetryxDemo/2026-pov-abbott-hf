/*
 * telemetryClient.ts
 *
 * Design doc: clinician-portal/design/telemetry-retrieval-unit-design.md
 * Unit: UNIT-CP-1 - Telemetry Retrieval Unit
 * Implements: SWR-CP-1 (Display 90-day trend from telemetry gateway)
 *
 * Illustrative client for the Device Telemetry Gateway API, Clinical
 * Channel. Demo content only.
 */

export interface ClinicalTelemetrySample {
  timestampUnix: number;
  speedRpm: number;
  flowEstimateLPerMin: number;
  fillingPressureTrendProxyMmHg: number; // illustrative unit
}

export interface TrendWindowOptions {
  patientId: string;
  windowDays: number; // illustrative default: 90
}

const CLINICAL_CHANNEL_BASE_URL = "https://telemetry-gateway.demo.local/clinical";

/**
 * Retrieves up to `windowDays` of trend samples for a patient from the
 * clinical channel of the Device Telemetry Gateway API.
 *
 * See telemetry-gateway/api-spec.yaml for the wire format this
 * consumes.
 */
export async function fetchTrendWindow(
  options: TrendWindowOptions
): Promise<ClinicalTelemetrySample[]> {
  const url = `${CLINICAL_CHANNEL_BASE_URL}/patients/${options.patientId}/trend?days=${options.windowDays}`;

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Telemetry retrieval failed: ${response.status}`);
  }

  const payload = (await response.json()) as ClinicalTelemetrySample[];
  return payload;
}

/**
 * Checks the age of the most recent sample against a freshness
 * threshold. Used by the Trend Chart Rendering Unit to decide whether
 * to show a data-age badge (TASK-CP-3).
 */
export function isStale(
  samples: ClinicalTelemetrySample[],
  maxAgeSeconds: number
): boolean {
  if (samples.length === 0) {
    return true;
  }
  const latest = samples[samples.length - 1];
  const ageSeconds = Date.now() / 1000 - latest.timestampUnix;
  return ageSeconds > maxAgeSeconds;
}
