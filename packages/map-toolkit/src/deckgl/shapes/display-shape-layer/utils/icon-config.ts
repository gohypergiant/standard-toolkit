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

import { getLineColor } from '../../shared/utils/style-utils';
import { COFFIN_CORNERS, MAP_INTERACTION } from '../constants';
import type { Shape } from '../../shared/types';

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
    iconBillboard: false,
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

/** WeakMap memoizing extended icon mappings by baseMapping identity. */
const coffinCornerCache = new WeakMap<
  Record<string, IconMappingEntry>,
  Record<string, IconMappingEntry>
>();

/**
 * Extend an icon mapping with coffin corners entries for hover/selection feedback.
 * Memoized per baseMapping identity via WeakMap to avoid re-spreading per render frame.
 *
 * @param baseMapping - The original icon mapping from the feature's icon config
 * @returns Extended mapping with coffin corners icons added
 *
 * @example
 * ```typescript
 * const extendedMapping = extendMappingWithCoffinCorners(iconMapping);
 * // Result includes original mapping entries plus coffin corner icons
 * ```
 */
export function extendMappingWithCoffinCorners(
  baseMapping: Record<string, IconMappingEntry>,
): Record<string, IconMappingEntry> {
  const cached = coffinCornerCache.get(baseMapping);
  if (cached) {
    return cached;
  }

  const result = {
    ...baseMapping,
    [COFFIN_CORNERS.HOVER_ICON]: {
      x: 0,
      y: 0,
      width: 76,
      height: 76,
      mask: false,
    },
    [COFFIN_CORNERS.SELECTED_ICON]: {
      x: 76,
      y: 0,
      width: 76,
      height: 76,
      mask: false,
    },
    [COFFIN_CORNERS.SELECTED_HOVER_ICON]: {
      x: 152,
      y: 0,
      width: 76,
      height: 76,
      mask: false,
    },
  };
  coffinCornerCache.set(baseMapping, result);
  return result;
}
