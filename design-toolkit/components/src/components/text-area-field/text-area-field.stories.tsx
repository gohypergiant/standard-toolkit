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

import { MOCK_DATA } from '^storybook/mock-data';
import {
  createSizeControl,
  createStandardParameters,
  STANDARD_ARG_TYPES,
} from '^storybook/shared-controls';
import {
  COMMON_STATE_PROPS,
  createStatesStory,
} from '^storybook/story-templates';
import { TextAreaField } from './';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof TextAreaField> = {
  title: 'Components/TextAreaField',
  component: TextAreaField,
  args: {
    label: 'Description',
    description: 'Provide additional details',
    errorMessage: '',
    size: 'medium',
    isDisabled: false,
    isInvalid: false,
    isRequired: true,
    inputProps: {
      placeholder: 'Enter your description...',
    },
  },
  argTypes: {
    size: createSizeControl('COMPACT'),
    label: STANDARD_ARG_TYPES.label,
    description: STANDARD_ARG_TYPES.description,
    errorMessage: STANDARD_ARG_TYPES.errorMessage,
    isDisabled: {
      control: { type: 'boolean' },
      table: { type: { summary: 'boolean' } },
    },
    isInvalid: {
      control: { type: 'boolean' },
      table: { type: { summary: 'boolean' } },
    },
    isRequired: {
      control: { type: 'boolean' },
      table: { type: { summary: 'boolean' } },
    },
  },
  parameters: {
    ...createStandardParameters('form'),
    docs: {
      subtitle: 'A multi-line text input component with label and validation',
    },
  },
};

export default meta;

export const Default: StoryObj<typeof TextAreaField> = {
  render: (args) => <TextAreaField {...args} />,
};

export const States: StoryObj<typeof TextAreaField> = createStatesStory({
  Component: TextAreaField,
  baseProps: {
    label: 'Feedback',
    inputProps: { placeholder: 'Share your thoughts...' },
  },
  stateProps: {
    ...COMMON_STATE_PROPS.FORM_FIELD,
    error: {
      isInvalid: true,
      errorMessage: MOCK_DATA.ERROR_MESSAGES.REQUIRED,
    },
  },
});

export const WithContent: StoryObj<typeof TextAreaField> = {
  name: 'With Sample Content',
  render: (args) => (
    <div className='max-w-lg space-y-l'>
      <TextAreaField
        {...args}
        label='Short response'
        inputProps={{
          placeholder: 'Brief description...',
          rows: 3,
          defaultValue: MOCK_DATA.TEXT_CONTENT.SHORT,
        }}
      />
      <TextAreaField
        {...args}
        label='Detailed response'
        inputProps={{
          placeholder: 'Detailed explanation...',
          rows: 6,
          defaultValue: MOCK_DATA.TEXT_CONTENT.MEDIUM,
        }}
      />
    </div>
  ),
  parameters: {
    layout: 'centered',
    controls: { disable: true },
  },
};
