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
import { Keyboard, useContextProps } from 'react-aria-components';
import { HotkeyContext } from './context';
import styles from './styles.module.css';
import type { HotkeyProps } from './types';

/**
 * Hotkey - A visual representation of keyboard shortcuts and key combinations
 *
 * Displays keyboard keys and shortcuts in a consistent, accessible format.
 * Perfect for documentation, help systems, or UI elements that need to show
 * keyboard shortcuts. Supports multiple visual styles including outlined keys,
 * flat presentation, and icon-specific formatting.
 *
 * @example
 * // Basic hotkey display
 * <Hotkey>Ctrl</Hotkey>
 *
 * @example
 * // Hotkey combination with different variants
 * <HotkeySet>
 *   <Hotkey variant="outline">Cmd</Hotkey>
 *   <span>+</span>
 *   <Hotkey variant="outline">K</Hotkey>
 * </HotkeySet>
 *
 * @example
 * // Flat style for inline text
 * <p>Press <Hotkey variant="flat">Enter</Hotkey> to submit</p>
 *
 * @example
 * // Icon variant for special keys
 * <HotkeySet>
 *   <Hotkey variant="icon">⌘</Hotkey>
 *   <Hotkey>Space</Hotkey>
 * </HotkeySet>
 */
export function Hotkey({ ref, children, ...props }: HotkeyProps) {
  [props, ref] = useContextProps(props, ref ?? null, HotkeyContext);

  const { className, variant = 'outline', ...rest } = props;

  return (
    <Keyboard
      {...rest}
      ref={ref}
      className={clsx(styles.key, styles[variant], className)}
    >
      {children}
    </Keyboard>
  );
}
