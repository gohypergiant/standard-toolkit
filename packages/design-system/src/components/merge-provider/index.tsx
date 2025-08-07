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

import { mergeProps } from '../../utils/props';
import type { Context, ReactNode } from 'react';
import type { MergeProviderProps } from './types';

function merge<T>(context: Context<T>, next: T, children: ReactNode) {
  return function Consumer(prev: T) {
    let merged = next;

    if (
      prev != null &&
      next != null &&
      typeof prev === 'object' &&
      typeof next === 'object'
    ) {
      const prevSlots =
        'slots' in prev && (prev.slots as Record<string | symbol, object>);

      const nextSlots =
        'slots' in next && (next.slots as Record<string | symbol, object>);

      if (prevSlots && nextSlots) {
        merged = {
          ...prev,
          ...next,
          slots: {
            ...prevSlots,
            ...nextSlots,
            ...Reflect.ownKeys(nextSlots).reduce<
              Record<string | symbol, object>
            >((acc, key) => {
              const value = nextSlots[key];

              if (Object.hasOwn(prevSlots, key)) {
                acc[key] = mergeProps(prevSlots[key], value);
              }

              return acc;
            }, {}),
          },
        } as T;
      } else if (!(prevSlots || nextSlots)) {
        merged = mergeProps(prev as object, next as object) as T;
      }
    }

    return <context.Provider value={merged}>{children}</context.Provider>;
  };
}

/**
 * Merges provided contexts with parent contexts, if available and of the same structure
 * If parent context doesn't exist or differs in structure (slotted vs non-slotted) from
 * the context being provided, the provided context will override the parent context
 *
 * This is typically used in conjunction with React Aria Component's contexts, where a
 * RAC may provide a slotted context (ex: ButtonContext, with a slot of "remove") where
 * that slot has a number of attributes and event listeners, but we want to merge in our
 * own to supplement things for stylistic or additional functionality purposes
 *
 * See tests for examples
 */
export function MergeProvider<A, B, C, D, E, F, G, H, I, J, K>({
  values,
  children,
}: MergeProviderProps<A, B, C, D, E, F, G, H, I, J, K>) {
  for (const [context, next] of values) {
    children = (
      <context.Consumer>
        {merge(context as Context<typeof next>, next, children)}
      </context.Consumer>
    );
  }

  return <>{children}</>;
}
