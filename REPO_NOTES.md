# Repo notes for builders

This repository backs the Abbott Heart Failure heart-pump digital platform
demo org. It is watched by four separate Ketryx projects, each on its own
subsystem folder (see glob patterns below). This note explains a few things
that are easy to get wrong when wiring the Ketryx side up.

## Design docs are git-based Ketryx spec items

Every file under `*/design/*.md` is a git-based Software Item Spec (unit
design doc) in Ketryx. Ketryx reads these directly out of git rather than
through the UI item editor - that's the point of git-based items (design docs
live where engineers already work, version with the code, and get reviewed in
the normal PR flow).

The practical implication: **git-based items reject relation edits made in the
Ketryx UI.** You cannot open one of these docs in the Ketryx UI and add a
`fulfilledRequirements` relation the way you would on a UI-authored item.
Relations for these items MUST live in the YAML frontmatter of the markdown
file itself, using the item's Ketryx item id (`KXITM...`).

## Frontmatter relations are placeholders until build phase P3

Right now every design doc's frontmatter has a commented-out `relations:`
block with `KXITM_TBD_<requirement-name-slug>` placeholder ids, e.g.:

```yaml
# relations:
#   fulfills:
#     - KXITM_TBD_low-flow-alarm-threshold-and-debounce
```

This is deliberate. The corresponding requirement items (SWR-PCF-3, SWR-CP-1,
etc.) do not exist as real KXITM ids yet at this point in the build - they get
created directly in Ketryx in an earlier phase, and only once we have their
real ids can we come back and fill in these frontmatter blocks correctly.

**Build phase P3** is when someone goes through every design doc in this repo,
looks up the real KXITM id for each referenced requirement, uncomments the
`relations:` block, and replaces the `KXITM_TBD_*` placeholder with the real
id. Until P3 runs, treat every design doc as an orphaned item in the
traceability matrix by design - that's expected, not a bug.

## Glob patterns / project-to-folder mapping

| Ketryx project | Folder watched | Glob |
|---|---|---|
| Pump Controller Firmware (PCF) | `pump-controller/` | `pump-controller/design/*.md` (specs), `pump-controller/**/*.c`, `pump-controller/**/*.h` (source, informational only) |
| Clinician Portal (CP) | `clinician-portal/` | `clinician-portal/design/*.md` (specs), `clinician-portal/**/*.ts`, `clinician-portal/**/*.tsx` (source, informational only) |
| Patient Companion App (PCA) | `companion-app/` | `companion-app/design/*.md` (specs), `companion-app/**/*.ts`, `companion-app/**/*.tsx` (source, informational only) |
| Heart Pump Digital Platform (HPDP, product project) | `telemetry-gateway/` | `telemetry-gateway/design/*.md` (interface spec), `telemetry-gateway/api-spec.yaml` (informational only) |

Each subsystem project only watches its own folder - there is no cross-folder
glob. The shared Device Telemetry Gateway lives in the product project (HPDP)
because it is the crossing point between subsystems, not owned by any one of
them; PCF publishes to it, CP and PCA each consume a different channel from
it.

## The demo seam

`pump-controller/src/alarm_manager.c` defines `LOW_FLOW_ALARM_THRESHOLD` with
a comment pointing at SWR-PCF-3 (Low-Flow Alarm Threshold and Debounce). This
is the constant the mid-train requirement-change demo edits (2.5 L/min ->
2.8 L/min) to walk the change-impact chain described in the build sheet
(FMEA-PCF-2 -> TC-PCF-3 / TC-SYS-2 -> SWR-CP-2 ripple candidate -> classification
boundary holding for the Patient Companion App).
