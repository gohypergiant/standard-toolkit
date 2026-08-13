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

import type { Rgba255Tuple } from '@accelint/predicates';

/**
 * Props added by the CoffinCornerExtension.
 *
 * @template TLayerProps - The host layer's props type to intersect with.
 */
export type CoffinCornerExtensionProps<TLayerProps = unknown> = {
  /**
   * Set of currently selected entity IDs. The extension draws colored
   * brackets around every entity in the Set.
   *
   * @example
   * ```tsx
   * <SymbolLayer
   *   extensions={[new CoffinCornerExtension()]}
   *   selectedEntityIds={selectedSet}
   *   hoveredEntityIds={hoveredSet}
   * />
   * ```
   */
  selectedEntityIds?: ReadonlySet<EntityId>;
  /**
   * Set of currently hovered entity IDs. The extension draws white
   * brackets with a background fill around every entity in the Set.
   */
  hoveredEntityIds?: ReadonlySet<EntityId>;
  /**
   * RGBA color (0-255) for the selected-state bracket fill.
   * Alpha modulates the bracket opacity.
   * @default [57, 183, 250, 255] (#39B7FA, fully opaque)
   */
  selectedCoffinCornerColor?: Rgba255Tuple;
  /**
   * Accessor to extract an entity ID from a data item. Matched against
   * `selectedEntityIds` and `hoveredEntityIds` to drive the shader state.
   * @default (item) => item.id
   */
  // biome-ignore lint/suspicious/noExplicitAny: Data type is unknown at extension level.
  getEntityId?: (item: any) => EntityId;
} & TLayerProps;

/** Unique identifier for an entity managed by the coffin corner extension. */
export type EntityId = string | number;
