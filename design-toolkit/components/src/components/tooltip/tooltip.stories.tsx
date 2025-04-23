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
import { Lasso } from '../../icons/lasso';
import { Button } from '../button';
import { Tooltip } from './';

const meta: Meta<typeof Tooltip> = {
  title: 'Design Toolkit/Components/Tooltip',
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <div className='p-m'>
      <Tooltip>
        <Tooltip.Body>My tooltip</Tooltip.Body>
        <Tooltip.Trigger>
          <span className='text-interactive-default'>Test</span>
        </Tooltip.Trigger>
      </Tooltip>
    </div>
  ),
};

export const LongTooltip: Story = {
  render: () => (
    <div className='p-m'>
      <Tooltip>
        <Tooltip.Trigger>
          <span className='text-interactive-default'>Long Tooltip</span>
        </Tooltip.Trigger>
        <Tooltip.Body>A floating label used to explain an element</Tooltip.Body>
      </Tooltip>
    </div>
  ),
};

export const TooltipWithButton: Story = {
  render: () => (
    <div className='p-m'>
      <Tooltip>
        <Tooltip.Trigger>
          <Button>My Button</Button>
        </Tooltip.Trigger>
        <Tooltip.Body>My tooltip</Tooltip.Body>
      </Tooltip>
    </div>
  ),
};

export const TooltipWithIcon: Story = {
  render: () => (
    <div className='p-m'>
      <Tooltip>
        <Tooltip.Trigger>
          <Lasso className='icon-color-interactive-default icon-size-xl' />
        </Tooltip.Trigger>
        <Tooltip.Body>Lasso Selection</Tooltip.Body>
      </Tooltip>
    </div>
  ),
};
