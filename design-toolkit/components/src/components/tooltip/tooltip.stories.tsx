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

import { createParameters, MOCK_DATA } from '^storybook/utils';
import { Lasso } from '@accelint/icons';
import { Button } from '../button';
import { Icon } from '../icon';
import { Tooltip } from './index';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    ...createParameters('centered'),
    docs: {
      subtitle: 'Brief contextual information displayed on hover or focus.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <div className='p-m'>
      <Tooltip>
        <Tooltip.Trigger>
          <span className='fg-primary-bold'>Test</span>
        </Tooltip.Trigger>
        <Tooltip.Body>{MOCK_DATA.TEXT_CONTENT.SHORT}</Tooltip.Body>
      </Tooltip>
    </div>
  ),
};

export const LongTooltip: Story = {
  render: () => (
    <div className='p-m'>
      <Tooltip>
        <Tooltip.Trigger>
          <span className='fg-primary-bold'>Long Tooltip</span>
        </Tooltip.Trigger>
        <Tooltip.Body>{MOCK_DATA.TEXT_CONTENT.MEDIUM}</Tooltip.Body>
      </Tooltip>
    </div>
  ),
};

export const TooltipWithButton: Story = {
  render: () => (
    <div className='p-m'>
      <Tooltip>
        <Tooltip.Trigger>
          <Button>Save</Button>
        </Tooltip.Trigger>
        <Tooltip.Body>Save current changes</Tooltip.Body>
      </Tooltip>
    </div>
  ),
};

export const TooltipWithIcon: Story = {
  render: () => (
    <div className='p-m'>
      <Tooltip>
        <Tooltip.Trigger>
          <Icon className='fg-primary-bold h-xl w-xl'>
            <Lasso />
          </Icon>
        </Tooltip.Trigger>
        <Tooltip.Body>Lasso Selection</Tooltip.Body>
      </Tooltip>
    </div>
  ),
};
