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
  title: 'Foundation/Colors',
};

export default meta;
type Story = StoryObj;

type ColorInfo = {
  name: string;
  bg: string;
  fg: string;
};

type BorderInfo = {
  name: string;
  border: string;
};

const colors: Record<string, ColorInfo[]> = {
  semanticBackgroundBase: [
    {
      name: 'surface-default',
      bg: 'bg-surface-default',
      fg: 'text-surface-default',
    },
    {
      name: 'interactive-default',
      bg: 'bg-interactive-default',
      fg: 'text-interactive-default',
    },
    {
      name: 'surface-raised',
      bg: 'bg-surface-raised',
      fg: 'text-surface-raised',
    },
    {
      name: 'interactive-hover-light',
      bg: 'bg-interactive-hover-light',
      fg: 'text-interactive-hover-light',
    },
    {
      name: 'surface-overlay',
      bg: 'bg-surface-overlay',
      fg: 'text-surface-overlay',
    },
    {
      name: 'interactive-hover-dark',
      bg: 'bg-interactive-hover-dark',
      fg: 'text-interactive-hover-dark',
    },
    {
      name: 'transparent-dark',
      bg: 'bg-transparent-dark',
      fg: 'text-transparent-dark',
    },
    {
      name: 'interactive-disabled',
      bg: 'bg-interactive-disabled',
      fg: 'text-interactive-disabled',
    },
    {
      name: 'transparent-light',
      bg: 'bg-transparent-light',
      fg: 'text-transparent-light',
    },
  ],
  semanticBackgroundColor: [
    {
      name: 'highlight-bold',
      bg: 'bg-highlight-bold',
      fg: 'text-highlight-bold',
    },
    {
      name: 'highlight-hover',
      bg: 'bg-highlight-hover',
      fg: 'text-highlight-hover',
    },
    {
      name: 'highlight-subtle',
      bg: 'bg-highlight-subtle',
      fg: 'text-highlight-subtle',
    },
    {
      name: 'info-bold',
      bg: 'bg-info-bold',
      fg: 'text-info-bold',
    },
    {
      name: 'info-hover',
      bg: 'bg-info-hover',
      fg: 'text-info-hover',
    },
    {
      name: 'info-subtle',
      bg: 'bg-info-subtle',
      fg: 'text-info-subtle',
    },
    {
      name: 'advisory-bold',
      bg: 'bg-advisory-bold',
      fg: 'text-advisory-bold',
    },
    {
      name: 'advisory-hover',
      bg: 'bg-advisory-hover',
      fg: 'text-advisory-hover',
    },
    {
      name: 'advisory-subtle',
      bg: 'bg-advisory-subtle',
      fg: 'text-advisory-subtle',
    },
    {
      name: 'normal-bold',
      bg: 'bg-normal-bold',
      fg: 'text-normal-bold',
    },
    {
      name: 'normal-hover',
      bg: 'bg-normal-hover',
      fg: 'text-normal-hover',
    },
    {
      name: 'normal-subtle',
      bg: 'bg-normal-subtle',
      fg: 'text-normal-subtle',
    },
    {
      name: 'serious-bold',
      bg: 'bg-serious-bold',
      fg: 'text-serious-bold',
    },
    {
      name: 'serious-hover',
      bg: 'bg-serious-hover',
      fg: 'text-serious-hover',
    },
    {
      name: 'serious-subtle',
      bg: 'bg-serious-subtle',
      fg: 'text-serious-subtle',
    },
    {
      name: 'critical-bold',
      bg: 'bg-critical-bold',
      fg: 'text-critical-bold',
    },
    {
      name: 'critical-hover',
      bg: 'bg-critical-hover',
      fg: 'text-critical-hover',
    },
    {
      name: 'critical-subtle',
      bg: 'bg-critical-subtle',
      fg: 'text-critical-subtle',
    },
  ],
  semanticForeground: [
    {
      name: 'default-light',
      bg: 'bg-default-light',
      fg: 'text-default-light',
    },
    {
      name: 'info',
      bg: 'bg-info',
      fg: 'text-info',
    },
    {
      name: 'default-dark',
      bg: 'bg-default-dark',
      fg: 'text-default-dark',
    },
    {
      name: 'advisory',
      bg: 'bg-advisory',
      fg: 'text-advisory',
    },
    {
      name: 'inverse-light',
      bg: 'bg-inverse-light',
      fg: 'text-inverse-light',
    },
    {
      name: 'normal',
      bg: 'bg-normal',
      fg: 'text-normal',
    },
    {
      name: 'inverse-dark',
      bg: 'bg-inverse-dark',
      fg: 'text-inverse-dark',
    },
    {
      name: 'serious',
      bg: 'bg-serious',
      fg: 'text-serious',
    },
    {
      name: 'disabled',
      bg: 'bg-disabled',
      fg: 'text-disabled',
    },
    {
      name: 'critical',
      bg: 'bg-critical',
      fg: 'text-critical',
    },
    {
      name: 'highlight',
      bg: 'bg-highlight',
      fg: 'text-highlight',
    },
  ],
};

const borders: Record<string, BorderInfo[]> = {
  semanticBorder: [
    {
      name: 'static-light',
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
      border: 'border-interactive-default',
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

const ColorDisplay = (color: ColorInfo) => {
  const rootElement = document.documentElement;
  return (
    <div className='flex items-center gap-l' key={color.name}>
      <div className={`h-[90px] w-[120px] rounded-large ${color.bg}`} />
      <div className='flex flex-col gap-s font-display text-body-xs text-interactive-default'>
        <span>{color.bg}</span>
        <span>{color.fg}</span>
        <span>
          {getComputedStyle(rootElement)
            .getPropertyValue(`--color-${color.name}`)
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
      <div className='flex flex-col gap-s font-display text-body-xs text-interactive-default'>
        <span>{border.border}</span>
        <span>
          {getComputedStyle(rootElement)
            .getPropertyValue(`--color-${border.name}`)
            .toLocaleUpperCase()}
        </span>
        <span className='text-default-dark'>Figma: {border.name}</span>
      </div>
    </div>
  );
};

export const SemanticBackground: Story = {
  globals: {
    backgrounds: { value: 'black' },
  },
  render: () => (
    <div className='flex flex-col gap-xl'>
      <div className='flex flex-col gap-m'>
        <h1 className='text-header-xl text-interactive-default'>
          Semantic Background
        </h1>
        <p className='text-body-s text-interactive-hover-light'>
          These are tokens primarily used as backgrounds for any element or
          component that contains content such as containers, sections, headers,
          buttons, etc.
        </p>
      </div>
      <div className='grid grid-cols-2 gap-x-l gap-y-xl'>
        {colors.semanticBackgroundBase?.map(ColorDisplay)}
      </div>
      <div className='mt-oversized grid grid-cols-3 gap-x-l gap-y-xl'>
        {colors.semanticBackgroundColor?.map(ColorDisplay)}
      </div>
    </div>
  ),
};

export const SemanticForeground: Story = {
  globals: {
    backgrounds: { value: 'black' },
  },
  render: () => (
    <div className='flex flex-col gap-xl'>
      <div className='flex flex-col gap-m'>
        <h1 className='text-header-xl text-interactive-default'>
          Semantic Foreground
        </h1>
        <p className='text-body-s text-interactive-hover-light'>
          These are tokens primarily used as fill for elements like text, icons,
          vectors, and other things that sit above a background.
        </p>
      </div>
      <div className='grid grid-cols-2 gap-x-l gap-y-xl'>
        {colors.semanticForeground?.map(ColorDisplay)}
      </div>
    </div>
  ),
};

export const SemanticBorder: Story = {
  globals: {
    backgrounds: { value: 'black' },
  },
  render: () => (
    <div className='flex flex-col gap-xl'>
      <div className='flex flex-col gap-m'>
        <h1 className='text-header-xl text-interactive-default'>
          Semantic Border
        </h1>
        <p className='text-body-s text-interactive-hover-light'>
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
