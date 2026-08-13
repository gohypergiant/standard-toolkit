## ADDED Requirements

### Requirement: Sidebar SHALL display collapsible sections

The sidebar navigation MUST organize packages into three collapsible sections: Toolkits, Packages, and Tooling.

#### Scenario: Three main sections are collapsible
- **WHEN** viewing the sidebar
- **THEN** Toolkits, Packages, and Tooling MUST each be collapsible folder sections

#### Scenario: Getting Started appears before sections
- **WHEN** rendering the sidebar
- **THEN** Getting Started pages MUST appear at the top before the three collapsible sections

#### Scenario: Sections expand to show packages
- **WHEN** a user clicks on a section folder
- **THEN** the section MUST expand to reveal the packages within it

### Requirement: Navigation SHALL be responsive

The sidebar navigation MUST adapt to different screen sizes.

#### Scenario: Desktop displays persistent sidebar
- **WHEN** viewing on desktop (≥1024px width)
- **THEN** the sidebar MUST be visible by default alongside content

#### Scenario: Mobile uses collapsible menu
- **WHEN** viewing on mobile (<1024px width)
- **THEN** the sidebar MUST be hidden by default with a hamburger menu toggle

#### Scenario: Sidebar closes on mobile after navigation
- **WHEN** a user selects a page on mobile
- **THEN** the sidebar MUST automatically close to show content

### Requirement: Search SHALL be accessible from navigation

The navigation area MUST provide search functionality.

#### Scenario: Search input is visible in top bar
- **WHEN** viewing the documentation site
- **THEN** a search input or button MUST be visible in the navigation bar

#### Scenario: Search indexes all documentation
- **WHEN** a user searches for content
- **THEN** results MUST include pages from all sections (Getting Started, Toolkits, Packages, Tooling)

#### Scenario: Search results are navigable
- **WHEN** search results are displayed
- **THEN** clicking a result MUST navigate to the corresponding page

### Requirement: Theme toggle SHALL be available

Users MUST be able to toggle between light and dark themes.

#### Scenario: Theme toggle is in navigation bar
- **WHEN** viewing the documentation site
- **THEN** a theme toggle button MUST be visible in the navigation area

#### Scenario: Theme persists across navigation
- **WHEN** a user changes the theme and navigates to another page
- **THEN** the selected theme MUST persist

#### Scenario: Theme follows system preference by default
- **WHEN** a user visits the site for the first time
- **THEN** the theme MUST default to the user's system preference (light or dark)

### Requirement: Active page SHALL be highlighted

The sidebar MUST indicate which page is currently active.

#### Scenario: Current page is visually distinct
- **WHEN** viewing any documentation page
- **THEN** the corresponding sidebar item MUST be highlighted with a distinct visual style

#### Scenario: Parent section auto-expands for active page
- **WHEN** navigating to a page within a collapsed section
- **THEN** the section MUST automatically expand to reveal the active page

### Requirement: GitHub link SHALL be in navigation

The navigation area MUST provide a link to the GitHub repository.

#### Scenario: GitHub icon links to repository
- **WHEN** viewing the navigation bar
- **THEN** a GitHub icon/link MUST be present that navigates to "https://github.com/gohypergiant/standard-toolkit"

### Requirement: Page tree SHALL follow meta.json order

The sidebar navigation order MUST respect the ordering defined in meta.json files.

#### Scenario: Sections appear in meta.json order
- **WHEN** rendering the sidebar
- **THEN** sections MUST appear in the order specified in `content/meta.json`: getting-started, toolkits, packages, tooling

#### Scenario: Packages within section follow section meta.json
- **WHEN** rendering packages within a section
- **THEN** they MUST appear in the order specified in `content/{section}/meta.json` pages array

#### Scenario: Package pages follow package meta.json
- **WHEN** rendering a package's sub-navigation
- **THEN** pages MUST appear in the order specified in `content/{section}/{package}/meta.json` pages array
