---
itemId: unit-pca-1
itemType: Software Item Spec
itemTitle: Battery Status Widget Unit
Software item type: Function
itemFulfills: KXITM3XVHX0BDR996TT6DW1TQW9WWH6, KXITM7MAS4TDBB79ZKA27G6V4R6JCM4
---

# Battery Status Widget Unit

## Purpose

The Battery Status Widget Unit gives the patient a plain-language
battery status (Full / Good / Low / Charge Now) without requiring any
clinical interpretation, satisfying UN-3 (plain-language device status
for patient/caregiver).

## Design description

The widget fetches the current non-clinical status from the Device
Telemetry Gateway API's Non-Clinical Channel via
`nonClinicalTelemetryClient.ts`, and maps the returned battery percentage
and coarse status flag to one of four plain-language labels. The mapping
deliberately gives the gateway's own "Charge Now" status flag priority
over the percentage-based thresholds, since the flag reflects the pump
controller's own judgment about urgency and should not be second-guessed
by a simpler percentage cutoff on the app side.

This unit is also one half of the classification-boundary control for
SWR-PCA-5 ("no clinical data surfaced"): the `NonClinicalStatus` type it
consumes has no field capable of carrying speed, flow, pressure, or
alarm data in the first place, so there is no code path in this widget
that could leak clinical data even by mistake. The enforcement lives one
layer down, in the shared telemetry client and, ultimately, in the
Device Telemetry Gateway's Non-Clinical Channel contract itself.

## Interfaces

- Consumes: `NonClinicalStatus` (battery %, status flag) from
  `nonClinicalTelemetryClient.ts`.
- Produces: rendered plain-language battery label (Full/Good/Low/Charge
  Now) in the companion app UI.

## Diagram

```mermaid
flowchart LR
    GW[Gateway: Non-Clinical Channel] --> C[fetchNonClinicalStatus]
    C --> M{statusFlag == Charge Now?}
    M -->|yes| L1[Label: Charge Now]
    M -->|no| P{batteryPct}
    P -->|>=80| L2[Label: Full]
    P -->|30-79| L3[Label: Good]
    P -->|<30| L4[Label: Low]
```
