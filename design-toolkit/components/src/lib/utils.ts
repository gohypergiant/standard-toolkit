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

import { type ClassValue, clsx } from 'clsx';
import type { ForwardedRef } from 'react';
import type { ContextValue } from 'react-aria-components';
import {
  type ClassNameValue,
  extendTailwindMerge,
  validators,
} from 'tailwind-merge';
import {
  type TVCompoundSlots,
  type TVCompoundVariants,
  type TVDefaultVariants,
  type TVProps,
  type TVReturnType,
  type TVVariants,
  createTV,
} from 'tailwind-variants';

type AdditionalClassGroupIds = 'icon' | 'icon-size' | 'fg';

const twMergeConfig = {
  classGroups: {
    icon: [{ icon: ['', validators.isAny] }],
    fg: [{ fg: ['', validators.isAny] }],
  },
  conflictingClassGroups: {
    fg: ['icon', 'text-color'],
  },
  theme: {
    color: [
      'current',
      'surface-default',
      'surface-raised',
      'surface-overlay',
      'transparent-dark',
      'transparent-light',
      'interactive-default',
      'interactive-hover-light',
      'interactive-hover-dark',
      'interactive-disabled',
      'static-light',
      'static-dark',
      'interactive',
      'interactive-hover',
      'highlight-bold',
      'highlight-hover',
      'highlight-subtle',
      'info-bold',
      'info-hover',
      'info-subtle',
      'advisory-bold',
      'advisory-hover',
      'advisory-subtle',
      'normal-bold',
      'normal-hover',
      'normal-subtle',
      'serious-bold',
      'serious-hover',
      'serious-subtle',
      'critical-bold',
      'critical-hover',
      'critical-subtle',
      'default-light',
      'default-dark',
      'inverse-dark',
      'inverse-light',
      'disabled',
      'highlight',
      'info',
      'advisory',
      'normal',
      'serious',
      'critical',
      'classification-missing',
      'classification-unclass',
      'classification-cui',
      'classification-confidential',
      'classification-secret',
      'classification-top-secret',
    ],
    font: ['primary', 'display'],
    text: [
      'header-xxl',
      'header-xl',
      'header-l',
      'header-m',
      'header-s',
      'header-xs',
      'body-xl',
      'body-l',
      'body-m',
      'body-s',
      'body-xs',
      'body-xxs',
      'button-xl',
      'button-l',
      'button-m',
      'button-s',
      'button-xs',
    ],
    radius: ['none', 'small', 'medium', 'large', 'round'],
    shadow: ['elevation-default', 'elevation-overlay', 'elevation-raised'],
    spacing: [
      'none',
      '0',
      'xxs',
      'xs',
      's',
      'm',
      'l',
      'xl',
      'xxl',
      'oversized',
    ],
  },
} as const; // TODO: satisfies ?

export const twMerge = extendTailwindMerge<AdditionalClassGroupIds>({
  extend: twMergeConfig,
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PREFIX_REGEX = /((?:[^:]*:)+)([^:]+)/;

export function mergeVariants(className: string) {
  if (!className) {
    return '';
  }

  // First build up a map of all prefixes.
  const prefixMap: Record<string, string[]> = {};

  for (const cls of className.split(' ')) {
    const [, prefix, className] = PREFIX_REGEX.exec(cls) ?? ['', 'BASE', cls];

    prefixMap[prefix] = prefixMap[prefix] ?? [];

    prefixMap[prefix].push(className);
  }

  const finalClassNames = [];

  for (const key of Object.keys(prefixMap)) {
    prefixMap[key] = twMerge(prefixMap[key]).split(' ');
  }

  for (const prefix of Object.keys(prefixMap)) {
    if (prefix === 'BASE') {
      finalClassNames.push(prefixMap[prefix]);
    } else {
      finalClassNames.push(prefixMap[prefix]?.map((s) => `${prefix}${s}`));
    }
  }

  return finalClassNames.flat().join(' ');
}

const _tv = createTV({
  twMergeConfig,
});

// Copied from Tailwind Variants due to not being exported
type TVSlots = Record<string, ClassNameValue> | undefined;

export function tv<
  V extends TVVariants<S, B, EV>,
  // biome-ignore lint/style/useNamingConvention: Keeping consistent with OG implementation within TV
  CV extends TVCompoundVariants<V, S, B, EV, ES>,
  // biome-ignore lint/style/useNamingConvention: Keeping consistent with OG implementation within TV
  DV extends TVDefaultVariants<V, S, EV, ES>,
  B extends ClassNameValue = undefined,
  S extends TVSlots = undefined,
  // @ts-expect-error
  E extends TVReturnType = TVReturnType<
    V,
    S,
    B,
    // @ts-expect-error Keeping consistent with OG implementation within TV
    EV extends undefined ? object : EV,
    // @ts-expect-error Keeping consistent with OG implementation within TV
    ES extends undefined ? object : ES
  >,
  // biome-ignore lint/style/useNamingConvention: Keeping consistent with OG implementation within TV
  EV extends TVVariants<ES, B, E['variants'], ES> = E['variants'],
  // biome-ignore lint/style/useNamingConvention: Keeping consistent with OG implementation within TV
  ES extends TVSlots = E['slots'] extends TVSlots ? E['slots'] : undefined,
>(options: {
  extend?: E;
  base?: B;
  slots?: S;
  variants?: V;
  compoundVariants?: CV;
  compoundSlots?: TVCompoundSlots<V, S, B>;
  defaultVariants?: DV;
}): TVReturnType<V, S, B, EV, ES, E> {
  const configuredStateMachine = _tv<V, CV, DV, B, S, E, EV, ES>(options);
  const wrappedStateMachine = ((props) => {
    const classNamesOrSlots = configuredStateMachine(props);

    return typeof classNamesOrSlots === 'string'
      ? mergeVariants(classNamesOrSlots)
      : Object.entries(
          classNamesOrSlots as Record<
            string,
            (slotProps?: TVProps<V, S, EV, ES>) => string
          >,
        ).reduce(
          (
            acc: Record<string, (slotProps?: TVProps<V, S, EV, ES>) => string>,
            [slot, callback],
          ) => {
            acc[slot] = (slotProps) => mergeVariants(callback(slotProps));

            return acc;
          },
          {},
        );
  }) as TVReturnType<V, S, B, EV, ES, E>;

  return Object.assign(wrappedStateMachine, configuredStateMachine);
}

// Types copied from RAC due to not being exported
type WithRef<T, E> = T & {
  ref?: ForwardedRef<E>;
};

interface SlottedValue<T> {
  slots?: Record<string | symbol, T>;
}

/**
 * A helper to narrow the type of Context Value
 */
export function isSlottedContextValue<T, E>(
  context: ContextValue<T, E>,
): context is SlottedValue<WithRef<T, E>> {
  return !!context && 'slots' in context;
}
