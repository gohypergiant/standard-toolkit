import type { ClassificationBannerProps } from '@accelint/design-toolkit';

export type ClassificationBannerVariant = Pick<
  ClassificationBannerProps,
  'variant'
>;

export const PROP_COMBOS: ClassificationBannerVariant[] = [
  { variant: 'missing' },
  { variant: 'unclassified' },
  { variant: 'cui' },
  { variant: 'confidential' },
  { variant: 'secret' },
  { variant: 'top-secret' },
  { variant: 'ts-sci' },
];
