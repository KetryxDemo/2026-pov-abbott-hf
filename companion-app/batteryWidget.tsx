/*
 * batteryWidget.tsx
 *
 * Design doc: companion-app/design/battery-status-widget-unit-design.md
 * Unit: UNIT-PCA-1 - Battery Status Widget Unit
 * Implements: SWR-PCA-1 (Plain-language battery status indicator),
 *             SWR-PCA-5 (No clinical data surfaced)
 *
 * Illustrative mobile widget. Demo content only.
 */

import * as React from "react";
import { fetchNonClinicalStatus, PatientStatusFlag } from "./nonClinicalTelemetryClient";

type PlainLanguageBatteryLabel = "Full" | "Good" | "Low" | "Charge Now";

function toPlainLanguageLabel(
  batteryPct: number,
  statusFlag: PatientStatusFlag
): PlainLanguageBatteryLabel {
  // SWR-PCA-1: derived only from the non-clinical status flag and
  // battery percentage - never from any clinical value, since none is
  // available to this widget in the first place (SWR-PCA-5).
  if (statusFlag === "Charge Now") {
    return "Charge Now";
  }
  if (batteryPct >= 80) {
    return "Full";
  }
  if (batteryPct >= 30) {
    return "Good";
  }
  return "Low";
}

interface BatteryWidgetProps {
  deviceId: string;
}

export function BatteryWidget({ deviceId }: BatteryWidgetProps): JSX.Element {
  const [label, setLabel] = React.useState<PlainLanguageBatteryLabel | null>(null);

  React.useEffect(() => {
    fetchNonClinicalStatus(deviceId).then((status) => {
      setLabel(toPlainLanguageLabel(status.batteryPct, status.statusFlag));
    });
  }, [deviceId]);

  if (!label) {
    return <div className="battery-widget">Loading...</div>;
  }

  return <div className="battery-widget">{label}</div>;
}
