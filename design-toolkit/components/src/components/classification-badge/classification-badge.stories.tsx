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
import { ClassificationBadge } from './';

const meta: Meta<typeof ClassificationBadge> = {
  title: 'Components/ClassificationBadge',
  component: ClassificationBadge,
  args: {
    className: undefined,
    children: '',
    size: 'medium',
    variant: 'missing',
  },
  argTypes: {
    children: {
      control: 'text',
    },
    variant: {
      control: 'select',
      options: [
        'missing',
        'unclassified',
        'cui',
        'confidential',
        'secret',
        'top-secret',
        'ts-sci',
      ],
    },
    size: {
      control: 'select',
      options: ['medium', 'small'],
    },
  },
};

export default meta;

export const Default: StoryObj<typeof ClassificationBadge> = {
  render: ClassificationBadge,
};
