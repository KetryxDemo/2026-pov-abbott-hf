/*
 * annotationPanel.tsx
 *
 * Interface: IFACE-CP-2 - Clinician Annotation Panel
 * Implements: SWR-CP-6 (Clinician trend annotation)
 *
 * Illustrative React component. Demo content only.
 */

import * as React from "react";
import { appendAuditLogEntry } from "./auditLog";

interface AnnotationPanelProps {
  patientId: string;
  clinicianId: string;
  chartTimestampUnix: number;
}

export function AnnotationPanel({
  patientId,
  clinicianId,
  chartTimestampUnix,
}: AnnotationPanelProps): JSX.Element {
  const [note, setNote] = React.useState("");

  function handleSave(): void {
    // Persists the note attached to this chart position, and records
    // an audit entry per SWR-CP-5 - annotation writes are treated as
    // telemetry access for audit purposes.
    saveAnnotation({ patientId, clinicianId, chartTimestampUnix, note });
    appendAuditLogEntry({
      clinicianId,
      patientId,
      action: "annotation-added",
      timestampUnix: Date.now() / 1000,
    });
    setNote("");
  }

  return (
    <div className="annotation-panel">
      <textarea value={note} onChange={(e) => setNote(e.target.value)} />
      <button onClick={handleSave}>Save note</button>
    </div>
  );
}

function saveAnnotation(entry: {
  patientId: string;
  clinicianId: string;
  chartTimestampUnix: number;
  note: string;
}): void {
  // Demo stub: real implementation persists to the portal's note store,
  // visible to any clinician with access on next review (IFACE-CP-2
  // behavior spec).
  void entry;
}
