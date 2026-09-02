# Archived Changes

| Change | Date | Decision | Specs touched | Status |
| --- | --- | --- | --- | --- |
| add-stepper-component | 2026-08-26 | Custom useStepperState hook; Key type with stepper-specific naming; Separate Back/Next components; Bidirectional completion tracking; Disabled steps block navigation; ARIA wizard pattern; Conditional panel rendering | stepper-state-management, stepper-navigation, stepper-accessibility, stepper-styling, stepper-composition | current |
| add-table-controlled-state | 2026-09-01 | Per-slice x/defaultX/onXChange triple via useControlledState; private useTableControlledState adapter; rowSelection becomes controlled triple (breaking); rowPinning exposed as controlled triple; sort triple feeds state.sorting in both modes; onSortChange payload becomes plain SortingState (breaking); columnSelection stays internal and page unchanged; TanStack state types not re-exported | table-state-management, table-sorting | current |
