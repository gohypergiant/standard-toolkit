/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
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
import styles from './styles.module.css';
import type { StatusIndicatorProps } from './types';
import { Label } from 'react-aria-components/Label';

/**
 * StatusIndicator - A component for displaying connection/service status information
 *
 * Provides a purely presentational component to allow users to display the status of something.
 * Supports 'good', 'degraded', 'poor', 'unknown', and 'pending' statuses.
 *
 * @param props - {@link StatusIndicatorProps}
 * @param props.status - The status to display
 * @param props.textValue - Optional label to display next to the status icon
 * @returns The rendered StatusIndicator component.
 *
 * @example
 * ```tsx
 * // Basic status indicator
 * <StatusIndicator status="good" />
 *
 * // With label
 * <StatusIndicator status="degraded" textValue="Connection unstable" />
 * ```
 */
export function StatusIndicator({
  className,
  status = 'good',
  textValue,
  ...rest
}: StatusIndicatorProps) {
  const statusIcon = (
    <span
      {...rest}
      className={clsx(styles.icon, className)}
      data-status={status}
      data-testid={`status-${status}-icon`}
    />
  );

  if (textValue) {
    return (
      <div className='flex items-center gap-s'>
        <div className='flex min-w-m justify-center'>{statusIcon}</div>
        <Label>{textValue}</Label>
      </div>
    );
  }

  return statusIcon;
}
