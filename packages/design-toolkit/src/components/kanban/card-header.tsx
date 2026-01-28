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
import { KanbanHeader } from './header';
import styles from './styles.module.css';
import type { KanbanComponentProps } from './types';

/**
 * KanbanCardHeader - Header section of a card
 *
 * Contains title and actions.
 *
 * @param props - {@link KanbanComponentProps}
 * @param props.className - Optional CSS class name.
 * @param props.children - Header content (title, actions).
 * @returns The rendered KanbanCardHeader component.
 */
export function KanbanCardHeader({
  className,
  children,
  ...rest
}: KanbanComponentProps) {
  return (
    <KanbanHeader {...rest} className={clsx(styles.cardHeader, className)}>
      {children}
    </KanbanHeader>
  );
}
