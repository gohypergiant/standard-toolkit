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
'use client';

import 'client-only';
import {
  type FocusableProviderProps,
  useFocusable,
} from '@react-aria/interactions';
import { mergeProps, mergeRefs, useObjectRef } from '@react-aria/utils';
import {
  Children,
  cloneElement,
  type DOMAttributes,
  type ReactElement,
  type ReactNode,
  type RefAttributes,
  version,
} from 'react';
import {
  TooltipTrigger as AriaTooltipTrigger,
  useContextProps,
} from 'react-aria-components';
import { TooltipContext } from './context';
import type { FocusableElement } from '@react-types/shared';
import type { TooltipTriggerProps } from './types';

function TooltipFocusable({
  children,
  ref,
  ...props
}: FocusableProviderProps & RefAttributes<FocusableElement>) {
  ref = useObjectRef(ref);

  const { focusableProps } = useFocusable(props, ref);
  const [trigger, tooltip] = Children.toArray(children) as [
    ReactElement<DOMAttributes<FocusableElement>, string>,
    ReactNode,
  ];

  const childRef =
    //@ts-expect-error
    Number.parseInt(version, 10) < 19 ? trigger.ref : trigger.props.ref;

  return (
    <>
      {cloneElement(trigger, {
        ...mergeProps(focusableProps, trigger.props),
        //@ts-expect-error
        ref: mergeRefs(childRef, ref),
      })}
      {tooltip}
    </>
  );
}

export function TooltipTrigger({ ref, ...props }: TooltipTriggerProps) {
  [props, ref] = useContextProps(props, ref ?? null, TooltipContext);

  const { children, delay = 250, ...rest } = props;

  return (
    <AriaTooltipTrigger {...rest} delay={delay}>
      <TooltipFocusable ref={ref}>{children}</TooltipFocusable>
    </AriaTooltipTrigger>
  );
}
