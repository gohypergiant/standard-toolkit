import type { HeroProps } from '@accelint/design-toolkit';

export type HeroVariant = Pick<HeroProps, 'compact'>;

export const PROP_COMBOS: HeroVariant[] = [
  { compact: true },
  { compact: false },
];
