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

import type { StoryObj } from '@storybook/react';

/**
 * Template helpers for creating consistent state demonstration stories
 */

export interface StateTemplateProps {
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
        <h3 className='text-header-s fg-primary-bold'>Default</h3>
        <Component {...baseProps} />
      </div>

      {stateProps.disabled && (
        <div className='space-y-m'>
          <h3 className='text-header-s fg-primary-bold'>Disabled</h3>
          <Component {...baseProps} {...stateProps.disabled} />
        </div>
      )}

      {stateProps.loading && (
        <div className='space-y-m'>
          <h3 className='text-header-s fg-primary-bold'>Loading</h3>
          <Component {...baseProps} {...stateProps.loading} />
        </div>
      )}

      {stateProps.error && (
        <div className='space-y-m'>
          <h3 className='text-header-s fg-primary-bold'>Error</h3>
          <Component {...baseProps} {...stateProps.error} />
        </div>
      )}

      {stateProps.empty && (
        <div className='space-y-m'>
          <h3 className='text-header-s fg-primary-bold'>Empty</h3>
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

/**
 * Common state prop configurations for different component types
 */
export const COMMON_STATE_PROPS = {
  FORM_FIELD: {
    disabled: { isDisabled: true },
    error: { isInvalid: true, errorMessage: 'This field is required' },
    loading: { isLoading: true },
  },

  BUTTON: {
    disabled: { isDisabled: true },
    loading: { isLoading: true, children: 'Loading...' },
  },

  DATA_COMPONENT: {
    loading: { isLoading: true },
    error: { error: 'Failed to load data' },
    empty: { data: [] },
  },
};

/**
 * Decorator for stories that need consistent spacing/layout
 */
export const withStoryContainer = (Story: React.ComponentType) => (
  <div className='p-l space-y-m max-w-md'>
    <Story />
  </div>
);

/**
 * Decorator for overlay components (dialogs, tooltips, etc.)
 */
export const withOverlayContainer = (Story: React.ComponentType) => (
  <div className='relative h-[600px] w-[800px] p-l outline outline-1 outline-info-bold'>
    <Story />
  </div>
);
