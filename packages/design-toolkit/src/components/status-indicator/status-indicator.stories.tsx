/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { Label } from 'react-aria-components';
import { StatusIndicator } from '.';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps } from 'react';

type StoryArgs = ComponentProps<typeof StatusIndicator> & {
  label?: string;
};

const meta = {
  title: 'Components/StatusIndicator',
  component: StatusIndicator,
  args: {
    status: 'good',
    label: 'Custom text',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Text to display next to the status indicator',
      table: {
        category: 'Story',
      },
    },
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<StoryArgs>;

export const Default: Story = {
  render: (args) => (
    <div className='flex gap-xl'>
      <div key={args.status} className='flex items-center justify-center gap-s'>
        <StatusIndicator {...args} status={args.status} />
        <Label className='capitalize'>{args.label}</Label>
      </div>
    </div>
  ),
};
