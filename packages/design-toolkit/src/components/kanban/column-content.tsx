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
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import styles from './styles.module.css';
import type { KanbanColContentProps } from './types';

/**
 * KanbanColumnContent - Container for cards within a column
 *
 * Provides sortable context for card drag-and-drop.
 *
 * @param props - {@link KanbanColContentProps}
 * @param props.children - Card elements.
 * @param props.className - Optional CSS class name.
 * @param props.column - Column data for sortable context.
 * @returns The rendered KanbanColumnContent component.
 */
export function KanbanColumnContent({
  children,
  className,
  column,
  ...rest
}: KanbanColContentProps) {
  const cardIds = column.cards.map((card) => card.id);

  return (
    <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
      <div {...rest} className={clsx(styles.columnContent, className)}>
        {children}
      </div>
    </SortableContext>
  );
}
