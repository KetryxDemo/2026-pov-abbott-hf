/*
 * trendsDashboard.tsx
 *
 * Design doc: clinician-portal/design/trend-chart-rendering-unit-design.md
 * Unit: UNIT-CP-2 - Trend Chart Rendering Unit
 * Implements: SWR-CP-2 (Flag sustained low-flow trend),
 *             SWR-CP-3 (Display filling-pressure-trend proxy with units)
 * Interface: IFACE-CP-1 - Patient Trend Dashboard
 *
 * Illustrative React component. Demo content only.
 */

import * as React from "react";
import { ClinicalTelemetrySample, fetchTrendWindow, isStale } from "./telemetryClient";

// SWR-CP-2: flag periods where estimated flow trends below this
// threshold (illustrative). Deliberately a different constant from the
// pump controller's own alarm threshold - see design doc for the
// same-domain-not-directly-linked discussion.
const SUSTAINED_LOW_FLOW_THRESHOLD_L_PER_MIN = 3.0;

const DATA_AGE_STALE_THRESHOLD_SECONDS = 300;

interface TrendsDashboardProps {
  patientId: string;
}

export function TrendsDashboard({ patientId }: TrendsDashboardProps): JSX.Element {
  const [samples, setSamples] = React.useState<ClinicalTelemetrySample[]>([]);
  const [showStaleBadge, setShowStaleBadge] = React.useState(false);

  React.useEffect(() => {
    fetchTrendWindow({ patientId, windowDays: 90 }).then((data) => {
      setSamples(data);
      setShowStaleBadge(isStale(data, DATA_AGE_STALE_THRESHOLD_SECONDS));
    });
  }, [patientId]);

  const lowFlowPeriods = samples.filter(
    (s) => s.flowEstimateLPerMin < SUSTAINED_LOW_FLOW_THRESHOLD_L_PER_MIN
  );

  return (
    <div className="trends-dashboard">
      {showStaleBadge && <span className="data-age-badge">Data may be stale</span>}
      <SpeedFlowSeries samples={samples} lowFlowPeriods={lowFlowPeriods} />
      <PressureTrendSeries samples={samples} />
    </div>
  );
}

function SpeedFlowSeries({
  samples,
  lowFlowPeriods,
}: {
  samples: ClinicalTelemetrySample[];
  lowFlowPeriods: ClinicalTelemetrySample[];
}): JSX.Element {
  // Demo stub: real implementation renders a multi-series chart with
  // low-flow periods shaded (IFACE-CP-1 behavior spec).
  return (
    <div className="speed-flow-series">
      {samples.length} samples, {lowFlowPeriods.length} flagged low-flow
    </div>
  );
}

function PressureTrendSeries({
  samples,
}: {
  samples: ClinicalTelemetrySample[];
}): JSX.Element {
  // NOTE: unit suffix must render alongside the numeric value per
  // SWR-CP-3. See TC-CP-3 - this is the deliberate failing test: an
  // unrelated 1.1 UI refactor dropped the unit suffix below, rendering
  // a bare number instead of "<value> mmHg".
  return (
    <div className="pressure-trend-series">
      {samples.map((s) => (
        <span key={s.timestampUnix}>{s.fillingPressureTrendProxyMmHg}</span>
      ))}
    </div>
  );
}
