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
import { useFocusable } from '@react-aria/interactions';
import { UNSAFE_PortalProvider } from '@react-aria/overlays';
import { useIsSSR } from '@react-aria/ssr';
import { mergeProps, mergeRefs, useObjectRef } from '@react-aria/utils';
import {
  Children,
  cloneElement,
  createContext,
  type DOMAttributes,
  type ReactElement,
  type ReactNode,
  useEffect,
  useState,
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
import { TooltipStyles } from './styles';
import type { FocusableElement } from '@react-types/shared';
import type {
  TooltipFocusableProps,
  TooltipProps,
  TooltipTriggerProps,
} from './types';

export const TooltipContext =
  createContext<ContextValue<TooltipTriggerProps, HTMLDivElement>>(null);

function TooltipFocusable({ children, ref, ...props }: TooltipFocusableProps) {
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
  const [portal, setPortal] = useState(isSSR ? null : document.body);

  useEffect(() => {
    const node = parentRef?.current;
    // TODO: Ensure proper ssr hydration
    const port = isSSR ? null : document.createElement('div');
    port?.setAttribute('style', 'position: absolute;');

    if (node && port) {
      node.appendChild(port);

      setPortal(port);
    }

    return () => {
      port?.remove();

      setPortal(isSSR ? null : document.body);
    };
  }, [isSSR, parentRef]);

  return (
    <UNSAFE_PortalProvider getContainer={() => portal}>
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
    </UNSAFE_PortalProvider>
  );
}
Tooltip.displayName = 'Tooltip';

Tooltip.Trigger = TooltipTrigger;
