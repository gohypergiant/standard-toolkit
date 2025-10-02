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

import { Add } from '@accelint/icons';
import { Icon } from '.';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/Icon',
  component: Icon,
  args: {
    className: 'fg-primary-bold',
  },
  argTypes: {
    className: {
      type: 'string',
    },
    size: {
      control: 'select',
      options: ['large', 'medium', 'small', 'xsmall'],
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Icon {...args}>
      <Add />
    </Icon>
  ),
};

export const Provider: Story = {
  render: ({ className, size }) => (
    <Icon.Provider size={size}>
      <div className={className}>
        <Icon>
          <Add />
        </Icon>
        <Icon>
          <Add />
        </Icon>
        <Icon>
          <Add />
        </Icon>
      </div>
    </Icon.Provider>
  ),
};
