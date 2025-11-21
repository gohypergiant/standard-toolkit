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
import { useListItemVariant } from './context';
import styles from './styles.module.css';
import type { ListItemDescriptionProps } from './types';

/**
 * ListItemDescription - Secondary descriptive text for list items
 *
 * Renders supplementary information below the title with muted styling.
 * Automatically adjusts font size for cozy (body-s) and compact (body-xs) variants.
 *
 * @example
 * <ListItemDescription>Software Engineer</ListItemDescription>
 */
export function ListItemDescription({
  children,
  className,
  ...rest
}: ListItemDescriptionProps) {
  const variant = useListItemVariant();

  return (
    <div
      {...rest}
      className={clsx(styles.description, styles[variant], className)}
    >
      {children}
    </div>
  );
}
