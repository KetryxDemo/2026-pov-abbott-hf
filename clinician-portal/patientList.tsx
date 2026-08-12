/*
 * patientList.tsx
 *
 * Supporting portal view (not separately spec'd in the build sheet) -
 * clinician landing page listing patients under remote follow-up,
 * gated behind the MFA login flow (SWR-CP-4).
 *
 * Illustrative React component. Demo content only.
 */

import * as React from "react";
import { requireMfaSession } from "./mfaGate";

interface PatientSummary {
  patientId: string;
  displayName: string;
  lastFollowUpUnix: number;
  hasUnreviewedLowFlowFlag: boolean;
}

export function PatientList(): JSX.Element {
  const [patients, setPatients] = React.useState<PatientSummary[]>([]);

  React.useEffect(() => {
    // SWR-CP-4: MFA must be established before any patient telemetry
    // (including summary flags derived from it) is displayed.
    requireMfaSession().then(() => {
      fetchAssignedPatients().then(setPatients);
    });
  }, []);

  return (
    <ul className="patient-list">
      {patients.map((p) => (
        <li key={p.patientId} className={p.hasUnreviewedLowFlowFlag ? "flagged" : ""}>
          {p.displayName}
        </li>
      ))}
    </ul>
  );
}

async function fetchAssignedPatients(): Promise<PatientSummary[]> {
  // Demo stub: real implementation queries the portal's patient roster
  // service.
  return [];
}
