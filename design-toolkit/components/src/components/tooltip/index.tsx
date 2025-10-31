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

import { useIsSSR } from '@react-aria/ssr';
import { PortalProvider } from '@/providers/portal';
import 'client-only';
import { useMemo } from 'react';
import {
  Tooltip as AriaTooltip,
  composeRenderProps,
} from 'react-aria-components';
import { TooltipStyles } from './styles';
import type { TooltipProps } from './types';

/**
 * Tooltip - A contextual popup component for providing additional information
 *
 * Displays helpful information when users hover over or focus on an element.
 * Provides accessible tooltip functionality with proper positioning, keyboard
 * navigation, and screen reader support for enhanced user experience.
 *
 * @example
 * // Basic tooltip
 * <TooltipTrigger>
 *   <Button>Hover me</Button>
 *   <Tooltip>
 *     This is helpful information
 *   </Tooltip>
 * </TooltipTrigger>
 *
 * @example
 * // Tooltip with custom positioning
 * <TooltipTrigger>
 *   <Button>Hover for info</Button>
 *   <Tooltip placement="top" offset={10}>
 *     Positioned above with custom offset
 *   </Tooltip>
 * </TooltipTrigger>
 *
 * @example
 * // Icon with tooltip
 * <TooltipTrigger>
 *   <Button variant="icon">
 *     <Icon><Info /></Icon>
 *   </Button>
 *   <Tooltip>
 *     Additional context for this action
 *   </Tooltip>
 * </TooltipTrigger>
 */
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
