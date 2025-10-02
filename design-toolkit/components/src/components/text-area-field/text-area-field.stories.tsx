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
  COMMON_CONTROL,
  COMMON_STATE_PROPS,
  createStatesStory,
  EXCLUSIONS,
  hideControls,
  MOCK_DATA,
} from '^storybook/utils';
import { SIZE } from '@/constants/size';
import { TextAreaField } from './';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/TextAreaField',
  component: TextAreaField,
  args: {
    label: 'Description',
    description: 'Provide additional details',
    errorMessage: '',
    size: SIZE.MEDIUM,
    isDisabled: false,
    isInvalid: false,
    isRequired: true,
    inputProps: {
      placeholder: 'Enter your description...',
    },
  },
  argTypes: {
    size: COMMON_CONTROL.size.compact,
    label: COMMON_CONTROL.label,
    description: COMMON_CONTROL.description,
    errorMessage: COMMON_CONTROL.errorMessage,
    isDisabled: COMMON_CONTROL.isDisabled,
    isInvalid: COMMON_CONTROL.isInvalid,
    isRequired: COMMON_CONTROL.isRequired,
  },
  parameters: {
    controls: {
      exclude: [...EXCLUSIONS.COMMON, ...EXCLUSIONS.FORM],
    },
    docs: {
      subtitle: 'A multi-line text input component with label and validation',
    },
  },
} satisfies Meta<typeof TextAreaField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: TextAreaField,
};

export const States: Story = createStatesStory({
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

export const WithContent: Story = {
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
  ...hideControls(meta),
};
