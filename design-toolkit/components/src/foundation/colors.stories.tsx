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

type BorderInfo = {
  name: string;
  border: string;
};

const borders: Record<string, BorderInfo[]> = {
  semanticBorder: [
    {
      name: 'border-static-light',
      border: 'border-static-light',
    },
    {
      name: 'info',
      border: 'border-info',
    },
    {
      name: 'static-dark',
      border: 'border-static-dark',
    },
    {
      name: 'advisory',
      border: 'border-advisory',
    },
    {
      name: 'interactive-default',
      border: 'border-interactive',
    },
    {
      name: 'normal',
      border: 'border-normal',
    },
    {
      name: 'interactive-hover',
      border: 'border-interactive-hover',
    },
    {
      name: 'serious',
      border: 'border-serious',
    },
    {
      name: 'interactive-disabled',
      border: 'border-interactive-disabled',
    },
    {
      name: 'critical',
      border: 'border-critical',
    },
    {
      name: 'highlight',
      border: 'border-highlight',
    },
  ],
};

const BackgroundColorDisplay = (color: ColorInfo) => (
  <div className='flex items-center gap-l' key={color.name}>
    <div className={`h-[90px] w-[120px] rounded-large ${color.name}`} />
    <div className='fg-interactive-default flex flex-col gap-s font-display text-body-xs'>
      <span>var(--{color.name})</span>
      <span>{color.actual}</span>
      <span className='fg-default-dark'>Figma: {color.name}</span>
    </div>
  </div>
);

const ForegroundColorDisplay = (color: ColorInfo) => {
  const rootElement = document.documentElement;
  return (
    <div className='flex items-center gap-l' key={color.name}>
      <div className={`h-[90px] w-[120px] rounded-large ${color.bg}`} />
      <div className='fg-interactive-default flex flex-col gap-s font-display text-body-xs'>
        <span>{color.fg}</span>
        <span>
          {getComputedStyle(rootElement)
            .getPropertyValue(`--color-${color.name.replace('fg-', '')}`)
            .toLocaleUpperCase()}
        </span>
        <span className='text-default-dark'>Figma: {color.name}</span>
      </div>
    </div>
  );
};

const BorderDisplay = (border: BorderInfo) => {
  const rootElement = document.documentElement;
  return (
    <div className='flex items-center gap-l' key={border.name}>
      <div
        className={`h-[90px] w-[120px] rounded-large border ${border.border}`}
      />
      <div className='fg-interactive-default flex flex-col gap-s font-display text-body-xs'>
        <span>{border.border}</span>
        <span>
          {getComputedStyle(rootElement)
            .getPropertyValue(`--color-${border.name.replace('border-', '')}`)
            .toLocaleUpperCase()}
        </span>
        <span className='fg-default-dark'>Figma: {border.name}</span>
      </div>
    </div>
  );
};

export const BackgroundDark: Story = {
  globals: { backgrounds: { value: '#000000' } },
  render: () => {
    return (
      <div className='flex flex-col gap-xl'>
        <div className='flex flex-col gap-m'>
          <h1 className='fg-interactive-default text-header-xl'>
            Semantic Background
          </h1>
          <p className='fg-interactive-hover-light text-body-s'>
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
  globals: { backgrounds: { value: '#FFFFFF' } },
  render: () => {
    return (
      <div className='flex flex-col gap-xl'>
        <div className='flex flex-col gap-m'>
          <h1 className='fg-interactive-default text-header-xl'>
            Semantic Background
          </h1>
          <p className='fg-interactive-hover-light text-body-s'>
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

export const SemanticForeground: Story = {
  globals: { backgrounds: { value: '#000000' } },
  render: () => (
    <div className='flex flex-col gap-xl'>
      <div className='flex flex-col gap-m'>
        <h1 className='fg-interactive-default text-header-xl'>
          Semantic Foreground
        </h1>
        <p className='fg-interactive-hover-light text-body-s'>
          These are tokens primarily used as fill for elements like text, icons,
          vectors, and other things that sit above a background.
        </p>
      </div>
      <div className='grid grid-cols-2 gap-x-l gap-y-xl'>
        {colors.semanticForeground?.map(ForegroundColorDisplay)}
      </div>
    </div>
  ),
};

export const SemanticBorder: Story = {
  globals: { backgrounds: { value: '#000000' } },
  render: () => (
    <div className='flex flex-col gap-xl'>
      <div className='flex flex-col gap-m'>
        <h1 className='fg-interactive-default text-header-xl'>
          Semantic Border
        </h1>
        <p className='fg-interactive-hover-light text-body-s'>
          These are tokens primarily used as stroke colors for components and
          elements.
        </p>
      </div>
      <div className='grid grid-cols-2 gap-x-oversized gap-y-xxl'>
        {borders.semanticBorder?.map(BorderDisplay)}
      </div>
    </div>
  ),
};
