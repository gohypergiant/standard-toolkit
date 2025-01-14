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

import type { StoryObj, Meta } from '@storybook/react';
import { actions } from '../../storybook/actions';
import { TextArea } from './textarea';
import type { TextAreaProps } from './types';

const meta: Meta = {
  title: 'Components/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  args: {
    resize: 'both',
    ...actions<TextAreaProps>(
      'onChange',
      'onHoverChange',
      'onHoverEnd',
      'onHoverStart',
      'onBlur',
      'onFocus',
    ),
  },
  argTypes: {
    disabled: {
      control: {
        type: 'boolean',
      },
    },
    'aria-invalid': {
      control: {
        type: 'select',
      },
      options: ['true', 'false', 'grammar', 'spelling'],
    },
    placeholder: {
      control: {
        type: 'text',
      },
    },
    readOnly: {
      control: {
        type: 'boolean',
      },
    },
    resize: {
      control: {
        type: 'select',
      },
      options: ['both', 'horizontal', 'vertical', 'none'],
    },
  },
};

export default meta;

// TODO: pressing enter and trying to type on a new line is buggy
// this existed in the Uncontrolled example in the ladle version too 😓
export const Default: StoryObj<TextAreaProps> = {};
