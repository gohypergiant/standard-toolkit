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

import type { GridDefinition } from './types.ts';

/**
 * Validates a grid definition to ensure it's correctly configured.
 * Throws descriptive errors for any issues found.
 *
 * @param def - Grid definition to validate
 * @throws {Error} When `def.id` or `def.name` is missing, `def.zoomRanges` is
 *   empty, `def.renderer.render` is not a function, a zoom range has invalid
 *   bounds, or a required default style is missing or incomplete.
 *
 * @example
 * ```typescript
 * validateDefinition({
 *   id: 'gars',
 *   name: 'GARS Grid',
 *   zoomRanges: [{ type: 'THIRTY_MINUTE', key: '30min', minZoom: 4, maxZoom: 8 }],
 *   defaultStyles: {
 *     THIRTY_MINUTE: { lineColor: [255, 255, 255, 180], lineWidth: 1 },
 *   },
 *   renderer: garsRenderer,
 * });
 * ```
 */
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Validation requires many checks
export function validateDefinition(def: GridDefinition): void {
  // Required fields
  if (!def.id) {
    throw new Error('Grid definition must have an id');
  }

  if (!def.name) {
    throw new Error(`Grid definition '${def.id}' must have a name`);
  }

  if (!def.zoomRanges || def.zoomRanges.length === 0) {
    throw new Error(
      `Grid definition '${def.id}' must have at least one zoom range`,
    );
  }

  if (!def.renderer) {
    throw new Error(`Grid definition '${def.id}' must have a renderer`);
  }

  if (!def.defaultStyles) {
    throw new Error(`Grid definition '${def.id}' must have defaultStyles`);
  }

  // Validate zoom ranges and styles in a single pass
  for (const range of def.zoomRanges) {
    if (!range.type) {
      throw new Error(
        `Grid definition '${def.id}': zoom range must have a type`,
      );
    }

    if (!range.key) {
      throw new Error(
        `Grid definition '${def.id}': zoom range '${range.type}' must have a key`,
      );
    }

    if (typeof range.minZoom !== 'number') {
      throw new Error(
        `Grid definition '${def.id}': zoom range '${range.key}' must have a minZoom (number)`,
      );
    }

    if (typeof range.maxZoom !== 'number') {
      throw new Error(
        `Grid definition '${def.id}': zoom range '${range.key}' must have a maxZoom (number)`,
      );
    }

    if (range.minZoom > range.maxZoom) {
      throw new Error(
        `Grid definition '${def.id}': Invalid zoom range for '${range.key}' - minZoom (${range.minZoom}) is greater than maxZoom (${range.maxZoom})`,
      );
    }

    if (range.labelMinZoom !== undefined) {
      if (range.labelMinZoom < range.minZoom) {
        throw new Error(
          `Grid definition '${def.id}': Invalid label zoom for '${range.key}' - labelMinZoom (${range.labelMinZoom}) is less than minZoom (${range.minZoom})`,
        );
      }

      if (range.labelMinZoom > range.maxZoom) {
        throw new Error(
          `Grid definition '${def.id}': Invalid label zoom for '${range.key}' - labelMinZoom (${range.labelMinZoom}) is greater than maxZoom (${range.maxZoom})`,
        );
      }
    }

    const style = def.defaultStyles[range.type];

    if (!style) {
      throw new Error(
        `Grid definition '${def.id}': Missing default style for grid type '${range.type}'`,
      );
    }

    if (!style.lineColor) {
      throw new Error(
        `Grid definition '${def.id}': Style for grid type '${range.type}' must have lineColor`,
      );
    }

    if (typeof style.lineWidth !== 'number') {
      throw new Error(
        `Grid definition '${def.id}': Style for grid type '${range.type}' must have lineWidth (number)`,
      );
    }
  }

  // Validate renderer interface
  if (typeof def.renderer.render !== 'function') {
    throw new Error(
      `Grid definition '${def.id}': renderer must have a render method`,
    );
  }
}
