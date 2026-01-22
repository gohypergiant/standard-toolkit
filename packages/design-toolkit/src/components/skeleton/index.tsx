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

import { clsx } from '@accelint/design-foundation/lib/utils';
import styles from './styles.module.css';
import type { SkeletonProps } from './types';

/**
 * Skeleton - Placeholder content for loading states
 *
 * Displays a pulsing placeholder while content is being fetched.
 *
 * @example
 * ```tsx
 * <Skeleton variant="rectangle" style={{ width: 200, height: 20 }} />
 * <Skeleton variant="circle" style={{ width: 40, height: 40 }} />
 * ```
 */
export function Skeleton({
  className,
  variant = 'rectangle',
  ...rest
}: SkeletonProps) {
  return (
    <div
      {...rest}
      className={clsx(styles.skeleton, styles[variant], className)}
    />
  );
}
