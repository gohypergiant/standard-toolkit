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
import { type PropsWithChildren, useContext } from 'react';
import { TreeContext } from './context';
import styles from './styles.module.css';

/**
 * ItemActions - Action buttons for a tree item
 *
 * Container for action buttons in a tree item
 */
export function TreeItemActions({
  children,
  className,
}: PropsWithChildren & { className?: string }) {
  const { variant } = useContext(TreeContext);
  return (
    <div className={clsx(styles.actions, styles[variant], className)}>
      {children}
    </div>
  );
}
