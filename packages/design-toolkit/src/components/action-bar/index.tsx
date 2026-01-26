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
import { Provider } from 'react-aria-components';
import { ButtonContext, ToggleButtonContext } from '../button/context';
import styles from './styles.module.css';
import type { ActionBarProps } from './types';

/**
 * Container for icon action buttons with consistent spacing and alignment.
 * Commonly used in toolbars, editors, or command interfaces.
 *
 * Renders as a `<nav>` element and provides `variant="icon"` context to child buttons.
 *
 * @param props - The action bar props.
 * @param props.className - Additional CSS class names for styling.
 * @param props.elevation - Visual elevation style ('flat', 'overlay', or 'raised').
 * @param props.size - Size of action buttons within the bar ('medium' or 'small').
 * @param props.children - Action buttons to render within the bar.
 * @returns The action bar navigation element.
 *
 * @example
 * <ActionBar>
 *   <Button><Icon><Copy /></Icon></Button>
 *   <Button><Icon><Delete /></Icon></Button>
 * </ActionBar>
 *
 * @example
 * // With ToggleButton
 * <ActionBar>
 *   <ToggleButton><Icon><Bold /></Icon></ToggleButton>
 *   <ToggleButton><Icon><Italic /></Icon></ToggleButton>
 * </ActionBar>
 *
 * @example
 * // Flat elevation for embedded contexts
 * <ActionBar elevation="flat">
 *   <Button><Icon><Copy /></Icon></Button>
 * </ActionBar>
 */
export function ActionBar({
  className,
  elevation = 'overlay',
  size = 'medium',
  ...rest
}: ActionBarProps) {
  return (
    <Provider
      values={[
        [ButtonContext, { size, variant: 'icon' }],
        [ToggleButtonContext, { size, variant: 'icon' }],
      ]}
    >
      <nav
        {...rest}
        className={clsx(styles.bar, className)}
        data-elevation={elevation}
        data-size={size}
      />
    </Provider>
  );
}
