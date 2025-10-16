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

import { EXCLUSIONS, MOCK_DATA } from '^storybook/utils';
import { Lasso } from '@accelint/icons';
import { Button } from '../button';
import { Icon } from '../icon';
import { Tooltip } from './index';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  args: {
    children: null,
  },
  parameters: {
    controls: {
      exclude: [...EXCLUSIONS.COMMON],
    },
    docs: {
      subtitle: 'Brief contextual information displayed on hover or focus.',
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  // NOTE: `_args` is purely so that Storybook will use the "controls" from `meta`
  render: (_args) => (
    <div className='p-m'>
      <Tooltip.Trigger>
        <span className='fg-primary-bold'>Test</span>
        <Tooltip>{MOCK_DATA.TEXT_CONTENT.SHORT}</Tooltip>
      </Tooltip.Trigger>
    </div>
  ),
};

export const LongTooltip: Story = {
  // NOTE: `_args` is purely so that Storybook will use the "controls" from `meta`
  render: (_args) => (
    <div className='p-m'>
      <Tooltip.Trigger>
        <span className='fg-primary-bold'>Long Tooltip</span>
        <Tooltip>{MOCK_DATA.TEXT_CONTENT.MEDIUM}</Tooltip>
      </Tooltip.Trigger>
    </div>
  ),
};

export const TooltipWithButton: Story = {
  // NOTE: `_args` is purely so that Storybook will use the "controls" from `meta`
  render: (_args) => (
    <div className='p-m'>
      <Tooltip.Trigger>
        <Button>My Button</Button>
        <Tooltip>My tooltip</Tooltip>
      </Tooltip.Trigger>
    </div>
  ),
};

export const TooltipWithIcon: Story = {
  // NOTE: `_args` is purely so that Storybook will use the "controls" from `meta`
  render: (_args) => (
    <div className='p-m'>
      <Tooltip.Trigger>
        <Icon className='fg-primary-bold h-xl w-xl'>
          <Lasso />
        </Icon>
        <Tooltip>Lasso Selection</Tooltip>
      </Tooltip.Trigger>
    </div>
  ),
};
