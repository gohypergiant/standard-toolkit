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

import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import {
  attachClosestEdge,
  type Edge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { useEffect, useRef, useState } from 'react';
import { useKanban } from '@/components/kanban/context';
import type {
  KanbanCardData,
  KanbanColumnData,
} from '@/components/kanban/types';

export function useColumnInteractions(column: KanbanColumnData) {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const { moveCard } = useKanban();
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    return combine(
      monitorForElements({
        onDragStart(data) {
          // Checking to see if the active card is in the current column.
          if (
            data?.source &&
            data.source.data?.columnId !== column.id &&
            column.canDrop !== false
          ) {
            // Only highlight other active columns.
            setIsHighlighted(true);
          }
        },
        onDrag({ location }) {
          const target = location.current.dropTargets[0];
          if (!target) {
            return;
          }
        },
        onDrop() {
          setIsHighlighted(false);
        },
      }),
      dropTargetForElements({
        element,
        getData: () => column,
        onDragEnter() {
          setIsActive(column.canDrop !== false);
        },
        onDragLeave() {
          setIsActive(false);
        },
        onDrop({ source, self: target, location }) {
          setIsActive(false);

          if (location.current?.dropTargets?.[0]?.data.columnId !== undefined) {
            return;
          }

          if (!moveCard) {
            return;
          }

          const sourceData = source.data as KanbanCardData | undefined;
          const targetData = target.data as KanbanColumnData | undefined;

          if (!(sourceData && targetData)) {
            return;
          }

          if (targetData.canDrop === false) {
            return;
          }

          moveCard(sourceData.id, targetData.id, targetData.cards.length + 1);
        },
      }),
    );
  }, [column, moveCard]);

  return { ref, isHighlighted, isActive };
}

export function useCardInteractions(card: KanbanCardData) {
  const [isDragging, setIsDragging] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
  const { moveCard } = useKanban();
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    return combine(
      draggable({
        element,
        getInitialData() {
          return card;
        },
        //Removing this for now since it creates an extra detached element
        //onGenerateDragPreview({ nativeSetDragImage }) {
        //  setCustomNativeDragPreview({
        //    nativeSetDragImage,
        //    render({ container }) {
        //      setIsPreview(true);
        //      setContainer(container);
        //    },
        //  });
        //},
        onDragStart() {
          setIsDragging(true);
        },
        onDrop() {
          setIsDragging(false);
          setIsPreview(false);
          setContainer(null);
        },
      }),
      dropTargetForElements({
        element,
        getData({ element, input }) {
          const data = card;
          return attachClosestEdge(data, {
            element,
            input,
            allowedEdges: ['top', 'bottom'],
          });
        },
        onDrop({ source, self: target }) {
          if (!moveCard) {
            return;
          }

          const sourceData = source.data as KanbanCardData | undefined;
          const targetData = target.data as KanbanCardData | undefined;

          if (!(sourceData && targetData)) {
            return;
          }

          moveCard(
            sourceData.id,
            targetData.columnId,
            targetData.position,
            closestEdge as Edge,
          );
          setClosestEdge(null);
        },
        onDrag({ self }) {
          const closestEdge = extractClosestEdge(self.data);
          if (!closestEdge) {
            return;
          }

          setClosestEdge(closestEdge);
        },
        onDragLeave() {
          setClosestEdge(null);
        },
      }),
    );
  }, [card, moveCard, closestEdge]);

  return { ref, isDragging, isPreview, container, closestEdge };
}
