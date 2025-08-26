# @accelint/ntds

An NTDS-compliant offering of a set of SVG Icon Components with fill color inputs for general usage, and a spritesheet for icons to be used in the COP.

## Installation

```shell
npm install @accelint/ntds
```

## Background

This package contains two sets of output: a spritesheet for icons for the CBC2 COP, and a core set of colorable React SVG Components.

### Spritesheet

The first group is the set of masked icons that are used solely in the COP. These reside in [./icons/masked](./icons/masked). Since they will only be used as part of the deckGL rendering, these are combined into a spritesheet under [./dist/masked](./dist/masked/).

![Masked](./src/spritesheets/masked.png)

### React SVG Core Components

The second group is a set of icons to be used anywhere needed in a React app as an SVG component, colored as needed. The source icons come from [./icons/core](./icons/core/). The first section of this set adhere to a minimal set of icons for `Hostile`, `Friendly` and `Unknown`.

| Category          |                             Hostile                              |                            Friendly                            |                             Unknown                              |
| ----------------- | :--------------------------------------------------------------: | :------------------------------------------------------------: | :--------------------------------------------------------------: |
| Air               |           ![Air hostile](./icons/core/air/hostile.svg)           |           ![Air friend](./icons/core/air/friend.svg)           |           ![Air unknown](./icons/core/air/unknown.svg)           |
| Air Base          |      ![Air Base hostile](./icons/core/air-base/hostile.svg)      |      ![Air Base friend](./icons/core/air-base/friend.svg)      |      ![Air Base unknown](./icons/core/air-base/unknown.svg)      |
| Air Group         |     ![Air Group hostile](./icons/core/air-group/hostile.svg)     |     ![Air Group friend](./icons/core/air-group/friend.svg)     |     ![Air Group unknown](./icons/core/air-group/unknown.svg)     |
| Helicopter        |    ![Helicopter hostile](./icons/core/helicopter/hostile.svg)    |    ![Helicopter friend](./icons/core/helicopter/friend.svg)    |    ![Helicopter unknown](./icons/core/helicopter/unknown.svg)    |
| Missile           |       ![Missile hostile](./icons/core/missile/hostile.svg)       |       ![Missile friend](./icons/core/missile/friend.svg)       |       ![Missile unknown](./icons/core/missile/unknown.svg)       |
| Base              |          ![Base hostile](./icons/core/base/hostile.svg)          |          ![Base friend](./icons/core/base/friend.svg)          |          ![Base unknown](./icons/core/base/unknown.svg)          |
| Carrier           |       ![Carrier hostile](./icons/core/carrier/hostile.svg)       |       ![Carrier friend](./icons/core/carrier/friend.svg)       |       ![Carrier unknown](./icons/core/carrier/unknown.svg)       |
| Land              |          ![Land hostile](./icons/core/land/hostile.svg)          |          ![Land friend](./icons/core/land/friend.svg)          |          ![Land unknown](./icons/core/land/unknown.svg)          |
| Surface           |       ![Surface hostile](./icons/core/surface/hostile.svg)       |       ![Surface friend](./icons/core/surface/friend.svg)       |       ![Surface unknown](./icons/core/surface/unknown.svg)       |
| Surface Group     | ![Surface Group hostile](./icons/core/surface-group/hostile.svg) | ![Surface Group friend](./icons/core/surface-group/friend.svg) | ![Surface Group unknown](./icons/core/surface-group/unknown.svg) |
| Sub-Surface       |   ![Sub-Surface hostile](./icons/core/sub-surface/hostile.svg)   |   ![Sub-Surface friend](./icons/core/sub-surface/friend.svg)   |   ![Sub-Surface unknown](./icons/core/sub-surface/unknown.svg)   |
| Sub-Surface Group | ![Sub-Surface Group hostile](./icons/core/sub-group/hostile.svg) | ![Sub-Surface Group friend](./icons/core/sub-group/friend.svg) | ![Sub-Surface Group unknown](./icons/core/sub-group/unknown.svg) |
| Torpedo           |       ![Torpedo hostile](./icons/core/torpedo/hostile.svg)       |       ![Torpedo friend](./icons/core/torpedo/friend.svg)       |       ![Torpedo unknown](./icons/core/torpedo/unknown.svg)       |

The next section is a simple generic icon for any color variety.

| Category                            |                      Generic                       |
| ----------------------------------- | :------------------------------------------------: |
| Communications                      | ![Communications](./icons/core/communications.svg) |
| Mine Field                          |     ![Mine Field](./icons/core/mine-field.svg)     |
| Petroleum, Oil and Lubricants (POL) |            ![POL](./icons/core/pol.svg)            |
| Port                                |           ![Port](./icons/core/port.svg)           |
| Runway                              |         ![Runway](./icons/core/runway.svg)         |
| Surface to Air Missile (SAM)        |            ![SAM](./icons/core/sam.svg)            |
| Structure                           |      ![Structure](./icons/core/structure.svg)      |
| Target                              |         ![Target](./icons/core/target.svg)         |

The color variants are defined in [./src/constants.ts](./src/constants.ts).

![Color variants](./assets/color_definitions.png)

<!-- 

|                           Color Name                           |  Color  |
| :------------------------------------------------------------: | :-----: |
| <span style='color:#0E8F37'> NTDS_COLOR_ASSUMED_FRIEND </span> | #0E8F37 |
|     <span style='color:#1484F4'> NTDS_COLOR_FRIEND </span>     | #1484F4 |
|    <span style='color:#FF0033'> NTDS_COLOR_HOSTILE </span>     | #FF0033 |
|    <span style='color:#5B137A'> NTDS_COLOR_NEUTRAL </span>     | #5B137A |
|    <span style='color:#404040'> NTDS_COLOR_PENDING </span>     | #404040 |
|    <span style='color:#FFAD38'> NTDS_COLOR_SUSPECT </span>     | #FFAD38 |
|    <span style='color:#EDDA0A'> NTDS_COLOR_UNKNOWN </span>     | #EDDA0A |

-->
