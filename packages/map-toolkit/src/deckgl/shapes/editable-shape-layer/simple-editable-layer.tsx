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

import { PathStyleExtension } from '@deck.gl/extensions';
import { useMemo } from 'react';
import {
  getDashArray,
  getFillColor,
  getStrokeColor,
  getStrokeWidth,
} from '../display-shape-layer/utils/display-style';
import { SHAPE_LAYER_IDS } from '../shared/constants';
import { createMode } from './modes';
import type {
  EditAction,
  FeatureCollection,
} from '@deck.gl-community/editable-layers';
import type { EditShapeMode } from '../shared/events';
import type { EditableShape, ShapeId } from '../shared/types';

/**
 * Stable PathStyleExtension instance
 */
const PATH_STYLE_EXTENSION = new PathStyleExtension({ dash: true });

/**
 * Stable accessor functions
 */
// biome-ignore lint/suspicious/noExplicitAny: GeoJsonLayer accessor
const STABLE_GET_FILL_COLOR = (f: any) => getFillColor(f) as any;
// biome-ignore lint/suspicious/noExplicitAny: GeoJsonLayer accessor
const STABLE_GET_LINE_COLOR = (f: any) => getStrokeColor(f) as any;
// biome-ignore lint/suspicious/noExplicitAny: GeoJsonLayer accessor
const STABLE_GET_LINE_WIDTH = (f: any) => getStrokeWidth(f);
// biome-ignore lint/suspicious/noExplicitAny: GeoJsonLayer accessor
const STABLE_GET_DASH_ARRAY = (f: any) => getDashArray(f);

export interface SimpleEditableLayerProps {
  id?: string;
  data: EditableShape[];
  mode?: EditShapeMode;
  selectedShapeId?: ShapeId;
  pickable?: boolean;
  onEdit?: (editAction: EditAction<FeatureCollection>) => void;
}

/**
 * Simple functional wrapper for EditableGeoJsonLayer following NGC2 pattern
 * Uses hooks instead of CompositeLayer class to avoid layer recreation issues
 */
export function SimpleEditableLayer({
  id = SHAPE_LAYER_IDS.EDIT,
  data,
  mode = 'view',
  selectedShapeId,
  pickable = true,
  onEdit,
}: SimpleEditableLayerProps) {
  // Convert data to feature collection
  const featureCollection: FeatureCollection = useMemo(() => {
    let shapesToEdit: EditableShape[] = [];

    if (mode === 'modify' && selectedShapeId) {
      const selectedShape = data.find((s) => s.id === selectedShapeId);
      if (selectedShape) {
        shapesToEdit = [selectedShape];
      }
    }

    return {
      type: 'FeatureCollection',
      // biome-ignore lint/suspicious/noExplicitAny: FeatureCollection type
      features: shapesToEdit.map((shape) => shape.feature) as any,
    };
  }, [data, mode, selectedShapeId]);

  // Get stable mode instance
  const modeInstance = useMemo(() => createMode(mode), [mode]);

  // Calculate selected feature indexes
  const selectedFeatureIndexes = useMemo(() => {
    const hasFeatures = featureCollection.features.length > 0;
    return mode === 'modify' && selectedShapeId && hasFeatures ? [0] : [];
  }, [mode, selectedShapeId, featureCollection.features.length]);

  // Stable sub-layer props
  const subLayerProps = useMemo(
    () => ({
      geojson: {
        filled: true,
        getFillColor: STABLE_GET_FILL_COLOR,
        stroked: true,
        getLineColor: STABLE_GET_LINE_COLOR,
        getLineWidth: STABLE_GET_LINE_WIDTH,
        lineWidthUnits: 'pixels' as const,
        lineWidthMinPixels: 1,
        lineWidthMaxPixels: 20,
        getDashArray: STABLE_GET_DASH_ARRAY,
        extensions: [PATH_STYLE_EXTENSION],
      },
    }),
    [],
  );

  return (
    <editableGeoJsonLayer
      id={id}
      // biome-ignore lint/suspicious/noExplicitAny: EditableGeoJsonLayer data type
      data={featureCollection as any}
      mode={modeInstance}
      selectedFeatureIndexes={selectedFeatureIndexes}
      pickable={pickable}
      onEdit={onEdit}
      editHandlePointRadiusScale={2}
      editHandlePointRadiusMinPixels={4}
      editHandlePointRadiusMaxPixels={8}
      _subLayerProps={subLayerProps}
    />
  );
}
