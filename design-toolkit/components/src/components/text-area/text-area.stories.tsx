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
import { TextArea } from './index';

const meta: Meta<typeof TextArea> = {
  title: 'Components/TextArea',
  component: TextArea,
  args: {
    className: '',
    cols: 0,
    description: 'Helper text',
    errorMessage: 'Error description',
    isDisabled: false,
    isInvalid: false,
    isReadOnly: false,
    isRequired: true,
    label: 'Label',
    placeholder: 'Placeholder',
    selectOnFocus: false,
    size: 'medium',
  },
  argTypes: {
    className: { type: 'string' },
    size: { options: ['small', 'medium'], control: 'select' },
  },
};

export default meta;

export const Default: StoryObj<typeof TextArea> = {
  render: TextArea,
};
