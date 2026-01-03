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

import {
  DEFAULT_DISTANCE_UNITS,
  getDistanceUnitFromAbbreviation,
} from '../../../../shared/units';
import {
  DEFAULT_EDIT_HANDLE_COLOR,
  EDITABLE_LAYER_SUBLAYER_PROPS,
} from '../constants';
import type { Color } from '@deck.gl/core';
import type { DistanceUnit } from '../../../../shared/units';

/**
 * Props returned by getDefaultEditableLayerProps.
 * These are common configuration props shared between DrawShapeLayer and EditShapeLayer.
 */
export interface EditableLayerDefaultProps {
  /** Edit handle point color */
  getEditHandlePointColor: Color;
  /** Edit handle point outline color */
  getEditHandlePointOutlineColor: Color;
  /** Mode configuration with distance units */
  modeConfig: {
    distanceUnits: DistanceUnit;
  };
  /** Sublayer props for tooltips and edit handles */
  _subLayerProps: typeof EDITABLE_LAYER_SUBLAYER_PROPS;
}

/**
 * Returns default props for EditableGeoJsonLayer configuration.
 *
 * This consolidates the common configuration shared between DrawShapeLayer and EditShapeLayer:
 * - Edit handle colors
 * - Mode configuration with distance units
 * - Sublayer props for tooltips and handles
 *
 * @param unitAbbrev - Optional unit abbreviation (e.g., 'km', 'mi'). Defaults to DEFAULT_DISTANCE_UNITS.
 * @returns Default props to spread onto EditableGeoJsonLayer
 *
 * @example
 * ```tsx
 * <editableGeoJsonLayer
 *   {...getDefaultEditableLayerProps(unit)}
 *   // other props
 * />
 * ```
 */
export function getDefaultEditableLayerProps(
  unitAbbrev?: string,
): EditableLayerDefaultProps {
  return {
    getEditHandlePointColor: DEFAULT_EDIT_HANDLE_COLOR,
    getEditHandlePointOutlineColor: DEFAULT_EDIT_HANDLE_COLOR,
    modeConfig: {
      distanceUnits: unitAbbrev
        ? (getDistanceUnitFromAbbreviation(unitAbbrev) ??
          DEFAULT_DISTANCE_UNITS)
        : DEFAULT_DISTANCE_UNITS,
    },
    // biome-ignore lint/style/useNamingConvention: deck.gl API convention
    _subLayerProps: EDITABLE_LAYER_SUBLAYER_PROPS,
  };
}
