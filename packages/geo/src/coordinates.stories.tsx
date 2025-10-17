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

import { coordinateSystems, createCoordinate } from '.';
import type { Meta, StoryObj } from '@storybook/react';
import type { PropsWithChildren } from 'react';

type Coordinate = Readonly<ReturnType<ReturnType<typeof createCoordinate>>>;

interface Props {
  input: string;
  system: keyof typeof SYSTEM;
}

/**
 * Verified coordinate test data from authoritative sources.
 */
const VERIFIED_COORDINATES = [
  {
    name: 'Statue of Liberty, New York',
    lat: 40.6892,
    lon: -74.0445,
    mgrs: '18TWL 80744 06483',
    utm: '18T 580744 4506483',
  },
  {
    name: 'Eiffel Tower, Paris',
    lat: 48.8584,
    lon: 2.2945,
    mgrs: '31UDQ 48251 11961',
    utm: '31U 448251 5411961',
  },
  {
    name: 'Sydney Opera House, Australia',
    lat: -33.8568,
    lon: 151.2153,
    mgrs: '56HLH 34885 2717',
    utm: '56H 334885 6252717',
  },
];

const SYSTEM = {
  dd: {
    label: 'Decimal Degrees (DD)',
    parse: createCoordinate(coordinateSystems.dd),
  },

  ddm: {
    label: 'Decimal Degrees Minutes (DDM)',
    parse: createCoordinate(coordinateSystems.ddm),
  },

  dms: {
    label: 'Decimal Minutes Seconds (DMS)',
    parse: createCoordinate(coordinateSystems.dms),
  },

  mgrs: {
    label: 'Military Grid Reference System (MGRS)',
    parse: createCoordinate(coordinateSystems.mgrs),
  },

  utm: {
    label: 'Universal Transverse Mercator (UTM)',
    parse: createCoordinate(coordinateSystems.utm),
  },
} as const satisfies Record<
  keyof typeof coordinateSystems,
  // biome-ignore lint/suspicious/noExplicitAny: simple utility abstraction
  { label: string; parse: (...args: any[]) => any }
>;

const Coord = ({ children, label }: { label: string } & PropsWithChildren) => (
  <div
    key={label}
    style={{
      borderBottom: '1px solid white',
      display: 'flex',
      justifyContent: 'space-between',
      padding: '1ex 0',
    }}
  >
    <strong>{label}</strong>
    <span>{children}</span>
  </div>
);

const RenderFn = ({ input, system }: Props) => {
  const result: Coordinate = SYSTEM[system].parse(input);

  return (
    <div
      style={{
        fontFamily: 'monospace',
        display: 'grid',
        gap: '2em',
        gridTemplateColumns: '6fr 4fr',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ overflow: 'auto' }}>
        <h2>Browser Test</h2>

        <p>
          There is no UI to this (@accelint/geo) package. This page is only to
          fully test that this package works in a browser context and not only
          in Node.js.
        </p>

        {result.errors.length ? (
          <pre
            style={{
              background: 'FireBrick',
              color: 'white',
              overflow: 'auto',
              padding: '1ex 3ex',
            }}
          >
            {JSON.stringify(result.errors, null, 4)}
          </pre>
        ) : (
          (
            Object.keys(coordinateSystems) as Array<
              keyof typeof coordinateSystems
            >
          ).map((key) => (
            <Coord key={key} label={SYSTEM[key].label}>
              {result[key]?.() ?? 'Not implemented.'}
            </Coord>
          ))
        )}
      </div>

      <div
        style={{
          background: 'gainsboro',
          borderRadius: '15px',
          padding: '2em',
        }}
      >
        <h3 style={{ margin: '0', padding: '0' }}>
          Verified Test Coordinates:
        </h3>

        <p>
          These coordinates represent real-world locations with verified values
          in multiple formats
        </p>

        <div>
          {VERIFIED_COORDINATES.map((coord) => (
            <div key={coord.name}>
              <h4>{coord.name}</h4>

              <Coord label='Lat/Lon'>
                {coord.lat}, {coord.lon}
              </Coord>

              <Coord label='MGRS'>{coord.mgrs}</Coord>

              <Coord label='UTM'>{coord.utm}</Coord>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const meta: Meta<typeof RenderFn> = {
  title: 'Browser Compatibility',
  component: RenderFn,
  args: {
    input: `${VERIFIED_COORDINATES[0]?.lat}, ${VERIFIED_COORDINATES[0]?.lon}`,
    system: 'dd',
  },
  argTypes: {
    system: {
      options: Object.keys(SYSTEM),
      control: { type: 'radio' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
