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

import { cn } from '@/lib/utils';
import 'client-only';
import { ButtonContext } from '../button';
import type { ActionBarProps } from './types';

export function ActionBar({ className, children, ...rest }: ActionBarProps) {
  return (
    <nav
      {...rest}
      className={cn(
        'flex·max-w-fit·gap-s·rounded-medium·bg-surface-default·p-s·shadow-elevation-overlay',
        className,
      )}
    >
      <ButtonContext.Provider
        //!p-xs because the icon variant padding is not applied on initial render
        value={{ variant: 'icon', className: '!p-xs' }}
      >
        {children}
      </ButtonContext.Provider>
    </nav>
  );
}
ActionBar.displayName = 'ActionBar';
