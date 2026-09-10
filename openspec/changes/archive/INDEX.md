# Archived Changes

| Change | Date | Decision | Specs touched | Status |
| --- | --- | --- | --- | --- |
| add-stepper-component | 2026-08-26 | Custom useStepperState hook; Key type with stepper-specific naming; Separate Back/Next components; Bidirectional completion tracking; Disabled steps block navigation; ARIA wizard pattern; Conditional panel rendering | stepper-state-management, stepper-navigation, stepper-accessibility, stepper-styling, stepper-composition | current |
| consolidate-coordinate-formatting-into-geo | 2026-09-10 | Free parts-returning functions (to*Parts), not Coordinate methods; String formatters compose over the parts layer (carry math lives once); Numeric parts + hemisphere letter; precision owned by the renderer; carry at part level; Discriminated {ok:true,value}|{ok:false,reason} result for MGRS/UTM out-of-range; 80°S–84°N inclusive boundary checked once in geo; map-toolkit drops its stricter guard; Signed [lat,lon] input contract; longitude normalization deferred to @accelint/math wrap | coordinate-formatting | current |
