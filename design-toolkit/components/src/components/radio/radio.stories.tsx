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
  COMMON_ARG_TYPES,
  createParameters,
  createStatesStory,
} from '^storybook/utils';
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
    orientation: COMMON_ARG_TYPES.orientation,
    label: COMMON_ARG_TYPES.label,
    isDisabled: COMMON_ARG_TYPES.isDisabled,
    isRequired: COMMON_ARG_TYPES.isRequired,
  },
  parameters: {
    ...createParameters('centered'),
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
      <Radio value='h1'>Option A</Radio>
      <Radio value='h2'>Option B</Radio>
      <Radio value='h3'>Option C</Radio>
      <Radio value='h3'>Option D</Radio>
      <Radio value='h3'>Option E</Radio>
      <Radio value='h3'>Option F</Radio>
      <Radio value='h3'>Option G</Radio>
      <Radio value='h3'>Option H</Radio>
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
