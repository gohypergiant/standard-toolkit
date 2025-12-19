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

import { clsx } from '@accelint/design-foundation/lib/utils';
import { useEffect, useState } from 'react';
import { tokens } from './token-data';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Foundation/Colors',
  tags: ['!autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function useColorValues(utilityClassGroup: Record<PropertyKey, string[]>) {
  const [colorValues, setColorValues] = useState<Map<string, string>>(
    new Map(),
  );

  useEffect(() => {
    const root = document.documentElement;

    const computeColorValues = () => {
      const newColorValues = new Map<string, string>();
      for (const utilityClass of Object.values(utilityClassGroup).flat()) {
        const computedStyle = getComputedStyle(root)
          .getPropertyValue(`--${utilityClass}`)
          .trim();
        newColorValues.set(utilityClass, computedStyle);
      }
      setColorValues(newColorValues);
    };

    computeColorValues();

    const observer = new MutationObserver(computeColorValues);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ['class', 'style'],
    });

    return () => observer.disconnect();
  }, [utilityClassGroup]);

  return colorValues;
}

const ColorDisplay = ({
  type,
  utilityClass,
  value,
}: {
  type: 'swatch' | 'outline';
  utilityClass: string;
  value?: string;
}) => {
  return (
    <div className='flex items-center gap-l'>
      <div
        className={clsx(
          'h-[90px] w-[120px] rounded-large',
          type === 'outline' && 'outline',
        )}
        style={
          type === 'outline'
            ? { outlineColor: value }
            : { backgroundColor: value }
        }
      />
      <div className='fg-primary-bold flex flex-col gap-s font-display text-body-xs'>
        <span>{utilityClass}</span>
        <span className='fg-primary-muted'>{value}</span>
      </div>
    </div>
  );
};

export const Background: Story = {
  render: (_, { globals }) => {
    const bgColorValues = useColorValues(tokens.bg);
    return (
      <div className='flex flex-col gap-xl'>
        <div className='flex flex-col gap-m'>
          <h1 className='fg-primary-bold text-header-xl'>
            Semantic Background
          </h1>
          <p className='fg-primary-muted text-body-s'>
            These are tokens primarily used as backgrounds for any element or
            component that contains content such as containers, sections,
            headers, buttons, etc.
          </p>
        </div>
        <div className='grid grid-cols-2 gap-x-l gap-y-xl'>
          {tokens.bg.base.map((utilityClass) => (
            <ColorDisplay
              key={`${globals.theme}-${utilityClass}`}
              type='swatch'
              utilityClass={utilityClass}
              value={bgColorValues.get(utilityClass)}
            />
          ))}
        </div>
        <div className='mt-oversized grid grid-cols-4 gap-x-l gap-y-xl'>
          {tokens.bg.utility.map((utilityClass) => (
            <ColorDisplay
              key={`${globals.theme}-${utilityClass}`}
              type='swatch'
              utilityClass={utilityClass}
              value={bgColorValues.get(utilityClass)}
            />
          ))}
        </div>
      </div>
    );
  },
};

export const Foreground: Story = {
  render: (_, { globals }) => {
    const fgColorValues = useColorValues(tokens.fg);
    return (
      <div className='flex flex-col gap-xl'>
        <div className='flex flex-col gap-m'>
          <h1 className='fg-primary-bold text-header-xl'>
            Semantic Foreground
          </h1>
          <p className='fg-primary-muted text-body-s'>
            These are tokens primarily used as fill for elements like text,
            icons, vectors, and other things that sit above a background.
          </p>
        </div>
        <div className='grid grid-cols-2 gap-x-l gap-y-xl'>
          {tokens.fg.base.map((utilityClass) => (
            <ColorDisplay
              key={`${globals.theme}-${utilityClass}`}
              type='swatch'
              utilityClass={utilityClass}
              value={fgColorValues.get(utilityClass)}
            />
          ))}
        </div>
        <div className='mt-oversized grid grid-cols-3 gap-x-l gap-y-xl'>
          {tokens.fg.utility.map((utilityClass) => (
            <ColorDisplay
              key={`${globals.theme}-${utilityClass}`}
              type='swatch'
              utilityClass={utilityClass}
              value={fgColorValues.get(utilityClass)}
            />
          ))}
        </div>
        <div className='mt-oversized grid grid-cols-3 gap-x-l gap-y-xl'>
          {tokens.fg.a11y.map((utilityClass) => (
            <ColorDisplay
              key={`${globals.theme}-${utilityClass}`}
              type='swatch'
              utilityClass={utilityClass}
              value={fgColorValues.get(utilityClass)}
            />
          ))}
        </div>
      </div>
    );
  },
};

export const Outline: Story = {
  render: (_, { globals }) => {
    const outlineColorValues = useColorValues(tokens.outline);
    return (
      <div className='flex flex-col gap-xl'>
        <div className='flex flex-col gap-m'>
          <h1 className='fg-primary-bold text-header-xl'>Semantic Outline</h1>
          <p className='fg-primary-muted text-body-s'>
            These are tokens primarily used as stroke colors for components and
            elements.
          </p>
        </div>
        <div className='grid grid-cols-2 gap-x-l gap-y-xl'>
          {tokens.outline.base.map((utilityClass) => (
            <ColorDisplay
              key={`${globals.theme}-${utilityClass}`}
              type='outline'
              utilityClass={utilityClass}
              value={outlineColorValues.get(utilityClass)}
            />
          ))}
        </div>
        <div className='mt-oversized grid grid-cols-3 gap-x-l gap-y-xl'>
          {tokens.outline.utility.map((utilityClass) => (
            <ColorDisplay
              key={`${globals.theme}-${utilityClass}`}
              type='outline'
              utilityClass={utilityClass}
              value={outlineColorValues.get(utilityClass)}
            />
          ))}
        </div>
      </div>
    );
  },
};
