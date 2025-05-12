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

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Foundation/Elevation',
  tags: ['!autodocs'],
};

export default meta;
type Story = StoryObj;

type ElevationInfo = {
  name: string;
  shadow: string;
};

const elevations: ElevationInfo[] = [
  {
    name: 'shadow-surface-overlay',
    shadow: 'shadow-elevation-overlay',
  },
  {
    name: 'shadow-surface-raised',
    shadow: 'shadow-elevation-raised',
  },
  {
    name: 'shadow-surface-default',
    shadow: 'shadow-elevation-default',
  },
];

const ElevationDisplay = (elevation: ElevationInfo) => (
  <div className='flex items-center gap-l' key={elevation.name}>
    <div
      className={`h-[90px] w-[90px] bg-surface-overlay ${elevation.shadow}`}
    />
    <div className='fg-interactive-default flex flex-col gap-s font-display text-body-xs'>
      <span>{elevation.shadow}</span>
      <span className='text-default-dark'>Figma: {elevation.name}</span>
    </div>
  </div>
);

export const Elevation: Story = {
  globals: { backgrounds: { value: '#222222' } },
  render: () => (
    <div className='flex flex-col gap-xl'>
      <div className='flex flex-col gap-m'>
        <h1 className='fg-interactive-default text-header-xl'>Elevation</h1>
        <p className='fg-interactive-hover-light text-body-s'>
          These are tokens primarily used as backgrounds for any element or
          component that contains content such as containers, sections, headers,
          buttons, etc.
          <br />
          <br />
          <strong>Note: </strong> The class name and Figma names are different
          to avoid color naming conflicts.
        </p>
      </div>
      <div className='flex flex-col gap-y-xxl'>
        {elevations.map(ElevationDisplay)}
      </div>
    </div>
  ),
};
