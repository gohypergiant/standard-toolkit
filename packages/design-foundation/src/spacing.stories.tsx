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

const meta = {
  title: 'Foundation/Spacing',
  tags: ['!autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type SpacingInfo = {
  name: string;
  size: string;
};

const spacing: SpacingInfo[] = [
  {
    name: 'spacing/xxs',
    size: 'size-xxs',
  },
  {
    name: 'spacing/xs',
    size: 'size-xs',
  },
  {
    name: 'spacing/s',
    size: 'size-s',
  },
  {
    name: 'spacing/m',
    size: 'size-m',
  },
  {
    name: 'spacing/l',
    size: 'size-l',
  },
  {
    name: 'spacing/xl',
    size: 'size-xl',
  },
  {
    name: 'spacing/xxl',
    size: 'size-xxl',
  },
  {
    name: 'spacing/oversized',
    size: 'size-oversized',
  },
];

const SpacingDisplay = (space: SpacingInfo) => {
  const rootElement = document.documentElement;

  return (
    <div className='flex items-center gap-l' key={space.name}>
      <div
        className={`bg-[#E8178A]/40 outline outline-[#E8178A] ${space.size}`}
      />
      <div className='fg-primary-bold flex flex-col gap-s font-display text-body-xs'>
        <span className='inline-flex gap-s'>
          {space.size}
          <span className='fg-disabled text-body-xxs'>
            (
            {getComputedStyle(rootElement).getPropertyValue(
              `--${space.name.replace('/', '-')}`,
            )}
            )
          </span>
        </span>
        <span className='fg-default-dark'>Figma: {space.name}</span>
      </div>
    </div>
  );
};

export const Spacing: Story = {
  render: () => (
    <div className='flex flex-col gap-xl'>
      <div className='flex flex-col gap-m'>
        <h1 className='fg-primary-bold text-header-xl'>Spacing</h1>
        <p className='fg-primary-muted text-body-s'>
          These are the contextualized spacing values available for use in any
          Figma design file. It can be applied to components/elements as padding
          and/or gap for listing patterns.
          <br />
          <br />
          The following sizes can be used with utility classes such as:{' '}
          <span className='font-display'>
            p-[size], m-[size], gap-[size], h-[size], w-[size]
          </span>
        </p>
      </div>
      <div className='grid grid-cols-2 gap-x-oversized gap-y-xxl'>
        {spacing.map(SpacingDisplay)}
      </div>
    </div>
  ),
};
