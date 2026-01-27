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
import styles from './styles.module.css';
import type { ComponentPropsWithRef } from 'react';

/**
 * PopoverFooter - Footer area for actions or additional content
 *
 * @example
 * ```tsx
 * <Popover>
 *   <PopoverContent>Content here</PopoverContent>
 *   <PopoverFooter>
 *     <Button>Cancel</Button>
 *     <Button>Save</Button>
 *   </PopoverFooter>
 * </Popover>
 * ```
 *
 * @param props - ComponentPropsWithRef<'footer'>
 * @param props.children - Footer content to render.
 * @param props.className - Optional CSS class name.
 * @returns The rendered PopoverFooter component.
 */
export function PopoverFooter({
  children,
  className,
}: ComponentPropsWithRef<'footer'>) {
  return <footer className={clsx(styles.footer, className)}>{children}</footer>;
}
