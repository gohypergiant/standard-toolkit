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
  bg?: string;
  fg?: string;
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
    },
    {
      name: 'interactive-default',
      bg: 'bg-interactive-default',
    },
    {
      name: 'surface-raised',
      bg: 'bg-surface-raised',
    },
    {
      name: 'interactive-hover-light',
      bg: 'bg-interactive-hover-light',
    },
    {
      name: 'surface-overlay',
      bg: 'bg-surface-overlay',
    },
    {
      name: 'interactive-hover-dark',
      bg: 'bg-interactive-hover-dark',
    },
    {
      name: 'transparent-dark',
      bg: 'bg-transparent-dark',
    },
    {
      name: 'interactive-disabled',
      bg: 'bg-interactive-disabled',
    },
    {
      name: 'transparent-light',
      bg: 'bg-transparent-light',
    },
  ],
  semanticBackgroundColor: [
    {
      name: 'highlight-bold',
      bg: 'bg-highlight-bold',
    },
    {
      name: 'highlight-hover',
      bg: 'bg-highlight-hover',
    },
    {
      name: 'highlight-subtle',
      bg: 'bg-highlight-subtle',
    },
    {
      name: 'info-bold',
      bg: 'bg-info-bold',
    },
    {
      name: 'info-hover',
      bg: 'bg-info-hover',
    },
    {
      name: 'info-subtle',
      bg: 'bg-info-subtle',
    },
    {
      name: 'advisory-bold',
      bg: 'bg-advisory-bold',
    },
    {
      name: 'advisory-hover',
      bg: 'bg-advisory-hover',
    },
    {
      name: 'advisory-subtle',
      bg: 'bg-advisory-subtle',
    },
    {
      name: 'normal-bold',
      bg: 'bg-normal-bold',
    },
    {
      name: 'normal-hover',
      bg: 'bg-normal-hover',
    },
    {
      name: 'normal-subtle',
      bg: 'bg-normal-subtle',
    },
    {
      name: 'serious-bold',
      bg: 'bg-serious-bold',
    },
    {
      name: 'serious-hover',
      bg: 'bg-serious-hover',
    },
    {
      name: 'serious-subtle',
      bg: 'bg-serious-subtle',
    },
    {
      name: 'critical-bold',
      bg: 'bg-critical-bold',
    },
    {
      name: 'critical-hover',
      bg: 'bg-critical-hover',
    },
    {
      name: 'critical-subtle',
      bg: 'bg-critical-subtle',
    },
  ],
  semanticForeground: [
    {
      name: 'default-light',
      fg: 'fg-default-light',
      bg: 'bg-default-light',
    },
    {
      name: 'info',
      fg: 'fg-info',
      bg: 'bg-info',
    },
    {
      name: 'default-dark',
      fg: 'fg-default-dark',
      bg: 'bg-default-dark',
    },
    {
      name: 'advisory',
      fg: 'fg-advisory',
      bg: 'bg-advisory',
    },
    {
      name: 'inverse-light',
      fg: 'fg-inverse-light',
      bg: 'bg-inverse-light',
    },
    {
      name: 'normal',
      fg: 'fg-normal',
      bg: 'bg-normal',
    },
    {
      name: 'inverse-dark',
      fg: 'fg-inverse-dark',
      bg: 'bg-inverse-dark',
    },
    {
      name: 'serious',
      fg: 'fg-serious',
      bg: 'bg-serious',
    },
    {
      name: 'disabled',
      fg: 'fg-disabled',
      bg: 'bg-disabled',
    },
    {
      name: 'critical',
      fg: 'fg-critical',
      bg: 'bg-critical',
    },
    {
      name: 'highlight',
      fg: 'fg-highlight',
      bg: 'bg-highlight',
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

const BackgroundColorDisplay = (color: ColorInfo) => {
  const rootElement = document.documentElement;
  return (
    <div className='flex items-center gap-l' key={color.name}>
      <div className={`h-[90px] w-[120px] rounded-large ${color.bg}`} />
      <div className='fg-interactive-default flex flex-col gap-s font-display text-body-xs'>
        <span>{color.bg}</span>
        <span>
          {getComputedStyle(rootElement)
            .getPropertyValue(`--color-${color.name}`)
            .toLocaleUpperCase()}
        </span>
        <span className='fg-default-dark'>Figma: {color.name}</span>
      </div>
    </div>
  );
};

const ForegroundColorDisplay = (color: ColorInfo) => {
  const rootElement = document.documentElement;
  return (
    <div className='flex items-center gap-l' key={color.name}>
      <div className={`h-[90px] w-[120px] rounded-large ${color.bg}`} />
      <div className='fg-interactive-default flex flex-col gap-s font-display text-body-xs'>
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
      <div className='fg-interactive-default flex flex-col gap-s font-display text-body-xs'>
        <span>{border.border}</span>
        <span>
          {getComputedStyle(rootElement)
            .getPropertyValue(`--color-${border.name}`)
            .toLocaleUpperCase()}
        </span>
        <span className='fg-default-dark'>Figma: {border.name}</span>
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
        <h1 className='fg-interactive-default text-header-xl'>
          Semantic Background
        </h1>
        <p className='fg-interactive-hover-light text-body-s'>
          These are tokens primarily used as backgrounds for any element or
          component that contains content such as containers, sections, headers,
          buttons, etc.
        </p>
      </div>
      <div className='grid grid-cols-2 gap-x-l gap-y-xl'>
        {colors.semanticBackgroundBase?.map(BackgroundColorDisplay)}
      </div>
      <div className='mt-oversized grid grid-cols-3 gap-x-l gap-y-xl'>
        {colors.semanticBackgroundColor?.map(BackgroundColorDisplay)}
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
  globals: {
    backgrounds: { value: 'black' },
  },
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
