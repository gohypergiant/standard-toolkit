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
import type { ComponentPropsWithRef } from 'react';

/**
 * DrawerLayoutMain - Main content area within DrawerLayout.
 *
 * Responds to panel open/close states, adjusting layout based on
 * the parent DrawerLayout's `push` configuration.
 *
 * @param props - ComponentPropsWithRef<'main'>
 * @param props.className - Optional CSS class name.
 * @returns The rendered DrawerLayoutMain component.
 *
 * @example
 * ```tsx
 * <DrawerLayout push="left">
 *   <DrawerLayoutMain>
 *     Main content here
 *   </DrawerLayoutMain>
 *   <Drawer placement="left">...</Drawer>
 * </DrawerLayout>
 * ```
 */
export function DrawerLayoutMain({
  className,
  ...rest
}: ComponentPropsWithRef<'main'>) {
  return <main {...rest} className={clsx(styles.main, className)} />;
}
