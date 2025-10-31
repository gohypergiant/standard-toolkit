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

import type { EditMode, ShapeFeatureType } from '../../shared/types';

/**
 * Check if the mode is a drawing mode
 */
export function isDrawingMode(mode?: EditMode): boolean {
  if (!mode) {
    return false;
  }

  return (
    mode === 'DrawCircleFromCenterMode' ||
    mode === 'DrawLineStringMode' ||
    mode === 'DrawPolygonMode' ||
    mode === 'DrawPointMode'
  );
}

/**
 * Check if the mode is an editing mode
 */
export function isEditingMode(mode?: EditMode): boolean {
  if (!mode) {
    return false;
  }

  return mode === 'ModifyMode' || mode === 'TranslateMode';
}

/**
 * Check if the mode is view mode
 */
export function isViewMode(mode?: EditMode): boolean {
  return !mode || mode === 'ViewMode';
}

/**
 * Get shape feature type from edit mode
 */
export function getShapeFeatureType(mode: EditMode): ShapeFeatureType | null {
  switch (mode) {
    case 'DrawCircleFromCenterMode':
      return 'Circle';
    case 'DrawPolygonMode':
      return 'Polygon';
    case 'DrawLineStringMode':
      return 'LineString';
    case 'DrawPointMode':
      return 'Point';
    default:
      return null;
  }
}

/**
 * Check if shape type is a circle
 */
export function isCircleShape(shapeType: ShapeFeatureType): boolean {
  return shapeType === 'Circle';
}

/**
 * Check if shape type is a line
 */
export function isLineShape(shapeType: ShapeFeatureType): boolean {
  return shapeType === 'LineString';
}

/**
 * Check if shape type is a point
 */
export function isPointShape(shapeType: ShapeFeatureType): boolean {
  return shapeType === 'Point';
}

/**
 * Check if shape type is a polygon (includes Circle which is stored as polygon)
 */
export function isPolygonShape(shapeType: ShapeFeatureType): boolean {
  return shapeType === 'Polygon' || shapeType === 'Circle';
}

/**
 * Check if shape type supports fill color
 */
export function supportsFillColor(shapeType: ShapeFeatureType): boolean {
  // LineString and Point don't have fill
  return !(isLineShape(shapeType) || isPointShape(shapeType));
}

/**
 * Get a user-friendly name for an edit mode
 */
export function getModeName(mode: EditMode): string {
  switch (mode) {
    case 'DrawCircleFromCenterMode':
      return 'Draw Circle';
    case 'DrawPolygonMode':
      return 'Draw Polygon';
    case 'DrawLineStringMode':
      return 'Draw Line';
    case 'DrawPointMode':
      return 'Draw Point';
    case 'ModifyMode':
      return 'Modify Shape';
    case 'TranslateMode':
      return 'Move Shape';
    default:
      return 'View';
  }
}

/**
 * Get the map-mode string from edit mode
 * Converts internal edit modes to map-mode system modes
 */
export function getMapModeFromEditMode(mode: EditMode): string {
  switch (mode) {
    case 'DrawCircleFromCenterMode':
      return 'shapes:draw:circle';
    case 'DrawPolygonMode':
      return 'shapes:draw:polygon';
    case 'DrawLineStringMode':
      return 'shapes:draw:line';
    case 'DrawPointMode':
      return 'shapes:draw:point';
    case 'ModifyMode':
      return 'shapes:edit:modify';
    case 'TranslateMode':
      return 'shapes:edit:translate';
    case 'ViewMode':
      return 'default';
  }
}

/**
 * Get edit mode from map-mode string
 */
export function getEditModeFromMapMode(mapMode: string): EditMode {
  switch (mapMode) {
    case 'shapes:draw:circle':
      return 'DrawCircleFromCenterMode';
    case 'shapes:draw:polygon':
      return 'DrawPolygonMode';
    case 'shapes:draw:line':
      return 'DrawLineStringMode';
    case 'shapes:draw:point':
      return 'DrawPointMode';
    case 'shapes:edit:modify':
      return 'ModifyMode';
    case 'shapes:edit:translate':
      return 'TranslateMode';
    default:
      return 'ViewMode';
  }
}

/**
 * Alias for getShapeFeatureType
 */
export const getShapeTypeForMode = getShapeFeatureType;
