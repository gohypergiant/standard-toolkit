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
import { Heading } from 'react-aria-components';
import styles from './styles.module.css';
import type { DrawerTitleProps } from './types';

/**
 * DrawerHeaderTitle - Semantic heading for drawer headers.
 *
 * The `level` prop controls both visual size and semantic heading level:
 * - Levels 1-3: Large text size (renders as h1-h3)
 * - Levels 4-6: Medium text size (renders as h4-h6)
 *
 * @param props - {@link DrawerTitleProps}
 * @param props.className - Optional CSS class name.
 * @param props.level - Heading level (1-6).
 * @returns The rendered DrawerHeaderTitle component.
 *
 * @default level 2
 *
 * @example
 * ```tsx
 * <DrawerHeader>
 *   <DrawerHeaderTitle level={2}>Settings</DrawerHeaderTitle>
 *   <DrawerClose />
 * </DrawerHeader>
 * ```
 */
export function DrawerHeaderTitle({
  className,
  level = 2,
  ...rest
}: DrawerTitleProps) {
  return (
    <Heading
      {...rest}
      className={clsx(
        styles.title,
        level <= 3 ? styles.large : styles.medium,
        className,
      )}
      level={level}
    />
  );
}
