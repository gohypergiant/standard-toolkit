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
import { formatBearing, formatDistance } from '@accelint/formatters/bearing';
import { useState } from 'react';
import { BaseMap } from '@/deckgl/base-map';
import { DEFAULT_VIEW_STATE } from '@/shared/constants';
import './fiber';
import { MeasurementTool } from './measurement-tool';
import { useMeasurement } from './use-measurement';
import type { DistanceUnit } from '@accelint/constants/units';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

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

/** Default dual-unit readout, matching `MeasurementLayer`'s `units` default. */
const DUAL_UNITS: DistanceUnit[] = ['kilometers', 'nauticalmiles'];

// ─── Shared readout UI ──────────────────────────────────────────────────────

/** Labeled value box shown inside a `ReadoutPanel`. */
function Readout({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className='rounded-lg border border-border-default bg-surface-subtle p-s'>
      <p className='mb-xs text-body-xs text-content-secondary'>{label}</p>
      {children}
    </div>
  );
}

/** Floating card with a title, a status line, and story-specific content. */
function ReadoutPanel({
  title,
  status,
  children,
}: {
  title: string;
  status: string;
  children: ReactNode;
}) {
  return (
    <div className='absolute top-l left-l z-10 flex w-[300px] flex-col gap-m rounded-lg bg-surface-default p-l shadow-elevation-overlay'>
      <p className='font-bold text-header-l'>{title}</p>

      <div className='rounded-lg bg-info-muted p-s'>
        <p className='mb-xs text-body-xs'>Status</p>
        <code className='text-body-m'>{status}</code>
      </div>

      {children}
    </div>
  );
}

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
    const { isMeasuring, distanceMeters, bearingDeg } =
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

        <ReadoutPanel
          title='Measurement Tool'
          status={isMeasuring ? 'Measuring...' : 'Drag to measure'}
        >
          {isMeasuring && (
            <div className='flex flex-col gap-xs'>
              <Readout label='Distance'>
                <p className='text-body-m'>
                  {formatDistance(distanceMeters, DUAL_UNITS)}
                </p>
              </Readout>
              <Readout label='Bearing'>
                <p className='text-body-m'>{formatBearing(bearingDeg)}</p>
              </Readout>
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
        </ReadoutPanel>
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
    const { isMeasuring, distanceMeters, bearingDeg } =
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

        <ReadoutPanel
          title='Single Unit: km'
          status={isMeasuring ? 'Measuring...' : 'Drag to measure'}
        >
          {isMeasuring && (
            <div className='flex flex-col gap-xs'>
              <Readout label='Distance'>
                <p className='text-body-m'>
                  {formatDistance(distanceMeters, 'kilometers')}
                </p>
              </Readout>
              <Readout label='Bearing'>
                <p className='text-body-m'>{formatBearing(bearingDeg)}</p>
              </Readout>
            </div>
          )}

          <div className='rounded-lg bg-surface-contrast-subtle p-s'>
            <p className='mb-xs font-semibold text-body-xs'>Props</p>
            <code className='text-body-xs'>
              {'<MeasurementTool units="kilometers" />'}
            </code>
          </div>
        </ReadoutPanel>
      </div>
    );
  },
};

// ─── Story 3: Modifier Key Required ────────────────────────────────────────

/**
 * Modifier Key Required (Alt+drag)
 *
 * Demonstrates `requiresModifier='alt'`. Plain drag pans the map normally.
 * Hold Alt while dragging to activate measurement. This allows simultaneous
 * pan + measure without mode switching.
 *
 * Alt is used rather than Shift because BaseMap's rubber-band zoom (on by
 * default) also arms on Shift, and the two gestures conflict. Ctrl+drag is
 * BaseMap's rotate/tilt gesture.
 *
 * Instructions:
 * 1. Plain drag — pans the map (no measurement)
 * 2. Hold Alt and drag — activates measurement
 * 3. Release mouse to complete; release Alt to stop measuring mid-drag
 */
export const ModifierKeyRequired: Story = {
  render: () => {
    const { isMeasuring, distanceMeters, bearingDeg } = useMeasurement(
      MODIFIER_MAP_ID,
      'alt',
    );

    return (
      <div className='relative h-dvh w-dvw'>
        <BaseMap
          className='absolute inset-0'
          id={MODIFIER_MAP_ID}
          initialViewState={DEFAULT_VIEW_STATE}
        >
          <MeasurementTool mapId={MODIFIER_MAP_ID} requiresModifier='alt' />
        </BaseMap>

        <ReadoutPanel
          title='Alt+Drag to Measure'
          status={isMeasuring ? 'Measuring (Alt held)' : 'Plain drag pans map'}
        >
          {isMeasuring && (
            <div className='flex flex-col gap-xs'>
              <Readout label='Distance'>
                <p className='text-body-m'>
                  {formatDistance(distanceMeters, DUAL_UNITS)}
                </p>
              </Readout>
              <Readout label='Bearing'>
                <p className='text-body-m'>{formatBearing(bearingDeg)}</p>
              </Readout>
            </div>
          )}

          <div className='rounded-lg bg-surface-contrast-subtle p-s'>
            <p className='mb-xs font-semibold text-body-xs'>Instructions</p>
            <ul className='list-inside list-disc space-y-xs text-body-xs text-content-secondary'>
              <li>Plain drag: pans the map</li>
              <li>
                <strong>Alt + drag:</strong> activates measurement
              </li>
              <li>Release Alt mid-drag to stop</li>
              <li>
                Shift is not supported as a modifier: it conflicts with
                BaseMap's rubber-band zoom
              </li>
            </ul>
          </div>

          <div className='rounded-lg bg-surface-contrast-subtle p-s'>
            <p className='mb-xs font-semibold text-body-xs'>Prop</p>
            <code className='text-body-xs'>requiresModifier="alt"</code>
          </div>
        </ReadoutPanel>
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
    const { isMeasuring, pointA, pointB, distanceMeters, bearingDeg } =
      useMeasurement(CUSTOM_LABEL_MAP_ID);

    const [lastLabel, setLastLabel] = useState<string>('(none yet)');

    const getLabel = (
      pointA: [number, number],
      pointB: [number, number],
    ): string => {
      const label = `${pointA[0].toFixed(3)},${pointA[1].toFixed(3)} → ${pointB[0].toFixed(3)},${pointB[1].toFixed(3)}`;
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

        <ReadoutPanel
          title='Custom Label Format'
          status={isMeasuring ? 'Measuring...' : 'Drag to measure'}
        >
          {isMeasuring && pointA && pointB && (
            <div className='flex flex-col gap-xs'>
              <Readout label='Label (on-canvas)'>
                <code className='break-all text-body-xs'>{lastLabel}</code>
              </Readout>
              <Readout label='Computed distance / bearing'>
                <p className='text-body-xs'>
                  {formatDistance(distanceMeters, DUAL_UNITS)} |{' '}
                  {formatBearing(bearingDeg)}
                </p>
              </Readout>
            </div>
          )}

          <div className='rounded-lg bg-surface-contrast-subtle p-s'>
            <p className='mb-xs font-semibold text-body-xs'>
              getLabel override
            </p>
            <code className='break-all text-body-xs'>
              getLabel=(pointA, pointB) =&gt; `pointA[0].toFixed(3),
              pointA[1].toFixed(3) ...`
            </code>
          </div>
        </ReadoutPanel>
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
