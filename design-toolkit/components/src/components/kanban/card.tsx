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

import { useCardInteractions } from '../../hooks/kanban';
import { Divider } from '../divider';
import { useDragContext } from './kanban';
import { CardInnerStyles, KanbanStyles } from './styles';
import type { KanbanCardProps } from './types';

const { cardContainerOuter, divider } = KanbanStyles();

export function KanbanCard({
  className,
  children,
  card,
  isActive,
  ...rest
}: KanbanCardProps) {
  const { isDragging, closestEdge, ref, style, attributes, listeners } =
    useCardInteractions(card);
  const { activeId } = useDragContext();

  // Check if we should show the drop placeholder
  const showPlaceholder = activeId && activeId !== card.id && closestEdge;

  return (
    <li className={cardContainerOuter()} ref={ref} style={style}>
      {showPlaceholder && closestEdge === 'top' && (
        <Divider className={divider()} />
      )}

      <div
        className={CardInnerStyles({
          className,
          isActive,
          dragging: isDragging,
        })}
        data-dragging={isDragging}
        {...attributes}
        {...listeners}
        {...rest}
      >
        {children}
      </div>

      {showPlaceholder && closestEdge === 'bottom' && (
        <Divider className={divider()} />
      )}
    </li>
  );
}
