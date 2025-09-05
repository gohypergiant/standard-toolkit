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
  title: 'Foundation/Radius',
  tags: ['!autodocs'],
};

export default meta;
type Story = StoryObj;

const radiiVariants: string[] = ['none', 'small', 'medium', 'large', 'round'];

const RadiusDisplay = (radiusVariant: string) => {
  const { documentElement } = document;
  const radiusClassName = `rounded-${radiusVariant}`;
  const radiusPropertyValue = getComputedStyle(
    documentElement,
  ).getPropertyValue(`--radius-${radiusVariant}`);

  return (
    <div className='flex items-center gap-l' key={radiusVariant}>
      <div
        className='block h-[40px] w-[80px] outline outline-interactive-hover'
        style={{ borderRadius: radiusPropertyValue }}
      />
      <div className='fg-primary-bold flex flex-col gap-s font-display text-body-xs'>
        <span className='inline-flex gap-s'>
          {radiusClassName}
          <span className='fg-disabled text-body-xxs'>
            ({radiusPropertyValue})
          </span>
        </span>
        <span className='fg-default-dark'>Figma: {radiusClassName}</span>
      </div>
    </div>
  );
};

export const Radius: Story = {
  render: () => (
    <div className='flex flex-col gap-xl'>
      <div className='flex flex-col gap-m'>
        <h1 className='fg-primary-bold text-header-xl'>Radius</h1>
        <p className='fg-primary-muted text-body-s'>
          These are the contextualized spacing values available for use in any
          Figma design file. It can be applied to components/elements as padding
          and/or gap for listing patterns.
        </p>
      </div>
      <div className='flex flex-col gap-y-xxl'>
        {radiiVariants.map(RadiusDisplay)}
      </div>
    </div>
  ),
};
