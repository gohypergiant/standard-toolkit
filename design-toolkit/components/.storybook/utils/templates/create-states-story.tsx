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

interface StateTemplateProps {
  // biome-ignore lint/style/useNamingConvention: Component is a React component
  Component: React.ComponentType<any>;
  baseProps?: Record<string, any>;
  stateProps?: {
    loading?: Record<string, any>;
    error?: Record<string, any>;
    disabled?: Record<string, any>;
    empty?: Record<string, any>;
  };
}

/**
 * Creates a standard "States" story that shows all common component states
 */
export const createStatesStory = ({
  Component,
  baseProps = {},
  stateProps = {},
}: StateTemplateProps): StoryObj<any> => ({
  name: 'States',
  render: () => (
    <div className='flex gap-xl p-l'>
      <div className='space-y-m'>
        <h3 className='fg-primary-bold text-header-s'>Default</h3>
        <Component {...baseProps} />
      </div>

      {stateProps.disabled && (
        <div className='space-y-m'>
          <h3 className='fg-primary-bold text-header-s'>Disabled</h3>
          <Component {...baseProps} {...stateProps.disabled} />
        </div>
      )}

      {stateProps.loading && (
        <div className='space-y-m'>
          <h3 className='fg-primary-bold text-header-s'>Loading</h3>
          <Component {...baseProps} {...stateProps.loading} />
        </div>
      )}

      {stateProps.error && (
        <div className='space-y-m'>
          <h3 className='fg-primary-bold text-header-s'>Error</h3>
          <Component {...baseProps} {...stateProps.error} />
        </div>
      )}

      {stateProps.empty && (
        <div className='space-y-m'>
          <h3 className='fg-primary-bold text-header-s'>Empty</h3>
          <Component {...baseProps} {...stateProps.empty} />
        </div>
      )}
    </div>
  ),
  parameters: {
    layout: 'centered',
    controls: { disable: true },
  },
});
