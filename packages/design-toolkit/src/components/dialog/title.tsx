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
import { Heading, type HeadingProps } from 'react-aria-components';
import styles from './styles.module.css';

/**
 * DialogTitle - Semantic heading element for dialog titles.
 *
 * Renders as an `<h2>` element with the `title` slot for accessibility.
 *
 * @param props - The dialog title props.
 * @param props.children - Title text content.
 * @param props.className - Additional CSS class name.
 * @returns The dialog title component.
 *
 * @example
 * ```tsx
 * <Dialog>
 *   <DialogTitle>Confirm Action</DialogTitle>
 *   <DialogContent>...</DialogContent>
 * </Dialog>
 * ```
 */
export function DialogTitle({ children, className }: HeadingProps) {
  return (
    <Heading slot='title' className={clsx(styles.title, className)}>
      {children}
    </Heading>
  );
}
