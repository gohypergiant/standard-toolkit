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
import { darkTokens, lightTokens } from './token-data';

const meta: Meta = {
  title: 'Foundation/Colors',
  tags: ['!autodocs'],
};

export default meta;
type Story = StoryObj;

type ColorInfo = {
  name: string;
  cssvar: string;
  actual?: string;
  bg?: string;
  fg?: string;
};

const BackgroundColorDisplay = (color: ColorInfo) => (
  <div className='flex items-center gap-l' key={color.name}>
    <div className={`h-[90px] w-[120px] rounded-large ${color.name}`} />
    <div className='fg-primary-bold flex flex-col gap-s font-display text-body-xs'>
      <span>var(--{color.name})</span>
      <span>{color.actual}</span>
      <span className='fg-primary-muted'>Figma: {color.name}</span>
    </div>
  </div>
);

const ColorDisplay = (color: ColorInfo) => {
  return (
    <div className='flex items-center gap-l' key={color.name}>
      <div
        className='h-[90px] w-[120px] rounded-large'
        style={{ backgroundColor: color.actual }}
      />
      <div className='fg-primary-bold flex flex-col gap-s font-display text-body-xs'>
        <span>{color.name}</span>
        <span>{color.actual}</span>
        <span className='fg-primary-muted'>Figma: {color.name}</span>
      </div>
    </div>
  );
};

const BorderColorDisplay = (color: ColorInfo) => {
  return (
    <div className='flex items-center gap-l' key={color.name}>
      <div
        className='h-[90px] w-[120px] rounded-large'
        style={{ border: `1px solid ${color.actual}` }}
      />
      <div className='fg-primary-bold flex flex-col gap-s font-display text-body-xs'>
        <span>{color.name}</span>
        <span>{color.actual}</span>
        <span className='fg-primary-muted'>Figma: {color.name}</span>
      </div>
    </div>
  );
};

export const BackgroundDark: Story = {
  globals: { theme: 'dark' },
  render: () => {
    return (
      <div className='flex flex-col gap-xl'>
        <div className='flex flex-col gap-m'>
          <h1 className='fg-primary-bold text-header-xl'>
            Semantic Background (Dark Mode)
          </h1>
          <p className='fg-primary-muted text-body-s'>
            These are tokens primarily used as backgrounds for any element or
            component that contains content such as containers, sections,
            headers, buttons, etc.
          </p>
        </div>
        <div className='grid grid-cols-2 gap-x-l gap-y-xl'>
          {darkTokens.bg.base.map(BackgroundColorDisplay)}
        </div>
        <div className='mt-oversized grid grid-cols-3 gap-x-l gap-y-xl'>
          {darkTokens.bg.utility.map(BackgroundColorDisplay)}
        </div>
      </div>
    );
  },
};

export const BackgroundLight: Story = {
  globals: { theme: 'light' },
  render: () => {
    return (
      <div className='flex flex-col gap-xl'>
        <div className='flex flex-col gap-m'>
          <h1 className='fg-primary-bold text-header-xl'>
            Semantic Background (Light Mode)
          </h1>
          <p className='fg-primary-muted text-body-s'>
            These are tokens primarily used as backgrounds for any element or
            component that contains content such as containers, sections,
            headers, buttons, etc.
          </p>
        </div>
        <div className='grid grid-cols-2 gap-x-l gap-y-xl'>
          {lightTokens.bg.base.map(BackgroundColorDisplay)}
        </div>
        <div className='mt-oversized grid grid-cols-3 gap-x-l gap-y-xl'>
          {lightTokens.bg.utility.map(BackgroundColorDisplay)}
        </div>
      </div>
    );
  },
};

export const ForegroundDark: Story = {
  globals: { theme: 'dark' },
  render: () => {
    return (
      <div className='flex flex-col gap-xl'>
        <div className='flex flex-col gap-m'>
          <h1 className='fg-primary-bold text-header-xl'>
            Semantic Foreground (Dark Mode)
          </h1>
          <p className='fg-primary-muted text-body-s'>
            These are tokens primarily used as fill for elements like text,
            icons, vectors, and other things that sit above a background.
          </p>
        </div>
        <div className='grid grid-cols-2 gap-x-l gap-y-xl'>
          {darkTokens.fg.base.map(ColorDisplay)}
        </div>
        <div className='mt-oversized grid grid-cols-3 gap-x-l gap-y-xl'>
          {darkTokens.fg.utility.map(ColorDisplay)}
        </div>
        <div className='mt-oversized grid grid-cols-3 gap-x-l gap-y-xl'>
          {darkTokens.fg.a11y.map(ColorDisplay)}
        </div>
      </div>
    );
  },
};

export const ForegroundLight: Story = {
  globals: { theme: 'light' },
  render: () => {
    return (
      <div className='flex flex-col gap-xl'>
        <div className='flex flex-col gap-m'>
          <h1 className='fg-primary-bold text-header-xl'>
            Semantic Foreground (Light Mode)
          </h1>
          <p className='fg-primary-muted text-body-s'>
            These are tokens primarily used as fill for elements like text,
            icons, vectors, and other things that sit above a background.
          </p>
        </div>
        <div className='grid grid-cols-2 gap-x-l gap-y-xl'>
          {lightTokens.fg.base.map(ColorDisplay)}
        </div>
        <div className='mt-oversized grid grid-cols-3 gap-x-l gap-y-xl'>
          {lightTokens.fg.utility.map(ColorDisplay)}
        </div>
        <div className='mt-oversized grid grid-cols-3 gap-x-l gap-y-xl'>
          {lightTokens.fg.a11y.map(ColorDisplay)}
        </div>
      </div>
    );
  },
};

export const BorderDark: Story = {
  globals: { theme: 'dark' },
  render: () => {
    return (
      <div className='flex flex-col gap-xl'>
        <div className='flex flex-col gap-m'>
          <h1 className='fg-primary-bold text-header-xl'>
            Semantic Border (Dark)
          </h1>
          <p className='fg-primary-muted text-body-s'>
            These are tokens primarily used as stroke colors for components and
            elements.
          </p>
        </div>
        <div className='grid grid-cols-2 gap-x-l gap-y-xl'>
          {darkTokens.outline.base.map(BorderColorDisplay)}
        </div>
        <div className='mt-oversized grid grid-cols-3 gap-x-l gap-y-xl'>
          {darkTokens.outline.utility.map(BorderColorDisplay)}
        </div>
      </div>
    );
  },
};

export const BorderLight: Story = {
  globals: { theme: 'light' },
  render: () => {
    return (
      <div className='flex flex-col gap-xl'>
        <div className='flex flex-col gap-m'>
          <h1 className='fg-primary-bold text-header-xl'>
            Semantic Border (Light)
          </h1>
          <p className='fg-primary-muted text-body-s'>
            These are tokens primarily used as stroke colors for components and
            elements.
          </p>
        </div>
        <div className='grid grid-cols-2 gap-x-l gap-y-xl'>
          {lightTokens.outline.base.map(BorderColorDisplay)}
        </div>
        <div className='mt-oversized grid grid-cols-3 gap-x-l gap-y-xl'>
          {lightTokens.outline.utility.map(BorderColorDisplay)}
        </div>
      </div>
    );
  },
};
