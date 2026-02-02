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
import { clsx } from '@accelint/design-foundation/lib/utils';
import { useIsSSR } from '@react-aria/ssr';
import { motion } from 'motion/react';
import { useMemo } from 'react';
import { Tooltip as AriaTooltip } from 'react-aria-components';
import { ANIMATION_DURATION_FAST } from '@/lib/animation';
import { PortalProvider } from '@/providers/portal';
import styles from './styles.module.css';
import type { TooltipProps } from './types';

/**
 * Tooltip - Contextual popup for additional information
 *
 * Displays on hover or focus with automatic positioning and accessibility support.
 *
 * @param props - {@link TooltipProps}
 * @param props.children - Tooltip content.
 * @param props.parentRef - Ref to the parent element for portal positioning.
 * @param props.className - CSS class for the tooltip.
 * @param props.offset - Distance from the trigger element.
 * @param props.placement - Position relative to the trigger.
 * @returns The rendered Tooltip component.
 *
 * @example
 * ```tsx
 * <TooltipTrigger>
 *   <Button>Hover me</Button>
 *   <Tooltip>Additional information</Tooltip>
 * </TooltipTrigger>
 * ```
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

  const getInitialPosition = () => {
    switch (placement) {
      case 'top':
        return { y: 8, opacity: 0 };
      case 'bottom':
        return { y: -8, opacity: 0 };
      case 'left':
        return { x: 8, opacity: 0 };
      case 'right':
        return { x: -8, opacity: 0 };
      default:
        return { y: -8, opacity: 0 };
    }
  };

  return (
    <PortalProvider parentRef={parentRef} inject={overlayContainer}>
      <AriaTooltip {...props} offset={offset} placement={placement}>
        {(renderProps) => (
          <motion.div
            initial={getInitialPosition()}
            animate={{ x: 0, y: 0, opacity: 1 }}
            exit={getInitialPosition()}
            transition={{ duration: ANIMATION_DURATION_FAST }}
            className={clsx(styles.tooltip, className)}
          >
            {typeof children === 'function' ? children(renderProps) : children}
          </motion.div>
        )}
      </AriaTooltip>
    </PortalProvider>
  );
}
