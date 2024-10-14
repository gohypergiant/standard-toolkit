/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, forwardRef, type ForwardedRef } from 'react';
import { type ContextValue, Provider } from 'react-aria-components';
import { useContextProps } from '../../hooks';
import { MergeProvider } from '../merge-provider';
import type { ElementProps } from './types';

export const ElementContext =
  createContext<
    ContextValue<
      ElementProps<any, any, any, any, any, any, any, any, any, any, any>,
      HTMLElement
    >
  >(null);

/**
 * This generic component serves as any easy way for more complex components
 * to establish stylable content areas within their layout with optional
 * targetted contexts for any subcomponents
 *
 * See Dialog & Drawer as examples
 */
export const Element = forwardRef(function Element<
  A,
  B,
  C,
  D,
  E,
  F,
  G,
  H,
  I,
  J,
  K,
>(
  props: ElementProps<A, B, C, D, E, F, G, H, I, J, K>,
  ref: ForwardedRef<HTMLElement>,
) {
  [props, ref] = useContextProps(props, ref, ElementContext);

  const { as: El = 'div', values, mergeValues, ...rest } = props;

  // @ts-expect-error Can't narrow props type to match element or ref, making this less dynamic runs into union complexity and performance issues
  let children = <El {...rest} ref={ref} />;

  if (mergeValues) {
    children = <MergeProvider values={mergeValues}>{children}</MergeProvider>;
  }

  if (values) {
    children = <Provider values={values}>{children}</Provider>;
  }

  return children;
});
