# Spec: Experimental Age Tracking

## ADDED Requirements

### Requirement: Daily age tracking execution
The system SHALL run age tracking workflow daily at 9 AM UTC via cron schedule.

#### Scenario: Daily cron trigger
- **WHEN** clock reaches 9:00 AM UTC
- **THEN** age tracker workflow executes automatically

#### Scenario: Manual trigger support
- **WHEN** user manually triggers age tracker workflow
- **THEN** workflow runs immediately regardless of schedule

### Requirement: Experimental PR discovery
The age tracker SHALL find all open pull requests from `experimental/*` branches.

#### Scenario: Multiple experimental PRs
- **WHEN** age tracker runs with 3 open experimental PRs
- **THEN** tracker processes all 3 PRs

#### Scenario: No experimental PRs
- **WHEN** age tracker runs with no open experimental PRs
- **THEN** tracker completes successfully without errors

### Requirement: Publish date extraction
The age tracker SHALL extract publish date from bot comment on PR.

#### Scenario: Parse publish date
- **WHEN** PR has bot comment with "**Published:** 2026-05-07"
- **THEN** tracker extracts date as 2026-05-07

#### Scenario: Missing publish comment
- **WHEN** PR has no bot comment with publish date
- **THEN** tracker skips that PR (no age calculation)

#### Scenario: Unparseable date format
- **WHEN** bot comment has invalid date format
- **THEN** tracker skips that PR gracefully without crashing

### Requirement: Age calculation
The age tracker SHALL calculate experiment age in days from publish date.

#### Scenario: Recent experiment
- **WHEN** experimental branch published 5 days ago
- **THEN** tracker calculates age as 5 days

#### Scenario: Old experiment
- **WHEN** experimental branch published 30 days ago
- **THEN** tracker calculates age as 30 days

### Requirement: Warning level determination
The age tracker SHALL assign warning levels based on experiment age.

#### Scenario: Active phase (0-13 days)
- **WHEN** experiment age is 10 days
- **THEN** tracker assigns status "ℹ️ Active" with info emoji

#### Scenario: Approaching deadline (14-20 days)
- **WHEN** experiment age is 17 days
- **THEN** tracker assigns status "⏰ Approaching deadline" with clock emoji

#### Scenario: Urgent phase (21-27 days)
- **WHEN** experiment age is 24 days
- **THEN** tracker assigns status "⚠️ Urgent" with warning emoji

#### Scenario: Overdue (28+ days)
- **WHEN** experiment age is 30 days
- **THEN** tracker assigns status "🚨 Overdue - decide now" with alert emoji

### Requirement: Status comment creation
The age tracker SHALL create status comment on PR if none exists.

#### Scenario: First status comment
- **WHEN** PR has no existing status comment from bot
- **THEN** tracker creates new comment with "## 📊 Experiment Status" header

### Requirement: Status comment updates
The age tracker SHALL update existing status comment with current age and warning level.

#### Scenario: Update existing comment
- **WHEN** PR has existing "📊 Experiment Status" comment
- **THEN** tracker updates that comment with new age and warning level

#### Scenario: Comment content structure
- **WHEN** tracker updates status comment
- **THEN** comment includes: status emoji, started date, age in days, deadline date, next steps guidance

### Requirement: Next steps guidance
The status comment SHALL provide actionable next steps based on warning level.

#### Scenario: Active phase guidance
- **WHEN** experiment is in active phase (0-13 days)
- **THEN** comment shows days remaining and encourages testing/feedback

#### Scenario: Overdue guidance
- **WHEN** experiment is overdue (28+ days)
- **THEN** comment instructs to either open fresh PR to main or close experimental PR

### Requirement: Deadline calculation
The age tracker SHALL calculate deadline as publish date + 28 days (1 month).

#### Scenario: Deadline display
- **WHEN** experiment published on 2026-05-07
- **THEN** status comment shows deadline as 2026-06-04

### Requirement: Graceful error handling
The age tracker SHALL continue processing remaining PRs if one PR fails.

#### Scenario: Error on single PR
- **WHEN** tracker encounters error parsing one PR
- **THEN** tracker logs error and continues to next PR without crashing

### Requirement: Update timestamp
The status comment SHALL include "Last updated" timestamp.

#### Scenario: Update timestamp display
- **WHEN** tracker updates status comment
- **THEN** comment footer shows "Last updated: <ISO timestamp>"
