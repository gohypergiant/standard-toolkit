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

/**
 * StatusIndicator - A component for displaying connection/service status informatio
 *
 * Provides a purely presentational component to allow users to display the status of something.
 * Only 'good,' 'degraded,', and 'poor' statuses are being supported.
 *
 * @example
 * ```tsx
 * // Basic status indicator
 * <StatusIndicator status="good" />
 * ```
 * @param props - {@link StatusIndicatorProps}
 * @param props.status - The status to display (good, degraded, or poor)
 * @returns The rendered StatusIndicator component.
 */

export function StatusIndicator({
  className,
  status = 'good',
  ...rest
}: StatusIndicatorProps) {
  return (
    <span
      {...rest}
      className={clsx(styles.icon, className)}
      data-status={status}
      data-testid={`status-${status}-icon`}
    />
  );
}
