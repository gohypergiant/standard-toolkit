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

import { mergeRefs, useObjectRef } from '@react-aria/utils';
import {
  type Context,
  type ForwardedRef,
  type RefObject,
  useMemo,
} from 'react';
import {
  type ContextValue,
  type SlotProps,
  useSlottedContext,
} from 'react-aria-components';
import { mergeProps } from '../../utils/props';

/**
 * Reimplementation of React Aria's useContextProps, to utilize our own
 * mergeProps which handles renderProps and classNames
 */
export function useContextProps<T, U extends SlotProps, E extends Element>(
  props: T & SlotProps,
  ref: ForwardedRef<E>,
  context: Context<ContextValue<U, E>>,
): [T, RefObject<E | null>] {
  const value = (useSlottedContext(context, props.slot) ?? {}) as Partial<T> & {
    ref?: ForwardedRef<E>;
  };

  const { ref: contextRef, ...contextProps } = value;

  return [
    mergeProps(contextProps as Partial<T>, props) as T,
    useObjectRef(useMemo(() => mergeRefs(ref, contextRef), [ref, contextRef])),
  ];
}
