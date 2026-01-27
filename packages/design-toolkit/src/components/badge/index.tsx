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
import { useContextProps } from 'react-aria-components';
import { BadgeContext } from './context';
import styles from './styles.module.css';
import type { BadgeProps } from './types';

/**
 * Small status indicator for labels, counts, and notifications.
 * Empty badges render as dot indicators.
 *
 * @param props - The badge props.
 * @param props.ref - Reference to the span element.
 * @param props.className - Additional CSS class names for styling.
 * @param props.color - Semantic color variant.
 * @param props.offset - Offset from positioned edge in pixels.
 * @param props.placement - Position relative to container.
 * @param props.children - Badge content (text, number, or empty for dot).
 * @returns The badge span element.
 *
 * @example
 * ```tsx
 * <Badge>New</Badge>
 * ```
 *
 * @example
 * ```tsx
 * // Color variants
 * <Badge color="normal">Active</Badge>
 * <Badge color="advisory">Pending</Badge>
 * <Badge color="critical">Error</Badge>
 * ```
 *
 * @example
 * ```tsx
 * // Dot indicator (no children)
 * <Badge color="normal" />
 * ```
 *
 * @example
 * ```tsx
 * // Positioned badge
 * <Badge placement="top right" offset={designTokens.spacing.xs}>3</Badge>
 * ```
 */
export function Badge({ ref, ...props }: BadgeProps) {
  [props, ref] = useContextProps(props, ref ?? null, BadgeContext);

  const { className, color = 'info', offset, placement, ...rest } = props;

  return (
    <span
      {...rest}
      ref={ref}
      className={clsx('group/badge', styles.badge, className)}
      data-color={color}
      data-offset-x={typeof offset === 'number' ? offset : offset?.x}
      data-offset-y={typeof offset === 'number' ? offset : offset?.y}
      data-placement={placement || null}
    />
  );
}
