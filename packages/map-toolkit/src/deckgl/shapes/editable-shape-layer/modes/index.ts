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
  DrawLineStringMode as BaseDrawLineStringMode,
  DrawPointMode as BaseDrawPointMode,
  DrawPolygonMode as BaseDrawPolygonMode,
  ModifyMode as BaseModifyMode,
  ViewMode as BaseViewMode,
  DrawCircleFromCenterMode,
} from '@deck.gl-community/editable-layers';
import type { EditShapeMode } from '../../shared/events';

/**
 * Re-export modes with our naming convention
 */
export const DrawCircleMode = DrawCircleFromCenterMode;
export const DrawPolygonMode = BaseDrawPolygonMode;
export const DrawLineMode = BaseDrawLineStringMode;
export const DrawPointMode = BaseDrawPointMode;
export const ModifyMode = BaseModifyMode;
export const ViewMode = BaseViewMode;

/**
 * Map of edit shape modes to their mode class instances
 */
export const SHAPE_MODES = {
  view: ViewMode,
  drawCircle: DrawCircleMode,
  drawPolygon: DrawPolygonMode,
  drawLine: DrawLineMode,
  drawPoint: DrawPointMode,
  modify: ModifyMode,
} as const;

/**
 * Get the mode class for a given edit shape mode
 */
export function getModeClass(mode: EditShapeMode) {
  return SHAPE_MODES[mode];
}

/**
 * Create a mode instance for a given edit shape mode
 */
export function createMode(mode: EditShapeMode) {
  const ModeClass = getModeClass(mode);
  return new ModeClass();
}
