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
import { useIsSSR } from '@react-aria/ssr';
import { mergeProps, mergeRefs, useObjectRef } from '@react-aria/utils';
import {
  Children,
  cloneElement,
  createContext,
  type DOMAttributes,
  type ReactElement,
  type ReactNode,
  type RefAttributes,
  useMemo,
  version,
} from 'react';
import {
  Tooltip as AriaTooltip,
  TooltipTrigger as AriaTooltipTrigger,
  type ContextValue,
  composeRenderProps,
  useContextProps,
} from 'react-aria-components';
import { containsExactChildren } from '@/lib/react';
import { PortalProvider } from '@/providers/portal';
import { TooltipStyles } from './styles';
import type { FocusableElement } from '@react-types/shared';
import type { TooltipProps, TooltipTriggerProps } from './types';

export const TooltipContext =
  createContext<ContextValue<TooltipTriggerProps, HTMLDivElement>>(null);

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
/**
 * Tooltip - A contextual popup component for providing additional information
 *
 * Displays helpful information when users hover over or focus on an element.
 * Provides accessible tooltip functionality with proper positioning, keyboard
 * navigation, and screen reader support for enhanced user experience.
 *
 * @example
 * // Basic tooltip
 * <Tooltip.Trigger>
 *   <Button>Hover me</Button>
 *   <Tooltip>
 *     This is helpful information
 *   </Tooltip>
 * </Tooltip.Trigger>
 *
 * @example
 * // Tooltip with custom positioning
 * <Tooltip.Trigger>
 *   <Button>Hover for info</Button>
 *   <Tooltip placement="top" offset={10}>
 *     Positioned above with custom offset
 *   </Tooltip>
 * </Tooltip.Trigger>
 *
 * @example
 * // Icon with tooltip
 * <Tooltip.Trigger>
 *   <Button variant="icon">
 *     <Icon><Info /></Icon>
 *   </Button>
 *   <Tooltip>
 *     Additional context for this action
 *   </Tooltip>
 * </Tooltip.Trigger>
 */
function TooltipTrigger({ ref, ...props }: TooltipTriggerProps) {
  [props, ref] = useContextProps(props, ref ?? null, TooltipContext);

  const { children, delay = 250, ...rest } = props;

  containsExactChildren({
    children,
    componentName: TooltipTrigger.displayName,
    restrictions: [[Tooltip, { min: 1, max: 1 }]],
  });

  return (
    <AriaTooltipTrigger {...rest} delay={delay}>
      <TooltipFocusable ref={ref}>{children}</TooltipFocusable>
    </AriaTooltipTrigger>
  );
}
TooltipTrigger.displayName = 'Tooltip.Trigger';

export function Tooltip({
  children,
  parentRef,
  className,
  offset = 5,
  placement = 'bottom',
  ...props
}: TooltipProps) {
  const isSSR = useIsSSR();
  const overlayContainer = useMemo(() => {
    if (isSSR) {
      return null;
    }
    const div = document.createElement('div');
    div.setAttribute('class', 'absolute');
    return div;
  }, [isSSR]);

  return (
    <PortalProvider parentRef={parentRef} inject={overlayContainer}>
      <AriaTooltip
        {...props}
        className={composeRenderProps(className, (className) =>
          TooltipStyles({ className }),
        )}
        offset={offset}
        placement={placement}
      >
        {children}
      </AriaTooltip>
    </PortalProvider>
  );
}
Tooltip.displayName = 'Tooltip';

Tooltip.Trigger = TooltipTrigger;
