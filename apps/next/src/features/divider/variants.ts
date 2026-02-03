import type { DividerProps } from '@accelint/design-toolkit';

export type DividerVariant = Pick<DividerProps, 'orientation'>;

export const PROP_COMBOS: DividerVariant[] = [
  { orientation: 'horizontal' },
  { orientation: 'vertical' },
];
