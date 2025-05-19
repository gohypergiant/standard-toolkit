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
import { Accordion, AccordionGroup, AccordionHeader, AccordionPanel } from './';

/**
 * The accordion group will stretch to fill the entire width of its parent container.
 */
const meta: Meta<typeof AccordionGroup> = {
  title: 'Components/Accordion Group',
  component: AccordionGroup,
  args: {
    allowsMultipleExpanded: false,
    isDisabled: false,
  },
  argTypes: {},
  parameters: {
    docs: {
      subtitle: 'Group together multiple <Accordion> components.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof AccordionGroup>;

export const Default: Story = {
  render: ({ children, ...args }) => (
    <div className='w-[280px]'>
      <AccordionGroup {...args}>
        <Accordion>
          <AccordionHeader>
            <Icon>
              <Placeholder />
            </Icon>{' '}
            Accordion one{' '}
          </AccordionHeader>
          <AccordionPanel>
            <p className='fg-default-dark text-body-s'>
              This is a placeholder content for an accordion. Please replace
              with an actual content instance.
            </p>
          </AccordionPanel>
        </Accordion>
        <Accordion>
          <AccordionHeader>
            <Icon>
              <Placeholder />
            </Icon>{' '}
            Accordion two{' '}
          </AccordionHeader>
          <AccordionPanel>
            <p className='fg-default-dark text-body-s'>
              This is a placeholder content for an accordion. Please replace
              with an actual content instance.
            </p>
          </AccordionPanel>
        </Accordion>
        <Accordion>
          <AccordionHeader>
            <Icon>
              <Placeholder />
            </Icon>{' '}
            Accordion three{' '}
          </AccordionHeader>
          <AccordionPanel>
            <p className='fg-default-dark text-body-s'>
              This is a placeholder content for an accordion. Please replace
              with an actual content instance.
            </p>
          </AccordionPanel>
        </Accordion>
      </AccordionGroup>
    </div>
  ),
};
