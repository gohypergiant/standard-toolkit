import type { LabelProps } from '@accelint/design-toolkit';

export type LabelVariant = Pick<LabelProps, 'isRequired' | 'isDisabled'>;

export const PROP_COMBOS: LabelVariant[] = [
  { isRequired: true, isDisabled: true },
  { isRequired: true, isDisabled: false },
  { isRequired: false, isDisabled: true },
  { isRequired: false, isDisabled: false },
];
