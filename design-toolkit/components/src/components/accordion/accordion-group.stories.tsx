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
import { Icon } from '../icon';
import { Accordion } from './';
import { AccordionStylesDefaults } from './styles';
import type { Meta, StoryObj } from '@storybook/react';
import type { AccordionGroupProps } from './types';

type Alias = React.FC<AccordionGroupProps>;

/**
 * The accordion group will stretch to fill the entire width of its parent container.
 */
const meta = {
  title: 'Components/Accordion.Group',
  component: Accordion.Group as Alias,
  args: {
    allowsMultipleExpanded: false,
    variant: AccordionStylesDefaults.variant,
    isDisabled: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['cozy', 'compact'],
    },
  },
  parameters: {
    docs: {
      subtitle: 'Group together multiple <Accordion> components.',
    },
  },
} satisfies Meta<Alias>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: ({ children, ...args }) => (
    <div className='w-[280px]'>
      <Accordion.Group {...args}>
        <Accordion>
          <Accordion.Header>
            <Accordion.Trigger>
              <Icon>
                <Placeholder />
              </Icon>
              Accordion one
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            <p className='fg-primary-muted text-body-s'>
              This is a placeholder content for an accordion. Please replace
              with an actual content instance.
            </p>
          </Accordion.Panel>
        </Accordion>
        <Accordion>
          <Accordion.Header>
            <Accordion.Trigger>
              <Icon>
                <Placeholder />
              </Icon>
              Accordion two
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            <p className='fg-primary-muted text-body-s'>
              This is a placeholder content for an accordion. Please replace
              with an actual content instance.
            </p>
          </Accordion.Panel>
        </Accordion>
        <Accordion>
          <Accordion.Header>
            <Accordion.Trigger>
              <Icon>
                <Placeholder />
              </Icon>
              Accordion three
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            <p className='fg-primary-muted text-body-s'>
              This is a placeholder content for an accordion. Please replace
              with an actual content instance.
            </p>
          </Accordion.Panel>
        </Accordion>
      </Accordion.Group>
    </div>
  ),
};
