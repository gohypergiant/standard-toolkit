// __private-exports
/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { useCallback, useState } from 'react';
import { BASE_Z_INDEX } from '../constants';
import type { UniqueId } from '@accelint/core/utility/uuid';
import type { Dimensions, FloatingCardLayout, Position } from '../types';

/**
 * Tracks position, size, and stacking order for the cards in one provider.
 *
 * @returns The layout registry and the operations that mutate it.
 *
 * @remarks
 * State is per-provider rather than module-level so two providers on a page
 * keep independent stacking orders.
 */
export function useCardLayout() {
  const [layouts, setLayouts] = useState<Record<UniqueId, FloatingCardLayout>>(
    {},
  );

  const registerCard = useCallback(
    (
      id: UniqueId,
      title: string | undefined,
      position: Position,
      dimensions: Dimensions,
    ) => {
      setLayouts((current) => {
        const existing = current[id];

        // An open card keeps the geometry it has, so a re-register cannot undo
        // a drag or resize. Only the title stays live.
        if (existing) {
          return existing.title === title
            ? current
            : { ...current, [id]: { ...existing, title } };
        }

        const highest = Object.values(current).reduce(
          (max, layout) => Math.max(max, layout.zIndex),
          BASE_Z_INDEX - 1,
        );

        return {
          ...current,
          [id]: { title, position, dimensions, zIndex: highest + 1 },
        };
      });
    },
    [],
  );

  const unregisterCard = useCallback((id: UniqueId) => {
    setLayouts((current) => {
      if (!current[id]) {
        return current;
      }

      const next = { ...current };
      delete next[id];

      return next;
    });
  }, []);

  const moveCard = useCallback((id: UniqueId, position: Position) => {
    setLayouts((current) =>
      current[id]
        ? { ...current, [id]: { ...current[id], position } }
        : current,
    );
  }, []);

  const resizeCard = useCallback(
    (id: UniqueId, dimensions: Dimensions, position: Position) => {
      setLayouts((current) =>
        current[id]
          ? { ...current, [id]: { ...current[id], dimensions, position } }
          : current,
      );
    },
    [],
  );

  const bringToFront = useCallback((id: UniqueId) => {
    setLayouts((current) => {
      const target = current[id];

      if (!target) {
        return current;
      }

      const highest = Object.values(current).reduce(
        (max, layout) => Math.max(max, layout.zIndex),
        BASE_Z_INDEX - 1,
      );

      // Already on top -- skip the update so focusing a card repeatedly does
      // not re-render every sibling.
      if (target.zIndex === highest) {
        return current;
      }

      // Renumber from the bottom rather than incrementing past the previous
      // top. Alternating focus between two cards would otherwise climb without
      // limit and eventually paint over application chrome.
      const ordered = Object.entries(current)
        .filter(([cardId]) => cardId !== id)
        .sort(([, a], [, b]) => a.zIndex - b.zIndex);

      const next = { ...current };

      ordered.forEach(([cardId, layout], index) => {
        next[cardId as UniqueId] = { ...layout, zIndex: BASE_Z_INDEX + index };
      });

      next[id] = { ...target, zIndex: BASE_Z_INDEX + ordered.length };

      return next;
    });
  }, []);

  return {
    layouts,
    registerCard,
    unregisterCard,
    moveCard,
    resizeCard,
    bringToFront,
  };
}
