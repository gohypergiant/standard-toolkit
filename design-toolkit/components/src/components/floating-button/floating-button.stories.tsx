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

import { Link as LinkIcon } from '@/icons/link';
import { Placeholder } from '@/icons/placeholder';
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from '../tooltip';
import { FloatingButton } from './index';

const meta: Meta<typeof FloatingButton> = {
  title: 'Components/Button/FloatingButton',
  component: FloatingButton,
  args: {
    className: '',
    isDisabled: false,
  },
  argTypes: {
    className: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof FloatingButton>;

export const Default: Story = {
  render: (args) => (
    <FloatingButton {...args}>
      <Placeholder />
    </FloatingButton>
  ),
};

export const Link: Story = {
  render: (args) => (
    <a className={FloatingButton.as(args)} href='/'>
      <LinkIcon />
    </a>
  ),
};

export const WithTooltip: Story = {
  render: (args) => (
    <Tooltip>
      <Tooltip.Trigger>
        <FloatingButton {...args}>
          <Placeholder />
        </FloatingButton>
      </Tooltip.Trigger>
      <Tooltip.Body>Tool label</Tooltip.Body>
    </Tooltip>
  ),
};
