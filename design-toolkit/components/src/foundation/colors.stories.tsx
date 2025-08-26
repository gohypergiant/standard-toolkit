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
import { useEffect, useState } from 'react';
import { tokens } from './token-data';

const meta: Meta = {
  title: 'Foundation/Colors',
  tags: ['!autodocs'],
};

export default meta;
type Story = StoryObj;

function useColorValue(colorName: string) {
  const [colorValue, setColorValue] = useState<string>('');
  useEffect(
    function deriveColorValue() {
      setTimeout(() => {
        // timeout to defer this to after initial render
        const root = document.querySelector('html') as HTMLHtmlElement;
        const val = getComputedStyle(root).getPropertyValue(`--${colorName}`);
        setColorValue(val);
      }, 1);
    },
    [colorName],
  );
  return colorValue;
}

const BackgroundColorDisplay = (color: string) => {
  const colorValue = useColorValue(color);
  return (
    <div className='flex items-start gap-l' key={color}>
      <div
        className='h-[90px] w-[120px] rounded-large'
        style={{ backgroundColor: colorValue }}
      />
      <div className='fg-primary-bold flex flex-col gap-s py-l font-display text-body-xs'>
        <span>{color}</span>
        <span className='fg-primary-muted'>{colorValue}</span>
      </div>
    </div>
  );
};

const ForegroundColorDisplay = (color: string) => {
  const colorValue = useColorValue(color);
  return (
    <div className='flex items-center gap-l' key={color}>
      <div
        className='h-[90px] w-[120px] rounded-large'
        style={{ backgroundColor: colorValue }}
      />
      <div className='fg-primary-bold flex flex-col gap-s font-display text-body-xs'>
        <span>{color}</span>
        <span className='fg-primary-muted'>{colorValue}</span>
      </div>
    </div>
  );
};

const OutlineColorDisplay = (color: string) => {
  const colorValue = useColorValue(color);
  return (
    <div className='flex items-center gap-l' key={color}>
      <div
        className='h-[90px] w-[120px] rounded-large outline'
        style={{ outlineColor: colorValue }}
      />
      <div className='fg-primary-bold flex flex-col gap-s font-display text-body-xs'>
        <span>{color}</span>
        <span className='fg-primary-muted'>{colorValue}</span>
      </div>
    </div>
  );
};

const BackgroundStoryBase = ({ mode }: { mode: 'Light' | 'Dark' }) => {
  return (
    <div className='flex flex-col gap-xl'>
      <div className='flex flex-col gap-m'>
        <h1 className='fg-primary-bold text-header-xl'>
          Semantic Background ({mode} Mode)
        </h1>
        <p className='fg-primary-muted text-body-s'>
          These are tokens primarily used as backgrounds for any element or
          component that contains content such as containers, sections, headers,
          buttons, etc.
        </p>
      </div>
      <div className='grid grid-cols-2 gap-x-l gap-y-xl'>
        {tokens.bg.base.map(BackgroundColorDisplay)}
      </div>
      <div className='mt-oversized grid grid-cols-3 gap-x-l gap-y-xl'>
        {tokens.bg.utility.map(BackgroundColorDisplay)}
      </div>
    </div>
  );
};
export const BackgroundDark: Story = {
  globals: { theme: 'dark' },
  render: () => <BackgroundStoryBase mode='Dark' />,
};

export const BackgroundLight: Story = {
  globals: { theme: 'light' },
  render: () => <BackgroundStoryBase mode='Light' />,
};

const ForegroundStoryBase = ({ mode }: { mode: 'Light' | 'Dark' }) => {
  return (
    <div className='flex flex-col gap-xl'>
      <div className='flex flex-col gap-m'>
        <h1 className='fg-primary-bold text-header-xl'>
          Semantic Foreground ({mode} Mode)
        </h1>
        <p className='fg-primary-muted text-body-s'>
          These are tokens primarily used as fill for elements like text, icons,
          vectors, and other things that sit above a background.
        </p>
      </div>
      <div className='grid grid-cols-2 gap-x-l gap-y-xl'>
        {tokens.fg.base.map(ForegroundColorDisplay)}
      </div>
      <div className='mt-oversized grid grid-cols-3 gap-x-l gap-y-xl'>
        {tokens.fg.utility.map(ForegroundColorDisplay)}
      </div>
      <div className='mt-oversized grid grid-cols-3 gap-x-l gap-y-xl'>
        {tokens.fg.a11y.map(ForegroundColorDisplay)}
      </div>
    </div>
  );
};
export const ForegroundDark: Story = {
  globals: { theme: 'dark' },
  render: () => <ForegroundStoryBase mode='Dark' />,
};

export const ForegroundLight: Story = {
  globals: { theme: 'light' },
  render: () => <ForegroundStoryBase mode='Light' />,
};

const OutlineStoryBase = ({ mode }: { mode: 'Light' | 'Dark' }) => {
  return (
    <div className='flex flex-col gap-xl'>
      <div className='flex flex-col gap-m'>
        <h1 className='fg-primary-bold text-header-xl'>
          Semantic Outline ({mode} Mode)
        </h1>
        <p className='fg-primary-muted text-body-s'>
          These are tokens primarily used as stroke colors for components and
          elements.
        </p>
      </div>
      <div className='grid grid-cols-2 gap-x-l gap-y-xl'>
        {tokens.outline.base.map(OutlineColorDisplay)}
      </div>
      <div className='mt-oversized grid grid-cols-3 gap-x-l gap-y-xl'>
        {tokens.outline.utility.map(OutlineColorDisplay)}
      </div>
    </div>
  );
};
export const OutlineDark: Story = {
  globals: { theme: 'dark' },
  render: () => <OutlineStoryBase mode='Dark' />,
};

export const OutlineLight: Story = {
  globals: { theme: 'light' },
  render: () => <OutlineStoryBase mode='Light' />,
};
