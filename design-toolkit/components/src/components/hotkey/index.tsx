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
import type { ProviderProps } from '@/lib/types';
import { createContext } from 'react';
import {
  type ContextValue,
  Keyboard,
  useContextProps,
} from 'react-aria-components';
import { Icon } from '../icon';
import { HotkeyStyles, HotkeyStylesDefaults } from './styles';
import type { HotkeyProps, HotkeySetProps } from './types';

const { key, set } = HotkeyStyles();

export const HotkeyContext =
  createContext<ContextValue<HotkeyProps, HTMLElement>>(null);

function HotkeyProvider({ children, ...props }: ProviderProps<HotkeyProps>) {
  return (
    <HotkeyContext.Provider value={props}>{children}</HotkeyContext.Provider>
  );
}
HotkeyProvider.displayName = 'Hotkey.Provider';

export function Hotkey({ ref, children, ...props }: HotkeyProps) {
  [props, ref] = useContextProps(props, ref ?? null, HotkeyContext);
  const { className, variant = HotkeyStylesDefaults.variant } = props;

  return (
    <Keyboard ref={ref} {...props} className={key({ className, variant })}>
      {children}
    </Keyboard>
  );
}
Hotkey.displayName = 'Hotkey';

export function HotkeySet({ children, ...props }: HotkeySetProps) {
  const { className } = props;

  return (
    <div className={set({ className })}>
      <Icon.Provider size='large'>{children}</Icon.Provider>
    </div>
  );
}
HotkeySet.displayName = 'Hotkey.Set';

Hotkey.Set = HotkeySet;
Hotkey.Provider = HotkeyProvider;
