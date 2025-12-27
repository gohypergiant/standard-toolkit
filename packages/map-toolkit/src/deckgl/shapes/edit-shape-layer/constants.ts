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
  EDIT_HANDLE_SUBLAYER_PROPS,
  TOOLTIP_SUBLAYER_PROPS,
} from '../shared/constants';
import type { CSSCursorType } from '../../../map-cursor/types';
import type { EditMode } from './types';

/**
 * Mode name for the map-mode integration
 */
export const EDIT_SHAPE_MODE = 'edit-shape';

/**
 * Identifier for the edit shape layer.
 * Used as the owner for map-mode/cursor and as the default layer ID.
 */
export const EDIT_SHAPE_LAYER_ID = 'edit-shape-layer';

/**
 * Cursor mapping for each edit mode
 */
export const EDIT_CURSOR_MAP: Record<EditMode, CSSCursorType> = {
  view: 'default',
  modify: 'crosshair',
  'resize-circle': 'ew-resize',
};

/**
 * Sublayer props for EditableGeoJsonLayer when editing shapes.
 * Configures tooltips, edit handles, and guide lines.
 */
export const EDIT_SUBLAYER_PROPS = {
  ...TOOLTIP_SUBLAYER_PROPS,
  ...EDIT_HANDLE_SUBLAYER_PROPS,
};

/**
 * Circle-specific sublayer props.
 * Includes tooltip props for area display during resize and
 * edit handles that must be pickable for resizing to work.
 */
export const CIRCLE_SUBLAYER_PROPS = {
  ...TOOLTIP_SUBLAYER_PROPS,
  ...EDIT_SUBLAYER_PROPS,
};
