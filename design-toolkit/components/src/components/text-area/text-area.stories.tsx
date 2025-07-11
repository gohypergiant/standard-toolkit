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

import type { Meta, StoryObj } from '@storybook/react';
import { TextAreaField } from './index';

const meta: Meta<typeof TextAreaField> = {
  title: 'Components/TextArea',
  component: TextAreaField,
  args: {
    description: 'Helper text',
    errorMessage: 'Error description',
    label: 'Label',
    placeholder: 'Placeholder',
    isDisabled: false,
    isInvalid: false,
    isReadOnly: false,
    isRequired: true,

    size: 'medium',
  },
  argTypes: {
    size: { options: ['small', 'medium'], control: 'select' },
    isInvalid: { control: 'boolean' },
  },
};

export default meta;

export const Default: StoryObj<typeof TextAreaField> = {
  render: TextAreaField,
};
