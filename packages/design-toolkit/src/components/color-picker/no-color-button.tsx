/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
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
import { None } from '@accelint/icons';
import { Button } from '../button';
import { Icon } from '../icon';
import styles from './styles.module.css';
import type { NoColorButtonProps } from './types';

/**
 * NoColorButton - A button that indicates "no color" with the None icon.
 *
 * Displays a button with the None icon to represent the absence of a color
 * selection. Used in color pickers to allow users to reset or clear color values.
 *
 * @param props - {@link NoColorButtonProps}
 * @param props.isActive - Whether the button is in an active state (no color selected).
 * @param props.isDisabled - Whether the button is disabled.
 * @param props.onClick - Click handler callback.
 * @param props.className - Additional CSS class name.
 * @returns The NoColorButton component.
 *
 * @example
 * ```tsx
 * <NoColorButton
 *   isActive={!colorValue}
 *   isDisabled={false}
 *   onClick={handleClear}
 * />
 * ```
 */
export function NoColorButton({
  className,
  isActive,
  isDisabled,
  onClick,
}: Readonly<NoColorButtonProps>) {
  return (
    <Button
      variant='icon'
      size='xsmall'
      isDisabled={isDisabled}
      aria-label='No color'
      className={clsx(styles.pickerControlButton, className)}
      data-selected={isActive || null}
      onClick={onClick}
    >
      <Icon>
        <None />
      </Icon>
    </Button>
  );
}
