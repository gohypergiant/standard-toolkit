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

'use client';

import { MaskedIconLayer } from '../../../masked-icon-layer';
import { DEFAULT_COLORS } from '../../shared/constants';
import { getFillColor, getLineColor } from '../../shared/utils/style-utils';
import type { Rgba255Tuple } from '@accelint/predicates';
import { MAP_INTERACTION, MASKED_COFFIN_CORNER_EXTENSION } from '../constants';
import type { Shape, ShapeId } from '../../shared/types';

/** Icon mapping entry describing position and dimensions within an atlas. */
type IconMappingEntry = {
  x: number;
  y: number;
  width: number;
  height: number;
  mask?: boolean;
};

/** Result of scanning features for icon configuration. */
export type IconConfig = {
  /** Whether any feature in the dataset has icon configuration */
  hasIcons: boolean;
  /** Icon atlas image URL or data (shared across all features) */
  atlas?: string;
  /** Icon name-to-position mapping within the atlas */
  mapping?: Record<string, IconMappingEntry>;
};

/**
 * Extract icon configuration from features in a single pass.
 * Returns the first icon's atlas and mapping (all shapes share the same atlas).
 * Uses early return for O(1) best case when the first feature has icons.
 *
 * @param features - Array of styled features to scan
 * @returns Icon configuration with atlas and mapping if any feature has icons
 *
 * @example
 * ```typescript
 * const { hasIcons, atlas, mapping } = getIconConfig(features);
 * if (hasIcons) {
 *   // Configure icon layer with atlas and mapping
 * }
 * ```
 */
export function getIconConfig(features: Shape['feature'][]): IconConfig {
  for (const feature of features) {
    const icon = feature.properties?.styleProperties?.icon;
    if (icon) {
      return {
        hasIcons: true,
        atlas: icon.atlas,
        mapping: icon.mapping,
      };
    }
  }
  return { hasIcons: false };
}

/**
 * Build icon layer props to spread onto a GeoJsonLayer.
 * Returns an empty object when icons are not present.
 *
 * @param hasIcons - Whether any feature has icon config
 * @param iconAtlas - Icon atlas URL or data
 * @param iconMapping - Icon name-to-position mapping
 * @returns Props object to spread onto GeoJsonLayer configuration
 *
 * @example
 * ```typescript
 * const iconProps = getIconLayerProps(hasIcons, iconAtlas, iconMapping);
 * const layer = new GeoJsonLayer({ ...iconProps, data: features });
 * ```
 */
export function getIconLayerProps(
  hasIcons: boolean,
  iconAtlas: string | undefined,
  iconMapping: Record<string, IconMappingEntry> | undefined,
): Record<string, unknown> {
  if (!hasIcons) {
    return {};
  }

  const result: Record<string, unknown> = {
    getIcon: (d: Shape['feature']) =>
      d.properties?.styleProperties?.icon?.name ?? 'marker',
    getIconSize: (d: Shape['feature']) =>
      d.properties?.styleProperties?.icon?.size ?? MAP_INTERACTION.ICON_SIZE,
    getIconColor: getLineColor,
    getIconPixelOffset: (d: Shape['feature']) => {
      const iconSize =
        d.properties?.styleProperties?.icon?.size ?? MAP_INTERACTION.ICON_SIZE;
      return [-1, -iconSize / 2];
    },
    iconBillboard: true,
  };

  if (iconAtlas) {
    result.iconAtlas = iconAtlas;
  }

  if (iconMapping) {
    result.iconMapping = iconMapping;
  }

  return result;
}

/**
 * Build icon update triggers to spread onto GeoJsonLayer updateTriggers.
 * Returns an empty object when icons are not present.
 *
 * @param hasIcons - Whether any feature has icon config
 * @param features - Features array for trigger dependencies
 * @returns Update triggers object to spread onto updateTriggers
 *
 * @example
 * ```typescript
 * const layer = new GeoJsonLayer({
 *   updateTriggers: {
 *     ...getIconUpdateTriggers(hasIcons, features),
 *   },
 * });
 * ```
 */
export function getIconUpdateTriggers(
  hasIcons: boolean,
  features: Shape['feature'][],
): Record<string, unknown[]> {
  if (!hasIcons) {
    return {};
  }

  return {
    getIcon: [features],
    getIconSize: [features],
    getIconColor: [features],
    getIconPixelOffset: [features],
  };
}

/** Parameters needed to wire selection/hover onto the masked icon sublayer. */
type MaskedIconSelectionConfig = {
  /** Currently selected shape id, if any. */
  selectedShapeId: ShapeId | undefined;
  /** Currently hovered point entity id, if any. */
  hoveredEntityId: ShapeId | undefined;
  /** Coffin-corner bracket color for the selected shape. */
  coffinCornerColor: Rgba255Tuple;
  /** Features array, for the fill-color update trigger. */
  features: Shape['feature'][];
};

/**
 * Build the `_subLayerProps['points-icon']` override that swaps the GeoJsonLayer's
 * icon sublayer for a {@link MaskedIconLayer}, so point icons recolor their
 * maskable region in real time from each shape's `styleProperties.fillColor`.
 *
 * `getColor` is kept wired to `getLineColor` (deck.gl IconLayer's whole-glyph
 * tint) so icons WITHOUT a maskable region render exactly as before — the
 * masking only affects pixels matching the layer's `matchColor`.
 *
 * Selection/hover is conveyed purely by the {@link MaskedCoffinCornerExtension}
 * brackets (not by recoloring the icon body). Because this override replaces the
 * propagated `extensions` for the icon sublayer, the coffin-corner selection
 * props (`selectedEntityIds`/`hoveredEntityIds`/`getEntityId`/
 * `selectedCoffinCornerColor`) are re-set here so they still reach the sublayer.
 *
 * @param config - selected/hovered ids, coffin color, and features for triggers
 * @returns props object for `_subLayerProps['points-icon']`
 */
export function getMaskedIconSubLayerProps({
  selectedShapeId,
  hoveredEntityId,
  coffinCornerColor,
  features,
}: MaskedIconSelectionConfig): Record<string, unknown> {
  // deck.gl invokes these on the icon-point sublayer's data, which is not always
  // the wrapped source feature — guard `properties` access (mirroring
  // getIconLayerProps) so a bare geometry object doesn't throw.
  return {
    type: MaskedIconLayer,
    // Per-instance maskable fill from the shape's fill color.
    getFillColor: (feature: Shape['feature']) =>
      feature?.properties ? getFillColor(feature) : DEFAULT_COLORS.fill,
    // Preserve the whole-glyph tint for icons with no maskable region.
    getColor: (feature: Shape['feature']) =>
      feature?.properties ? getLineColor(feature) : DEFAULT_COLORS.line,
    // Selection/hover comes from the coffin-corner brackets, re-set here because
    // overriding `extensions` drops the parent-propagated coffin-corner props.
    extensions: [MASKED_COFFIN_CORNER_EXTENSION],
    selectedEntityIds: selectedShapeId ? new Set([selectedShapeId]) : undefined,
    hoveredEntityIds: hoveredEntityId ? new Set([hoveredEntityId]) : undefined,
    getEntityId: (feature: Shape['feature']) =>
      feature?.properties?.shapeId as ShapeId,
    selectedCoffinCornerColor: coffinCornerColor,
    updateTriggers: {
      getFillColor: [features],
      getColor: [features],
    },
  };
}
