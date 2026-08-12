/*
 * trendsLiteWidget.tsx
 *
 * Design doc: companion-app/design/trends-widget-unit-design.md
 * Unit: UNIT-PCA-2 - Trends Widget Unit
 * Implements: SWR-PCA-3 ("How you're trending" wellness widget),
 *             SWR-PCA-5 (No clinical data surfaced)
 *
 * Illustrative mobile widget. Demo content only.
 */

import * as React from "react";
import { fetchNonClinicalStatus, PatientStatusFlag } from "./nonClinicalTelemetryClient";

type WellnessMessage = "Steady" | "Check in with your care team";

function toWellnessMessage(statusFlag: PatientStatusFlag): WellnessMessage {
  // SWR-PCA-3: non-diagnostic wording only, derived exclusively from
  // the non-clinical status flag. This widget has no access to raw
  // clinical values (speed, flow, pressure, alarm state) at all - the
  // Device Telemetry Gateway's Non-Clinical Channel never carries them
  // in the first place, so there is nothing here to accidentally leak
  // (SWR-PCA-5).
  if (statusFlag === "Nominal") {
    return "Steady";
  }
  return "Check in with your care team";
}

interface TrendsLiteWidgetProps {
  deviceId: string;
}

export function TrendsLiteWidget({ deviceId }: TrendsLiteWidgetProps): JSX.Element {
  const [message, setMessage] = React.useState<WellnessMessage | null>(null);

  React.useEffect(() => {
    fetchNonClinicalStatus(deviceId).then((status) => {
      setMessage(toWellnessMessage(status.statusFlag));
    });
  }, [deviceId]);

  return <div className="trends-lite-widget">{message ?? "..."}</div>;
}
