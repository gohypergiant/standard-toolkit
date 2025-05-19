/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ForwardedRef, createContext, forwardRef } from 'react';
import { type ContextValue, Provider } from 'react-aria-components';
import { useContextProps } from '../../hooks/use-context-props';
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
