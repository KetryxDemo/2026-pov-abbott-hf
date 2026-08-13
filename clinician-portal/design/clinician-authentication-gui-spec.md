---
itemId: gui-cp-2
itemType: Software Item Spec
itemTitle: Clinician Authentication Screen GUI Spec
Software item type: Interface
itemFulfills: KXITM2KM39STRGH9G1S09048RD408HF
---

# Clinician Authentication Screen GUI Spec

## Component

The authentication screen a clinician passes through before any patient
telemetry is displayed. Covers credential entry, the second-factor
challenge, and the failure and lockout states.

## Layout

```mermaid
flowchart TB
    CRED[Credential entry] --> MFA[Second-factor challenge]
    MFA -->|accepted| DASH[Patient Trend Dashboard]
    MFA -->|rejected| FAIL[Failure state with retry]
    FAIL -->|repeated failures| LOCK[Lockout state]
```

## Behavior

| Element | Required behavior | Satisfies |
| --- | --- | --- |
| Credential entry | Accepts clinician credentials. No patient data is present anywhere in the page before authentication completes. | Require MFA before displaying patient telemetry |
| Second-factor challenge | Always presented. It cannot be skipped, deferred, or remembered across sessions. | Require MFA before displaying patient telemetry |
| Failure state | States that authentication failed without revealing which factor was wrong. | Require MFA before displaying patient telemetry |
| Lockout state | After repeated failures, entry is blocked and the event is written to the audit log. | Require MFA before displaying patient telemetry |

## Notes

The screen is a risk control surface, not a convenience feature. The
"cannot be remembered across sessions" rule exists so a shared
workstation cannot become an unauthenticated path to patient telemetry.
