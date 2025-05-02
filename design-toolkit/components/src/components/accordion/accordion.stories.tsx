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

import { Placeholder } from '@/icons';
import type { Meta, StoryObj } from '@storybook/react';
import { Accordion, AccordionGroup, AccordionHeader, AccordionPanel } from './';

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  args: {
    options: false,
    variant: 'cozy',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['cozy', 'compact'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  render: ({ children, ...args }) => (
    <div className='w-[280px]'>
      <Accordion {...args}>
        <AccordionHeader>
          <Placeholder /> Accordion title{' '}
        </AccordionHeader>
        <AccordionPanel>
          <p className='fg-default-dark text-body-s'>
            This is a placeholder content for an accordion. Please replace with
            an actual content instance.
          </p>
        </AccordionPanel>
      </Accordion>
    </div>
  ),
};

export const MultipleAccordions: Story = {
  render: ({ children, ...args }) => (
    <div className='w-[280px]'>
      <AccordionGroup>
        <Accordion {...args}>
          <AccordionHeader>
            <Placeholder /> Accordion one{' '}
          </AccordionHeader>
          <AccordionPanel>
            <p className='fg-default-dark text-body-s'>
              This is a placeholder content for an accordion. Please replace
              with an actual content instance.
            </p>
          </AccordionPanel>
        </Accordion>
        <Accordion {...args}>
          <AccordionHeader>
            <Placeholder /> Accordion two{' '}
          </AccordionHeader>
          <AccordionPanel>
            <p className='fg-default-dark text-body-s'>
              This is a placeholder content for an accordion. Please replace
              with an actual content instance.
            </p>
          </AccordionPanel>
        </Accordion>
        <Accordion {...args}>
          <AccordionHeader>
            <Placeholder /> Accordion three{' '}
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
