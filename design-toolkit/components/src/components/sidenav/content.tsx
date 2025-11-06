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
import { Provider } from 'react-aria-components';
import { DividerContext } from '../divider/context';
import { SidenavStyles } from './styles';
import type { SidenavContentProps } from './types';

const { content, divider } = SidenavStyles();

/**
 * SidenavContent - Container for sidenav content
 *
 * Provides a container for sidenav content with proper styling
 */
export function SidenavContent({
  className,
  children,
  ...rest
}: SidenavContentProps) {
  return (
    <Provider values={[[DividerContext, { className: divider() }]]}>
      <div {...rest} className={content({ className })}>
        {children}
      </div>
    </Provider>
  );
}
