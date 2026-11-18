# Spec Delta

## Purpose

Allow consumers to configure an open DrawerLayout placement's grid track while preserving the existing semantic Drawer-size behavior by default.

## ADDED Requirements

### Requirement: Placement-keyed effective track configuration
DrawerLayout SHALL accept an optional partial, placement-keyed configuration whose supported keys are `top`, `right`, `bottom`, and `left`, and whose supplied string value configures that placement's effective grid track only while a Drawer at that placement is open.

#### Scenario: A configured right placement overrides a semantic Drawer size
- **GIVEN** a DrawerLayout configuration supplies `right: "minmax(18rem, 30vw)"`
- **WHEN** a right Drawer with semantic size `small` is open
- **THEN** the right grid track resolves from `minmax(18rem, 30vw)` rather than the `small` semantic preset

#### Scenario: A partial configuration leaves omitted placements unchanged
- **GIVEN** a DrawerLayout configuration supplies only `left: "var(--navigation-width)"`
- **WHEN** a right Drawer with semantic size `large` is open
- **THEN** the right grid track resolves from the existing `large` semantic preset

#### Scenario: Each supported placement can be configured independently
- **GIVEN** a DrawerLayout configuration supplies `top: "72px"`, `right: "22rem"`, `bottom: "minmax(8rem, 25vh)"`, and `left: "calc(12rem + 8px)"`
- **WHEN** one Drawer is open at each configured placement
- **THEN** each grid row or column resolves from its matching placement value

### Requirement: Browser-resolved configured track values
DrawerLayout SHALL pass supplied configuration strings to browser CSS grid-track resolution without JavaScript parsing, normalization, or runtime validation. The public API documentation SHALL identify the accepted values as browser-resolved CSS grid track values and SHALL describe browser handling of unsupported or malformed values.

#### Scenario: A custom-property token is supplied
- **GIVEN** a DrawerLayout configuration supplies `left: "var(--operator-panel-width)"`
- **WHEN** an open left Drawer is rendered in a container defining `--operator-panel-width: 240px`
- **THEN** the browser resolves the left grid track to `240px`

#### Scenario: A malformed value is supplied
- **GIVEN** a DrawerLayout configuration supplies a string that is not valid for the browser's grid-track grammar
- **WHEN** an open Drawer at that placement is rendered
- **THEN** the browser's CSS error-handling behavior determines the resolved declaration without a JavaScript validation error or value normalization

### Requirement: Closed and absent placement tracks
DrawerLayout SHALL resolve every placement track to zero when no Drawer at that placement is open, including when that placement has configured track data. A close transition MAY interpolate a track until it settles, after which the track SHALL resolve to zero.

#### Scenario: A configured open Drawer is closed
- **GIVEN** a DrawerLayout configuration supplies `bottom: "320px"` and a bottom Drawer is open
- **WHEN** the bottom Drawer closes and its transition has settled
- **THEN** the bottom grid track resolves to `0px`

#### Scenario: A configured placement has no mounted Drawer
- **GIVEN** a DrawerLayout configuration supplies `top: "100px"`
- **WHEN** no top Drawer is present or open
- **THEN** the top grid track resolves to `0px`

#### Scenario: A closed Drawer is reopened
- **GIVEN** a DrawerLayout configuration supplies `left: "200px"` and the left Drawer has settled closed
- **WHEN** that Drawer reopens
- **THEN** the left grid track resolves to `200px` while it is open

### Requirement: Push and overlay effective-track compatibility
DrawerLayout SHALL resolve a configured or semantic effective track identically for open push and overlay Drawers. Push behavior SHALL continue to determine only whether the main content occupies the corresponding grid lines.

#### Scenario: A configured pushed Drawer reserves its effective track for main content
- **GIVEN** a DrawerLayout configuration supplies `right: "280px"` and a right Drawer is configured to push
- **WHEN** the right Drawer is open
- **THEN** the right grid track resolves to `280px` and main content is placed outside that track

#### Scenario: A configured overlay Drawer retains overlay main-content placement
- **GIVEN** a DrawerLayout configuration supplies `right: "280px"` and a right Drawer is configured as an overlay
- **WHEN** the right Drawer is open
- **THEN** the right grid track resolves to `280px` and main content retains its overlay placement

### Requirement: Same-placement Drawer bounds
DrawerLayout SHALL not aggregate, sum, maximize, or reject simultaneous Drawers at the same placement. A configured placement value SHALL be the effective track while one or more Drawers at that placement are open; without configuration, existing deterministic semantic fallback behavior SHALL remain.

#### Scenario: Concurrent same-placement Drawers use one configured track
- **GIVEN** a DrawerLayout configuration supplies `left: "256px"` and two left Drawers are open
- **WHEN** their layout is rendered
- **THEN** the left grid track resolves to `256px` and the Drawers share the existing left placement area

#### Scenario: Concurrent same-placement Drawers retain semantic fallback behavior
- **GIVEN** no left track configuration is supplied and open left Drawers use different semantic sizes
- **WHEN** their layout is rendered
- **THEN** the effective left track follows the existing deterministic semantic selector precedence without collision aggregation

### Requirement: Accessibility and existing layout compatibility
Configuring DrawerLayout tracks SHALL not change Drawer keyboard operation, accessible names, focus behavior, screen-reader output, roles, dismissal behavior, or open/closed content-visibility behavior. DrawerLayout configuration SHALL not alter Sidenav's independent reservation behavior.

#### Scenario: Configuring a track preserves an open Drawer's accessible behavior
- **GIVEN** a right Drawer has an accessible name and keyboard interaction already available
- **WHEN** its DrawerLayout configuration supplies `right: "24rem"` and the Drawer opens
- **THEN** the Drawer retains the same accessible name, keyboard operation, focus behavior, roles, and screen-reader output

#### Scenario: Configuring a left Drawer does not redefine Sidenav reservation
- **GIVEN** a layout contains a Sidenav with its existing reserved width and a DrawerLayout configuration supplies `left: "256px"`
- **WHEN** the left Drawer opens
- **THEN** the Sidenav retains its independent reservation behavior
