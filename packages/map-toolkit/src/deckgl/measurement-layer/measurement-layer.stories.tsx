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

import 'client-only';
import { uuid } from '@accelint/core';
import { useState } from 'react';
import { BaseMap } from '@/deckgl/base-map';
import { DEFAULT_VIEW_STATE } from '@/shared/constants';
import './fiber';
import { MeasurementTool } from './measurement-tool';
import { useMeasurement } from './use-measurement';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'DeckGL/Measurement Layer',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Stable map IDs for Storybook ──────────────────────────────────────────

const DEFAULT_MAP_ID = uuid();
const SINGLE_UNIT_MAP_ID = uuid();
const MODIFIER_MAP_ID = uuid();
const CUSTOM_LABEL_MAP_ID = uuid();
const DIRECT_LAYER_MAP_ID = uuid();

// ─── Story 1: Default Measurement ──────────────────────────────────────────

/**
 * Default Measurement
 *
 * Drag anywhere on the map to measure bearing and distance between two points.
 * The readout displays both kilometers and nautical miles (dual-unit default):
 * `"42.3 km / 22.8 NM | BRG: 321°"`
 *
 * Instructions:
 * 1. Click and drag on the map to start measuring
 * 2. Release to complete the measurement
 * 3. Drag again to start a new measurement
 */
export const DefaultMeasurement: Story = {
  render: () => {
    const { isMeasuring, distanceKm, distanceNM, bearingDeg } =
      useMeasurement(DEFAULT_MAP_ID);

    return (
      <div className='relative h-dvh w-dvw'>
        <BaseMap
          className='absolute inset-0'
          id={DEFAULT_MAP_ID}
          initialViewState={DEFAULT_VIEW_STATE}
        >
          <MeasurementTool mapId={DEFAULT_MAP_ID} />
        </BaseMap>

        <div className='absolute top-l left-l z-10 flex w-[280px] flex-col gap-m rounded-lg bg-surface-default p-l shadow-elevation-overlay'>
          <p className='font-bold text-header-l'>Measurement Tool</p>

          <div className='rounded-lg bg-info-muted p-s'>
            <p className='mb-xs text-body-xs'>Status</p>
            <code className='text-body-m'>
              {isMeasuring ? 'Measuring...' : 'Drag to measure'}
            </code>
          </div>

          {isMeasuring && (
            <div className='flex flex-col gap-xs'>
              <div className='rounded-lg border border-border-default bg-surface-subtle p-s'>
                <p className='mb-xs text-body-xs text-content-secondary'>
                  Distance
                </p>
                <p className='text-body-m'>
                  {distanceKm.toFixed(1)} km / {distanceNM.toFixed(1)} NM
                </p>
              </div>
              <div className='rounded-lg border border-border-default bg-surface-subtle p-s'>
                <p className='mb-xs text-body-xs text-content-secondary'>
                  Bearing
                </p>
                <p className='text-body-m'>{Math.round(bearingDeg)}°</p>
              </div>
            </div>
          )}

          <div className='rounded-lg bg-surface-contrast-subtle p-s'>
            <p className='mb-xs font-semibold text-body-xs'>Instructions</p>
            <ul className='list-inside list-disc space-y-xs text-body-xs text-content-secondary'>
              <li>Click and drag to measure</li>
              <li>Label shows km + NM and bearing</li>
              <li>Drag again to remeasure</li>
            </ul>
          </div>
        </div>
      </div>
    );
  },
};

// ─── Story 2: Single Unit (Kilometers) ─────────────────────────────────────

/**
 * Single Unit (Kilometers)
 *
 * Demonstrates `units='kilometers'` prop. The on-canvas label shows only
 * kilometers: `"42.3 km | BRG: 321°"` — suitable for land-based operations
 * where nautical miles are not needed.
 *
 * Instructions:
 * 1. Click and drag on the map to measure
 * 2. Note the label shows only kilometers (no NM)
 */
export const SingleUnitKilometers: Story = {
  render: () => {
    const { isMeasuring, distanceKm, bearingDeg } =
      useMeasurement(SINGLE_UNIT_MAP_ID);

    return (
      <div className='relative h-dvh w-dvw'>
        <BaseMap
          className='absolute inset-0'
          id={SINGLE_UNIT_MAP_ID}
          initialViewState={DEFAULT_VIEW_STATE}
        >
          <MeasurementTool mapId={SINGLE_UNIT_MAP_ID} units='kilometers' />
        </BaseMap>

        <div className='absolute top-l left-l z-10 flex w-[280px] flex-col gap-m rounded-lg bg-surface-default p-l shadow-elevation-overlay'>
          <p className='font-bold text-header-l'>Single Unit: km</p>

          <div className='rounded-lg bg-info-muted p-s'>
            <p className='mb-xs text-body-xs'>Status</p>
            <code className='text-body-m'>
              {isMeasuring ? 'Measuring...' : 'Drag to measure'}
            </code>
          </div>

          {isMeasuring && (
            <div className='flex flex-col gap-xs'>
              <div className='rounded-lg border border-border-default bg-surface-subtle p-s'>
                <p className='mb-xs text-body-xs text-content-secondary'>
                  Distance
                </p>
                <p className='text-body-m'>{distanceKm.toFixed(1)} km</p>
              </div>
              <div className='rounded-lg border border-border-default bg-surface-subtle p-s'>
                <p className='mb-xs text-body-xs text-content-secondary'>
                  Bearing
                </p>
                <p className='text-body-m'>{Math.round(bearingDeg)}°</p>
              </div>
            </div>
          )}

          <div className='rounded-lg bg-surface-contrast-subtle p-s'>
            <p className='mb-xs font-semibold text-body-xs'>Props</p>
            <code className='text-body-xs'>
              {'<MeasurementTool units="kilometers" />'}
            </code>
          </div>
        </div>
      </div>
    );
  },
};

// ─── Story 3: Modifier Key Required ────────────────────────────────────────

/**
 * Modifier Key Required (Shift+drag)
 *
 * Demonstrates `requiresModifier='shift'`. Plain drag pans the map normally.
 * Hold Shift while dragging to activate measurement. This allows simultaneous
 * pan + measure without mode switching.
 *
 * Instructions:
 * 1. Plain drag — pans the map (no measurement)
 * 2. Hold Shift and drag — activates measurement
 * 3. Release mouse to complete; release Shift to stop measuring mid-drag
 */
export const ModifierKeyRequired: Story = {
  render: () => {
    const { isMeasuring, distanceKm, distanceNM, bearingDeg } =
      useMeasurement(MODIFIER_MAP_ID);

    return (
      <div className='relative h-dvh w-dvw'>
        <BaseMap
          className='absolute inset-0'
          id={MODIFIER_MAP_ID}
          initialViewState={DEFAULT_VIEW_STATE}
        >
          <MeasurementTool mapId={MODIFIER_MAP_ID} requiresModifier='shift' />
        </BaseMap>

        <div className='absolute top-l left-l z-10 flex w-[300px] flex-col gap-m rounded-lg bg-surface-default p-l shadow-elevation-overlay'>
          <p className='font-bold text-header-l'>Shift+Drag to Measure</p>

          <div
            className={`rounded-lg p-s ${isMeasuring ? 'bg-success-muted' : 'bg-info-muted'}`}
          >
            <p className='mb-xs text-body-xs'>Status</p>
            <code className='text-body-m'>
              {isMeasuring ? 'Measuring (Shift held)' : 'Plain drag pans map'}
            </code>
          </div>

          {isMeasuring && (
            <div className='flex flex-col gap-xs'>
              <div className='rounded-lg border border-border-default bg-surface-subtle p-s'>
                <p className='mb-xs text-body-xs text-content-secondary'>
                  Distance
                </p>
                <p className='text-body-m'>
                  {distanceKm.toFixed(1)} km / {distanceNM.toFixed(1)} NM
                </p>
              </div>
              <div className='rounded-lg border border-border-default bg-surface-subtle p-s'>
                <p className='mb-xs text-body-xs text-content-secondary'>
                  Bearing
                </p>
                <p className='text-body-m'>{Math.round(bearingDeg)}°</p>
              </div>
            </div>
          )}

          <div className='rounded-lg bg-surface-contrast-subtle p-s'>
            <p className='mb-xs font-semibold text-body-xs'>Instructions</p>
            <ul className='list-inside list-disc space-y-xs text-body-xs text-content-secondary'>
              <li>Plain drag: pans the map</li>
              <li>
                <strong>Shift + drag:</strong> activates measurement
              </li>
              <li>Release Shift mid-drag to stop</li>
            </ul>
          </div>

          <div className='rounded-lg bg-surface-contrast-subtle p-s'>
            <p className='mb-xs font-semibold text-body-xs'>Prop</p>
            <code className='text-body-xs'>requiresModifier="shift"</code>
          </div>
        </div>
      </div>
    );
  },
};

// ─── Story 4: Custom Label ──────────────────────────────────────────────────

/**
 * Custom Label
 *
 * Demonstrates `getLabel` override. Instead of the default `"X km / Y NM | BRG: Z°"`,
 * this story shows a custom format: `"From: lon,lat → To: lon,lat"` — useful for
 * applications that need coordinate readouts rather than distance/bearing.
 *
 * Instructions:
 * 1. Click and drag on the map to measure
 * 2. Note the label shows coordinate pairs instead of distance/bearing
 */
export const CustomLabel: Story = {
  render: () => {
    const { isMeasuring, pointA, pointB, distanceKm, bearingDeg } =
      useMeasurement(CUSTOM_LABEL_MAP_ID);

    const [lastLabel, setLastLabel] = useState<string>('(none yet)');

    const getLabel = (a: [number, number], b: [number, number]): string => {
      const label = `${a[0].toFixed(3)},${a[1].toFixed(3)} → ${b[0].toFixed(3)},${b[1].toFixed(3)}`;
      setLastLabel(label);

      return label;
    };

    return (
      <div className='relative h-dvh w-dvw'>
        <BaseMap
          className='absolute inset-0'
          id={CUSTOM_LABEL_MAP_ID}
          initialViewState={DEFAULT_VIEW_STATE}
        >
          <MeasurementTool mapId={CUSTOM_LABEL_MAP_ID} getLabel={getLabel} />
        </BaseMap>

        <div className='absolute top-l left-l z-10 flex w-[320px] flex-col gap-m rounded-lg bg-surface-default p-l shadow-elevation-overlay'>
          <p className='font-bold text-header-l'>Custom Label Format</p>

          <div className='rounded-lg bg-info-muted p-s'>
            <p className='mb-xs text-body-xs'>Status</p>
            <code className='text-body-m'>
              {isMeasuring ? 'Measuring...' : 'Drag to measure'}
            </code>
          </div>

          {isMeasuring && pointA && pointB && (
            <div className='flex flex-col gap-xs'>
              <div className='rounded-lg border border-border-default bg-surface-subtle p-s'>
                <p className='mb-xs text-body-xs text-content-secondary'>
                  Label (on-canvas)
                </p>
                <code className='break-all text-body-xs'>{lastLabel}</code>
              </div>
              <div className='rounded-lg border border-border-default bg-surface-subtle p-s'>
                <p className='mb-xs text-body-xs text-content-secondary'>
                  Computed distance / bearing
                </p>
                <p className='text-body-xs'>
                  {distanceKm.toFixed(1)} km | {Math.round(bearingDeg)}°
                </p>
              </div>
            </div>
          )}

          <div className='rounded-lg bg-surface-contrast-subtle p-s'>
            <p className='mb-xs font-semibold text-body-xs'>
              getLabel override
            </p>
            <code className='break-all text-body-xs'>
              getLabel=(a, b) =&gt; `a[0].toFixed(3), a[1].toFixed(3) ...`
            </code>
          </div>
        </div>
      </div>
    );
  },
};

// ─── Story 5: Direct Layer Usage ────────────────────────────────────────────

/**
 * Direct Layer Usage (Static)
 *
 * Demonstrates rendering `<measurementLayer />` directly via the deck.gl fiber
 * renderer with static `pointA` and `pointB` — no interaction required. This
 * usage is appropriate when coordinates are known upfront (e.g., from a database
 * or external calculation) and no drag interaction is needed.
 *
 * The fiber import (`./fiber`) registers `<measurementLayer>` as a JSX intrinsic
 * element for use inside a `<BaseMap>`.
 */
export const DirectLayerUsage: Story = {
  render: () => {
    // Static points: Dallas, TX → New Orleans, LA
    const pointA: [number, number] = [-96.797, 32.776];
    const pointB: [number, number] = [-90.071, 29.951];

    return (
      <div className='relative h-dvh w-dvw'>
        <BaseMap
          className='absolute inset-0'
          id={DIRECT_LAYER_MAP_ID}
          initialViewState={{
            ...DEFAULT_VIEW_STATE,
            longitude: -93.5,
            latitude: 31.5,
            zoom: 5,
          }}
        >
          {/* Direct fiber usage — no hook, no MeasurementTool wrapper */}
          <measurementLayer
            id='static-measurement'
            pointA={pointA}
            pointB={pointB}
            showLabel
            lineColor={[0, 200, 255, 200]}
            endpointColor={[0, 200, 255, 255]}
          />
        </BaseMap>

        <div className='absolute top-l left-l z-10 flex w-[300px] flex-col gap-m rounded-lg bg-surface-default p-l shadow-elevation-overlay'>
          <p className='font-bold text-header-l'>Direct Layer (Static)</p>

          <div className='rounded-lg bg-surface-subtle p-s'>
            <p className='mb-xs font-semibold text-body-xs'>pointA</p>
            <code className='text-body-xs'>
              Dallas, TX ({pointA[0]}, {pointA[1]})
            </code>
          </div>
          <div className='rounded-lg bg-surface-subtle p-s'>
            <p className='mb-xs font-semibold text-body-xs'>pointB</p>
            <code className='text-body-xs'>
              New Orleans, LA ({pointB[0]}, {pointB[1]})
            </code>
          </div>

          <div className='rounded-lg bg-surface-contrast-subtle p-s'>
            <p className='mb-xs font-semibold text-body-xs'>Usage pattern</p>
            <code className='block text-body-xs leading-relaxed'>
              {`import './fiber';`}
              <br />
              {'<measurementLayer'}
              <br />
              {'  pointA={[-96.797, 32.776]}'}
              <br />
              {'  pointB={[-90.071, 29.951]}'}
              <br />
              {'  showLabel'}
              <br />
              {'/>'}
            </code>
          </div>
        </div>
      </div>
    );
  },
};
