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

import { COMMON_CONTROL, EXCLUSIONS } from '^storybook/utils';
import { Breadcrumbs } from './';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  args: {
    isDisabled: false,
  },
  argTypes: {
    isDisabled: COMMON_CONTROL.isDisabled,
  },
  parameters: {
    controls: {
      exclude: [...EXCLUSIONS.COMMON, 'dependencies', 'onAction'],
    },
    docs: {
      subtitle:
        'Display a list of directories to indicate to the user where they are at.',
    },
  },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  // NOTE: `_args` is purely so that Storybook will use the "controls" from `meta`
  render: (_args) => (
    <Breadcrumbs>
      <Breadcrumbs.Item linkProps={{ href: '/ ' }}>Root</Breadcrumbs.Item>
      <Breadcrumbs.Item linkProps={{ href: '/home' }}>Child</Breadcrumbs.Item>
      <Breadcrumbs.Item>Child</Breadcrumbs.Item>
    </Breadcrumbs>
  ),
};
