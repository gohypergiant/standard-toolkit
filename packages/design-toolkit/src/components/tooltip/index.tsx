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
import { useEffect, useMemo, useRef, useState } from 'react';
import { Tooltip as AriaTooltip } from 'react-aria-components';
import { PortalProvider } from '@/providers/portal';
import styles from './styles.module.css';
import type { TooltipProps } from './types';

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
    if (isSSR) return null;
    const div = document.createElement('div');
    div.setAttribute('class', 'absolute');
    return div;
  }, [isSSR]);

  return (
    <PortalProvider parentRef={parentRef} inject={overlayContainer}>
      <AriaTooltip
        {...props}
        offset={offset}
        placement={placement}
        className={clsx(styles.tooltip, className)}
      >
        {children}
      </AriaTooltip>
    </PortalProvider>
  );
}
