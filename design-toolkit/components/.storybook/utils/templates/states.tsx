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
import type { StateTemplateProps } from './types';

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
    loading: { isPending: true, children: 'Loading...' },
  },

  DATA_COMPONENT: {
    loading: { isLoading: true },
    error: { error: 'Failed to load data' },
    empty: { data: [] },
  },
};
