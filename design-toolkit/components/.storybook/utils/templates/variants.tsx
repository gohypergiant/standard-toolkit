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

/** biome-ignore-all lint/suspicious/noExplicitAny: `any` is necessary in these cases */

import type { StoryObj } from '@storybook/react';

/**
 * Creates a comprehensive variants showcase story
 */
export const createVariantsStory = <T extends Record<string, any>>({
  Component,
  variantProps,
  baseProps = {},
  columns = 3,
}: {
  // biome-ignore lint/style/useNamingConvention: Component is a React component
  Component: React.ComponentType<any>;
  variantProps: Record<string, T>;
  baseProps?: Record<string, any>;
  columns?: number;
}): StoryObj<any> => ({
  name: 'All Variants',
  render: () => (
    <div
      className={'grid gap-xl'}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {Object.entries(variantProps).map(([name, props]) => (
        <div key={name} className='space-y-s'>
          <h4 className='fg-primary-bold text-header-s capitalize'>{name}</h4>
          <Component {...baseProps} {...props} />
        </div>
      ))}
    </div>
  ),
  parameters: {
    layout: 'centered',
    controls: { disable: true },
  },
});

/**
 * Creates a size variants story for components with size props
 */
export const createSizeVariantsStory = ({
  Component,
  sizes,
  baseProps = {},
  variantProp = 'size',
}: {
  // biome-ignore lint/style/useNamingConvention: Component is a React component
  Component: React.ComponentType<any>;
  sizes: readonly string[];
  baseProps?: Record<string, any>;
  variantProp?: string;
}): StoryObj<any> => ({
  name: 'All Sizes',
  render: () => (
    <div className='flex items-end gap-xl'>
      {sizes.map((size) => (
        <div key={size} className='space-y-s text-center'>
          <Component {...baseProps} {...{ [variantProp]: size }} />
          <span className='fg-secondary text-body-s capitalize'>{size}</span>
        </div>
      ))}
    </div>
  ),
  parameters: {
    layout: 'centered',
    controls: { disable: true },
  },
});
