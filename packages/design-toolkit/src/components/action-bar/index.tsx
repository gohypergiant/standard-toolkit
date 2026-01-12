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
 * ActionBar - Container for icon action buttons
 *
 * A container component that displays a collection of action buttons (typically icon-only)
 * and provides consistent spacing and alignment for toolbar-style actions.
 *
 * @example
 * <ActionBar>
 *   <Button><Icon><Copy/></Icon></Button>
 * </ActionBar>
 *
 * @example
 * // Without elevation shadow
 * <ActionBar showElevation={false}>
 *   <Button><Icon><Copy/></Icon></Button>
 * </ActionBar>
 */
export function ActionBar({
  className,
  showElevation = true,
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
        data-elevation={showElevation}
        data-size={size}
      />
    </Provider>
  );
}
