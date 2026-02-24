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

import { Skeleton } from './';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  args: {
    variant: 'rectangle',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['circle', 'rectangle'],
    },
  },
  parameters: {
    docs: {
      subtitle: 'Placeholder content for loading states',
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  render: (args) => (
    <div className='w-[280px]'>
      <Skeleton {...args} />
    </div>
  ),
};

export const Multiple: StoryObj<typeof meta> = {
  argTypes: {
    variant: {
      control: false,
    },
  },
  render: () => (
    <div className='flex w-[280px] flex-col gap-l'>
      <Skeleton className='h-oversized' />
      <div className='grid grid-cols-[auto_1fr] gap-m'>
        <Skeleton variant='circle' />
        <Skeleton />
        <Skeleton variant='circle' />
        <Skeleton />
        <Skeleton variant='circle' />
        <Skeleton />
        <Skeleton variant='circle' />
        <Skeleton />
      </div>
    </div>
  ),
};
