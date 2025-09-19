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
  COMMON_STATE_PROPS,
  createParameters,
  createStatesStory,
  MOCK_DATA,
} from '^storybook/utils';
import Placeholder from '@accelint/icons/placeholder';
import { Icon } from '../icon';
import { Options } from '../options';
import { SelectField } from './index';
import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';

const meta: Meta<typeof SelectField> = {
  title: 'Components/SelectField',
  component: SelectField,
  args: {
    label: 'Select an option',
    description: 'Choose from the available options',
    errorMessage: '',
    size: 'medium',
    isDisabled: false,
    isInvalid: false,
    isRequired: true,
    autoFocus: false,
    placeholder: 'Select...',
    layoutOptions: {
      estimatedRowHeight: 46,
    },
  },
  argTypes: {
    size: COMMON_ARG_TYPES.size.compact,
    label: COMMON_ARG_TYPES.label,
    description: COMMON_ARG_TYPES.description,
    errorMessage: COMMON_ARG_TYPES.errorMessage,
    placeholder: COMMON_ARG_TYPES.placeholder,
    autoFocus: COMMON_ARG_TYPES.autoFocus,
    isDisabled: COMMON_ARG_TYPES.isDisabled,
    isInvalid: COMMON_ARG_TYPES.isInvalid,
    isRequired: COMMON_ARG_TYPES.isRequired,
  },
  parameters: {
    ...createParameters(
      'centered',

      // exclude
      'FORM',
      'isReadOnly',
    ),
    docs: {
      subtitle:
        'A dropdown selection component with comprehensive form field features',
    },
  },
};

export default meta;

export const Default: StoryObj<typeof SelectField> = {
  render: (args) => {
    return (
      <SelectField {...args}>
        <Options.Section header='North American Birds'>
          <Options.Item textValue='Blue Jay'>
            <Icon>
              <Placeholder />
            </Icon>
            <Options.Item.Label>Blue Jay</Options.Item.Label>
          </Options.Item>
          <Options.Item textValue='Gray catbird'>
            <Icon>
              <Placeholder />
            </Icon>
            <Options.Item.Label>Gray catbird</Options.Item.Label>
          </Options.Item>
          <Options.Item textValue='Black-capped chickadee'>
            <Icon>
              <Placeholder />
            </Icon>
            <Options.Item.Label>Black-capped chickadee</Options.Item.Label>
          </Options.Item>
          <Options.Item textValue='Song Sparrow'>
            <Icon>
              <Placeholder />
            </Icon>
            <Options.Item.Label>Song Sparrow</Options.Item.Label>
          </Options.Item>
        </Options.Section>
        <Options.Section header='African Birds'>
          <Options.Item textValue='Lilac-breasted roller'>
            <Icon>
              <Placeholder />
            </Icon>
            <Options.Item.Label>Lilac-breasted roller</Options.Item.Label>
          </Options.Item>
          <Options.Item textValue='Hornbill'>
            <Icon>
              <Placeholder />
            </Icon>
            <Options.Item.Label>Hornbill</Options.Item.Label>
          </Options.Item>
        </Options.Section>
      </SelectField>
    );
  },
};

export const States: StoryObj<typeof SelectField> = createStatesStory({
  Component: ({ children, ...props }) => (
    <SelectField {...props}>
      {MOCK_DATA.SIMPLE_OPTIONS.map((option) => (
        <Options.Item key={option.id} textValue={option.name}>
          <Options.Item.Label>{option.name}</Options.Item.Label>
        </Options.Item>
      ))}
    </SelectField>
  ),
  baseProps: {
    label: 'Category',
    placeholder: 'Select a category',
  },
  stateProps: {
    ...COMMON_STATE_PROPS.FORM_FIELD,
    error: {
      isInvalid: true,
      errorMessage: MOCK_DATA.ERROR_MESSAGES.REQUIRED,
    },
  },
});

const manyItems: { id: number; name: string; prefixIcon: ReactNode }[] = [];
for (let i = 0; i < 5000; i++) {
  manyItems.push({ id: i, name: `Item ${i}`, prefixIcon: <Placeholder /> });
}

export const WithManyItems: StoryObj<typeof SelectField> = {
  render: (args) => (
    <SelectField {...args}>
      {manyItems.map((item) => (
        <Options.Item key={item.id} textValue={item.name}>
          {item.prefixIcon && <Icon>{item.prefixIcon}</Icon>}
          <Options.Item.Label>{item.name}</Options.Item.Label>
        </Options.Item>
      ))}
    </SelectField>
  ),
};
