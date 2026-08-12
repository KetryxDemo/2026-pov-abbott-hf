# Heart Pump Digital Platform

Demo source repository for the Heart Pump Digital Platform - a generic circulatory
support device plus its supporting digital ecosystem. This repository is
illustrative demo content only. All clinical numbers (flow rates, RPM, pressures,
thresholds, battery figures, durations) are invented for demonstration purposes
and do not reflect any real medical device. No real product names are used;
components are referred to generically as "the pump," "the controller," "the
companion app," and "the clinician portal."

## System overview

The platform is made up of three subsystems and one shared interface layer:

- **Pump Controller Firmware** (medical subsystem) - on-device firmware that
  drives the pump motor, estimates flow, manages alarms, and publishes
  operating telemetry.
- **Clinician Portal** (medical subsystem) - a web application clinicians use
  to remotely review pump trend data between in-person visits.
- **Patient Companion App** (non-medical subsystem, downclassified) - a mobile
  app that gives patients plain-language battery/status information and helps
  them manage day-to-day device logistics (charging, supply reorder,
  appointments). It never surfaces clinical data or alarm state.
- **Device Telemetry Gateway** (shared component) - the interface boundary
  between the pump controller and the two client subsystems. It exposes two
  logically separate channels: a full-fidelity **clinical channel** consumed
  by the Clinician Portal, and a filtered **non-clinical channel** consumed by
  the Patient Companion App. This is also the classification boundary: the
  clinical channel carries medical-grade data, the non-clinical channel
  deliberately does not.

## Repository layout

```
pump-controller/       on-device firmware sources + design docs
clinician-portal/      web portal sources + design docs
companion-app/         mobile companion app sources + design docs
telemetry-gateway/     shared API spec (clinical + non-clinical channels) + design doc
```

## Why the classification boundary matters

The Patient Companion App is intentionally non-medical: it is downclassified
because it only ever consumes the non-clinical channel of the telemetry
gateway, which excludes raw waveform data, alarm state, and pump speed/flow
values. This lets the companion app move on an independent, faster release
cadence without triggering the same validation rigor as the two medical
subsystems - while the Device Telemetry Gateway is the single place that
enforces what data is allowed to cross that boundary.

See `REPO_NOTES.md` for how this repository maps into Ketryx.
