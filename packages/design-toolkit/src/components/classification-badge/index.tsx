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
import { ClassificationBadgeContext } from './context';
import styles from './styles.module.css';
import type { ClassificationBadgeProps } from './types';

const fallbackContent = {
  missing: 'Missing',
  unclassified: 'Unclassified',
  cui: 'CUI',
  confidential: 'Confidential',
  secret: 'Secret',
  'top-secret': 'Top Secret',
  'ts-sci': 'TS/SCI',
} as const;

/**
 * ClassificationBadge - Displays security classification levels for documents and data.
 *
 * Provides standardized visual indicators for classification levels such as
 * unclassified, confidential, secret, and top-secret. Designed for compliance
 * with security standards in government and secure environments.
 *
 * @param props - The classification badge props.
 * @param props.ref - Reference to the badge element.
 * @param props.children - Custom text content (defaults to variant label).
 * @param props.className - Additional CSS class names for styling.
 * @param props.size - Size of the badge.
 * @param props.variant - Classification level variant.
 * @returns The classification badge component.
 *
 * @example
 * <ClassificationBadge variant="secret" />
 *
 * @example
 * // With custom text
 * <ClassificationBadge variant="top-secret">TOP SECRET//NOFORN</ClassificationBadge>
 *
 * @example
 * // Different sizes
 * <ClassificationBadge variant="confidential" size="small" />
 */
export function ClassificationBadge({
  ref,
  ...props
}: ClassificationBadgeProps) {
  [props, ref] = useContextProps(
    props,
    ref ?? null,
    ClassificationBadgeContext,
  );

  const {
    children,
    className,
    size = 'medium',
    variant = 'missing',
    ...rest
  } = props;

  return (
    <span
      {...rest}
      className={clsx(
        'group/classification-badge',
        styles.badge,
        styles[variant],
        className,
      )}
      data-size={size}
    >
      {children || fallbackContent[variant]}
    </span>
  );
}
