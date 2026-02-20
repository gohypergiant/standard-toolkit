import type { ClassificationBadgeProps } from '@accelint/design-toolkit';

export type ClassificationBadgeVariant = Pick<
  ClassificationBadgeProps,
  'variant' | 'size'
>;

export const PROP_COMBOS: ClassificationBadgeVariant[] = [
  { variant: 'missing', size: 'medium' },
  { variant: 'missing', size: 'small' },
  { variant: 'unclassified', size: 'medium' },
  { variant: 'unclassified', size: 'small' },
  { variant: 'cui', size: 'medium' },
  { variant: 'cui', size: 'small' },
  { variant: 'confidential', size: 'medium' },
  { variant: 'confidential', size: 'small' },
  { variant: 'secret', size: 'medium' },
  { variant: 'secret', size: 'small' },
  { variant: 'top-secret', size: 'medium' },
  { variant: 'top-secret', size: 'small' },
  { variant: 'ts-sci', size: 'medium' },
  { variant: 'ts-sci', size: 'small' },
];
