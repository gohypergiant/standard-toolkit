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

import Placeholder from '@accelint/icons/placeholder';
import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from '../icon';
import { Hero } from './';

const meta: Meta<typeof Hero> = {
  title: 'Components/Hero',
  component: Hero,
  args: {
    compact: false,
  },
};

export default meta;

export const Default: StoryObj<typeof Hero> = {
  render: (args) => (
    <div className='w-[480px]'>
      <Hero {...args}>
        <Icon>
          <Placeholder />
        </Icon>
        <Hero.Title>{'{object.name}'}</Hero.Title>
        <Hero.Subtitle>additional-metadata-01</Hero.Subtitle>
        <Hero.Subtitle>additional-metadata-002</Hero.Subtitle>
      </Hero>
    </div>
  ),
};

export const SlotOrdering: StoryObj<typeof Hero> = {
  render: (args) => (
    <div className='flex flex-col gap-xl'>
      <div className='w-[480px]'>
        <h3 className='fg-default-light mb-m font-semibold text-sm'>
          Normal Order
        </h3>
        <Hero {...args}>
          <Icon size='large'>
            <Placeholder />
          </Icon>
          <Hero.Title>Primary Content</Hero.Title>
          <Hero.Subtitle>Secondary Information</Hero.Subtitle>
        </Hero>
      </div>
      <div className='w-[480px]'>
        <h3 className='fg-default-light mb-m font-semibold text-sm'>
          Reversed Order (should render the same)
        </h3>
        <Hero {...args}>
          <Hero.Subtitle>Secondary Information 3</Hero.Subtitle>
          <Hero.Subtitle>Secondary Information 2</Hero.Subtitle>
          <Hero.Subtitle>Secondary Information 1</Hero.Subtitle>
          <Hero.Title>Primary Content</Hero.Title>
          <Icon size='large'>
            <Placeholder />
          </Icon>
        </Hero>
      </div>
      <div className='w-[480px]'>
        <h3 className='fg-default-light mb-m font-semibold text-sm'>
          Mixed with other elements
        </h3>
        <Hero {...args}>
          <div>This is a regular div</div>
          <Hero.Subtitle>Secondary Information</Hero.Subtitle>
          <span>Another regular element</span>
          <Hero.Title>Primary Content</Hero.Title>
          <Icon size='large'>
            <Placeholder />
          </Icon>
          <p>Yet another element</p>
        </Hero>
      </div>
    </div>
  ),
};
