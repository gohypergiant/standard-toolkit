/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactHTML, JSX } from 'react';
import type { SlotProps } from 'react-aria-components';
import type { ProviderValues } from '../../types';

export type ElementProps<
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
> = /**
 * Initially tried to make these props generic and constrain props to element
 * passed into generic, but ran into major performance issues with enormous
 * type unions of all possible HTML elements props. It breaks all of TS
 */
JSX.IntrinsicElements[keyof ReactHTML] &
  SlotProps & {
    /**
     * The HTML element to be rendered
     */
    as?: keyof ReactHTML;
    /**
     * Values passed to Provider, overrides parent contexts
     */
    values?: ProviderValues<A, B, C, D, E, F, G, H, I, J, K>;
    /**
     * Values passed to MergeProvider, merges with parent contexts
     */
    mergeValues?: ProviderValues<A, B, C, D, E, F, G, H, I, J, K>;
  };
