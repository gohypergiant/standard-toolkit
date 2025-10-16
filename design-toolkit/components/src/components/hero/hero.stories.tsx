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

import { createControl, EXCLUSIONS } from '^storybook/utils';
import Placeholder from '@accelint/icons/placeholder';
import { Icon } from '../icon';
import { Hero } from './';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/Hero',
  component: Hero,
  args: {
    compact: false,
  },
  argTypes: {
    compact: createControl.boolean('Whether to use compact layout'),
  },
  parameters: {
    controls: {
      exclude: [...EXCLUSIONS.COMMON],
    },
    docs: {
      subtitle:
        'Displays an icon alongside primary and secondary content with flexible layouts.',
    },
  },
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className='w-[480px]'>
      <Hero {...args}>
        <Icon>
          <Placeholder />
        </Icon>
        <Hero.Title>Project Dashboard</Hero.Title>
        <Hero.Subtitle>Main Overview</Hero.Subtitle>
        <Hero.Subtitle>Last updated today</Hero.Subtitle>
      </Hero>
    </div>
  ),
};
