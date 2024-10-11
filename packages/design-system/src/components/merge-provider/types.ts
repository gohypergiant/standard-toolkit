/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PropsWithChildren } from 'react';
import type { ProviderValues } from '../../types';

export type MergeProviderProps<
  A = any,
  B = any,
  C = any,
  D = any,
  E = any,
  F = any,
  G = any,
  H = any,
  I = any,
  J = any,
  K = any,
> = PropsWithChildren<{
  values: ProviderValues<A, B, C, D, E, F, G, H, I, J, K>;
}>;
