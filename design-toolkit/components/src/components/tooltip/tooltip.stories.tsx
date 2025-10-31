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

import { Lasso } from '@accelint/icons';
import { Button } from '../button';
import { Icon } from '../icon';
import { Tooltip } from './';
import { TooltipTrigger } from './trigger';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof Tooltip>; // NOTE: intentional pattern deviation because no `args` in `meta`

export const Default: Story = {
  render: () => (
    <div className='p-m'>
      <TooltipTrigger>
        <span className='fg-primary-bold'>Test</span>
        <Tooltip>My tooltip</Tooltip>
      </TooltipTrigger>
    </div>
  ),
};

export const LongTooltip: Story = {
  render: () => (
    <div className='p-m'>
      <TooltipTrigger>
        <span className='fg-primary-bold'>Long Tooltip</span>
        <Tooltip>A floating label used to explain an element</Tooltip>
      </TooltipTrigger>
    </div>
  ),
};

export const TooltipWithButton: Story = {
  render: () => (
    <div className='p-m'>
      <TooltipTrigger>
        <Button>My Button</Button>
        <Tooltip>My tooltip</Tooltip>
      </TooltipTrigger>
    </div>
  ),
};

export const TooltipWithIcon: Story = {
  render: () => (
    <div className='p-m'>
      <TooltipTrigger>
        <Icon className='fg-primary-bold h-xl w-xl'>
          <Lasso />
        </Icon>
        <Tooltip>Lasso Selection</Tooltip>
      </TooltipTrigger>
    </div>
  ),
};
