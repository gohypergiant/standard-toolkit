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

import {
  createStandardParameters,
  STANDARD_ARG_TYPES,
} from '^storybook/utils/controls';
import { createStatesStory } from '^storybook/utils/templates';
import { Radio } from './index';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Radio.Group> = {
  title: 'Components/Radio',
  component: Radio.Group,
  args: {
    orientation: 'vertical',
    isDisabled: false,
    isRequired: false,
    label: 'Choose an option',
  },
  argTypes: {
    orientation: STANDARD_ARG_TYPES.orientation,
    label: STANDARD_ARG_TYPES.label,
    isDisabled: STANDARD_ARG_TYPES.isDisabled,
    isRequired: STANDARD_ARG_TYPES.isRequired,
  },
  parameters: {
    ...createStandardParameters('form'),
    docs: {
      subtitle:
        'A form control for exclusive selection within a group of options',
    },
  },
};

export default meta;

export const Default: StoryObj<typeof Radio.Group> = {
  render: ({ children, label, ...args }) => (
    <Radio.Group label={label} {...args}>
      <Radio value='small'>Small</Radio>
      <Radio value='medium'>Medium</Radio>
      <Radio value='large'>Large</Radio>
    </Radio.Group>
  ),
};

export const States: StoryObj<typeof Radio.Group> = createStatesStory({
  Component: ({ ...props }) => (
    <Radio.Group {...props}>
      <Radio value='option1'>Option 1</Radio>
      <Radio value='option2'>Option 2</Radio>
      <Radio value='option3'>Option 3</Radio>
    </Radio.Group>
  ),
  baseProps: {
    label: 'Select preference',
  },
  stateProps: {
    disabled: { isDisabled: true, label: 'Disabled options' },
  },
});

export const Orientations: StoryObj<typeof Radio.Group> = {
  render: () => (
    <div className='space-y-xl'>
      <div className='space-y-s'>
        <h4 className='fg-primary-bold text-header-s'>Vertical</h4>
        <Radio.Group label='Vertical layout' orientation='vertical'>
          <Radio value='v1'>First option</Radio>
          <Radio value='v2'>Second option</Radio>
          <Radio value='v3'>Third option</Radio>
        </Radio.Group>
      </div>

      <div className='space-y-s'>
        <h4 className='fg-primary-bold text-header-s'>Horizontal</h4>
        <Radio.Group label='Horizontal layout' orientation='horizontal'>
          <Radio value='h1'>Option A</Radio>
          <Radio value='h2'>Option B</Radio>
          <Radio value='h3'>Option C</Radio>
        </Radio.Group>
      </div>
    </div>
  ),
  parameters: {
    layout: 'centered',
    controls: { disable: true },
  },
};
