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

import {
  type CollisionDetection,
  closestCenter,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { createContext, useContext, useState } from 'react';
import { parseDropTarget, useKanban } from '@/components/kanban/context';
import { CardInnerStyles, KanbanStyles } from './styles';
import type { KanbanProps } from './types';

const { container, cardHeader, cardTitle, cardBody } = KanbanStyles();

// Context for sharing active drag state

export const DragContext = createContext<{ activeId: string | null } | null>(
  null,
);

export const useDragContext = () => {
  const context = useContext(DragContext);
  if (!context) {
    throw new Error('useDragContext must be used within Kanban component');
  }
  return context;
};

const ACTIVATION_DISTANCE = 8;

export function Kanban({ children, className, ...rest }: KanbanProps) {
  const { moveCard, cardMap } = useKanban();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: ACTIVATION_DISTANCE,
      },
    }),
  );

  const collisionDetectionStrategy: CollisionDetection = (args) => {
    // First, try pointer within for direct pointer detection
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) {
      return pointerCollisions;
    }

    // Then try rectangle intersection for better coverage
    const rectCollisions = rectIntersection(args);
    if (rectCollisions.length > 0) {
      return rectCollisions;
    }

    // Fall back to closest center
    return closestCenter(args);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);

    const dropTarget = parseDropTarget(event);
    if (!dropTarget) {
      return;
    }

    moveCard(
      event.active.id as string,
      dropTarget.columnId,
      dropTarget.position,
      dropTarget.edge,
    );
  };

  // Find the active card for the drag overlay
  const activeCard = activeId ? cardMap.get(activeId)?.card : null;

  return (
    <DragContext.Provider value={{ activeId }}>
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetectionStrategy}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className={container({ className })} {...rest}>
          {children}
        </div>
        <DragOverlay>
          {activeCard ? (
            <div className={CardInnerStyles({ isActive: true })}>
              <div className={cardHeader()}>
                <span className={cardTitle()}>{activeCard.title}</span>
              </div>
              <div className={cardBody()}>{activeCard.body}</div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </DragContext.Provider>
  );
}
