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

import {
  createStandardParameters,
  createVariantControl,
  STANDARD_ARG_TYPES,
} from '^storybook/shared-controls';
import { createVariantsStory } from '^storybook/story-templates';
import { CRITICALITY_VARIANTS } from '@/constants/criticality-variants';
import { Badge } from './';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  args: {
    children: '99+',
    variant: 'info',
  },
  argTypes: {
    children: STANDARD_ARG_TYPES.children,
    variant: createVariantControl(Object.values(CRITICALITY_VARIANTS)),
  },
  parameters: createStandardParameters('content'),
};

export default meta;

export const Default: StoryObj<typeof Badge> = {
  render: (args) => <Badge {...args} />,
};

export const WithoutText: StoryObj<typeof Badge> = {
  name: 'Indicator Only',
  render: (args) => (
    <div className='flex items-center gap-m'>
      <span className='text-body-m'>You have new notifications</span>
      <Badge {...args} />
    </div>
  ),
  args: {
    children: undefined,
  },
  parameters: {
    layout: 'centered',
  },
};

export const AllVariants: StoryObj<typeof Badge> = createVariantsStory({
  Component: Badge,
  variantProps: {
    'With Count': { children: '99+', variant: 'critical' },
    Normal: { children: '5', variant: 'normal' },
    Info: { children: 'New', variant: 'info' },
    Advisory: { children: '!', variant: 'advisory' },
    Serious: { children: '⚠', variant: 'serious' },
    Critical: { children: '✕', variant: 'critical' },
    'Indicator Only': { variant: 'normal' },
  },
  columns: 4,
});
