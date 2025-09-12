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
  createArgTypeSelect,
  createStandardParameters,
  STANDARD_ARG_TYPES,
} from '^storybook/utils/controls';
import { createStatesStory } from '^storybook/utils/templates';
import { Switch } from './';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  args: {
    children: 'Enable notifications',
    isDisabled: false,
    labelPosition: 'end',
  },
  argTypes: {
    children: STANDARD_ARG_TYPES.children,
    isDisabled: STANDARD_ARG_TYPES.isDisabled,
    labelPosition: createArgTypeSelect('Label positioning', ['start', 'end']),
  },
  parameters: {
    ...createStandardParameters('centered'),
    docs: {
      subtitle: 'A toggle control for binary state changes',
    },
  },
};

export default meta;

export const Default: StoryObj<typeof Switch> = {
  render: Switch,
};

export const States: StoryObj<typeof Switch> = createStatesStory({
  Component: Switch,
  baseProps: { children: 'Toggle setting' },
  stateProps: {
    disabled: { isDisabled: true, children: 'Disabled setting' },
  },
});

export const LabelPositions: StoryObj<typeof Switch> = {
  name: 'Label Positions',
  render: () => (
    <div className='max-w-xs space-y-l'>
      <Switch labelPosition='start'>Label at start</Switch>
      <Switch labelPosition='end'>Label at end</Switch>
    </div>
  ),
  parameters: {
    layout: 'centered',
    controls: { disable: true },
  },
};

export const WithoutLabel: StoryObj<typeof Switch> = {
  name: 'No Label',
  render: (args) => (
    <div className='flex items-center gap-m'>
      <span className='text-body-m'>Dark mode</span>
      <Switch {...args} />
    </div>
  ),
  args: {
    children: undefined,
    'aria-label': 'Toggle dark mode',
  },
  parameters: {
    layout: 'centered',
  },
};
