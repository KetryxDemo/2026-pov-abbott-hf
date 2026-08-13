---
itemId: gui-cp-1
itemType: Software Item Spec
itemTitle: Patient Trend Dashboard GUI Spec
Software item type: Interface
itemFulfills: KXITM4BDXAA3SJZ8C0A1SDZA0R8FNN0, KXITM3JE6QCPV6X82GA0XJRPR9BMAYT, KXITM6QYCMB27XW937A352M5E2CN4M0
---

# Patient Trend Dashboard GUI Spec

## Component

Patient Trend Dashboard (IFACE-CP-1). The clinician-facing screen that
presents 90 days of pump telemetry for a single patient. This spec
defines what the screen must show and how each element behaves. It does
not define pixel geometry, typography, or color - those live in the
design system and are deliberately out of scope here.

## Layout

```mermaid
flowchart TB
    subgraph HEADER[Header bar]
        PT[Patient name and MRN]
        AGE[Data-age badge]
        ACT[Export and Annotate actions]
    end
    subgraph CHART[Primary trend region]
        SF[Speed and flow series, 90 days]
        SHADE[Shaded bands marking sustained low flow]
    end
    subgraph PROXY[Secondary trend region]
        FP[Filling-pressure-trend proxy series]
        UNIT[Unit suffix rendered on every value]
    end
    HEADER --> CHART --> PROXY
```

## Reference

![Patient Trend Dashboard wireframe](patient-trend-dashboard-wireframe.png)

The wireframe defines what the screen must show and how elements relate.
It is not a pixel-accurate mock; layout, typography and color live in the
design system.

## Behavior

| Element | Required behavior | Satisfies |
| --- | --- | --- |
| Trend region | Displays the most recent 90 days of speed and flow retrieved from the telemetry gateway. Ranges with no data render as gaps, never as interpolated lines. | Display 90-day trend |
| Low-flow shading | Any period where estimated flow trends below the sustained low-flow threshold is shaded and labeled. Shading is a visual flag for review, not an alarm. | Flag sustained low-flow trend |
| Pressure-trend proxy | Every displayed value carries its unit suffix. A value may never render bare, including in tooltips, exports, and the annotation panel. | Display filling-pressure-trend proxy with correct units |
| Data-age badge | Shows the age of the newest sample. Switches to a stale treatment once data exceeds the freshness window. | Display 90-day trend |

## Notes

The unit-suffix rule is the surface where FMEA-CP-1 materializes. An
unlabeled proxy value can be misread as a different scale entirely, so
the requirement is stated here as an absolute rather than a default.

Rendering logic for this screen lives in the Trend Chart Rendering Unit
(unit-cp-2). This spec governs what a clinician sees; that unit governs
how it is drawn.
