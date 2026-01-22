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
import {
  Tabs as AriaTabs,
  composeRenderProps,
  useContextProps,
} from 'react-aria-components';
import { TabsContext } from './context';
import styles from './styles.module.css';
import type { TabsProps } from './types';

/**
 * Tabs - Tab navigation for organizing content into multiple sections
 *
 * Supports horizontal and vertical orientations with text or icon tabs.
 */
export function Tabs({ ref, ...props }: TabsProps) {
  [props, ref] = useContextProps(props, ref ?? null, TabsContext);

  const { children, className, ...rest } = props;

  return (
    <AriaTabs
      {...rest}
      ref={ref}
      className={composeRenderProps(className, (className) =>
        clsx('group/tabs', styles.tabs, className),
      )}
    >
      {children}
    </AriaTabs>
  );
}
