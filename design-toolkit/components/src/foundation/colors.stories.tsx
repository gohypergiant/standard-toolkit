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

import { useEffect, useState } from 'react';
import { tokens } from './token-data';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Foundation/Colors',
  tags: ['!autodocs'],
};

export default meta;
type Story = StoryObj;

function useColorValue(color: string) {
  const [colorValue, setColorValue] = useState<string>('');
  useEffect(
    function deriveColorValue() {
      setTimeout(() => {
        // timeout to defer this to after initial render
        const root = document.querySelector('html') as HTMLHtmlElement;
        const val = getComputedStyle(root).getPropertyValue(`--${color}`);
        setColorValue(val);
      }, 1);
    },
    [color],
  );
  return colorValue;
}

const BackgroundColorDisplay = ({ color }: { color: string }) => {
  const colorValue = useColorValue(color);
  return (
    <div className='flex items-start gap-l'>
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

const ForegroundColorDisplay = ({ color }: { color: string }) => {
  const colorValue = useColorValue(color);
  return (
    <div className='flex items-center gap-l'>
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

const OutlineColorDisplay = ({ color }: { color: string }) => {
  const colorValue = useColorValue(color);
  return (
    <div className='flex items-center gap-l'>
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

export const Background: Story = {
  render: (_, { globals }) => (
    <div className='flex flex-col gap-xl'>
      <div className='flex flex-col gap-m'>
        <h1 className='fg-primary-bold text-header-xl'>Semantic Background</h1>
        <p className='fg-primary-muted text-body-s'>
          These are tokens primarily used as backgrounds for any element or
          component that contains content such as containers, sections, headers,
          buttons, etc.
        </p>
      </div>
      <div className='grid grid-cols-2 gap-x-l gap-y-xl'>
        {tokens.bg.base.map((color) => (
          <BackgroundColorDisplay
            key={`${globals.theme}-${color}`}
            color={color}
          />
        ))}
      </div>
      <div className='mt-oversized grid grid-cols-3 gap-x-l gap-y-xl'>
        {tokens.bg.utility.map((color) => (
          <BackgroundColorDisplay
            key={`${globals.theme}-${color}`}
            color={color}
          />
        ))}
      </div>
    </div>
  ),
};

export const Foreground: Story = {
  render: (_, { globals }) => (
    <div className='flex flex-col gap-xl'>
      <div className='flex flex-col gap-m'>
        <h1 className='fg-primary-bold text-header-xl'>Semantic Foreground</h1>
        <p className='fg-primary-muted text-body-s'>
          These are tokens primarily used as fill for elements like text, icons,
          vectors, and other things that sit above a background.
        </p>
      </div>
      <div className='grid grid-cols-2 gap-x-l gap-y-xl'>
        {tokens.fg.base.map((color) => (
          <ForegroundColorDisplay
            key={`${globals.theme}-${color}`}
            color={color}
          />
        ))}
      </div>
      <div className='mt-oversized grid grid-cols-3 gap-x-l gap-y-xl'>
        {tokens.fg.utility.map((color) => (
          <ForegroundColorDisplay
            key={`${globals.theme}-${color}`}
            color={color}
          />
        ))}
      </div>
      <div className='mt-oversized grid grid-cols-3 gap-x-l gap-y-xl'>
        {tokens.fg.a11y.map((color) => (
          <ForegroundColorDisplay
            key={`${globals.theme}-${color}`}
            color={color}
          />
        ))}
      </div>
    </div>
  ),
};

export const Outline: Story = {
  render: (_, { globals }) => (
    <div className='flex flex-col gap-xl'>
      <div className='flex flex-col gap-m'>
        <h1 className='fg-primary-bold text-header-xl'>Semantic Outline</h1>
        <p className='fg-primary-muted text-body-s'>
          These are tokens primarily used as stroke colors for components and
          elements.
        </p>
      </div>
      <div className='grid grid-cols-2 gap-x-l gap-y-xl'>
        {tokens.outline.base.map((color) => (
          <OutlineColorDisplay
            key={`${globals.theme}-${color}`}
            color={color}
          />
        ))}
      </div>
      <div className='mt-oversized grid grid-cols-3 gap-x-l gap-y-xl'>
        {tokens.outline.utility.map((color) => (
          <OutlineColorDisplay
            key={`${globals.theme}-${color}`}
            color={color}
          />
        ))}
      </div>
    </div>
  ),
};
