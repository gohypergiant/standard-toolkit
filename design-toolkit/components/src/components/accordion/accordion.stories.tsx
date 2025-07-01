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

import { Placeholder } from '@accelint/icons';
import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from '../icon';
import { Accordion } from './';

/**
 * The accordion will stretch to fill the entire width of its parent container.
 */
const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  args: {
    isDisabled: false,
    variant: 'cozy',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['cozy', 'compact'],
    },
  },
  parameters: {
    docs: {
      subtitle: 'Content that can expand and collapse.',
    },
  },
};

export default meta;

export const Default: StoryObj<typeof Accordion> = {
  render: ({ children, ...args }) => (
    <div className='w-[280px]'>
      <Accordion {...args}>
        <Accordion.Header>
          <Accordion.Trigger>
            <Icon>
              <Placeholder />
            </Icon>
            Accordion title
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>
          <p className='fg-default-dark text-body-s'>
            This is a placeholder content for an accordion. Please replace with
            an actual content instance.
          </p>
        </Accordion.Panel>
      </Accordion>
    </div>
  ),
};
