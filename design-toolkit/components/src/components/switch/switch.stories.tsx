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
  COMMON_CONTROL,
  createControl,
  createStatesStory,
  EXCLUSIONS,
  hideControls,
} from '^storybook/utils';
import { Switch } from './';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  args: {
    children: 'Enable notifications',
    isDisabled: false,
    labelPosition: 'end',
  },
  argTypes: {
    children: COMMON_CONTROL.children,
    isDisabled: COMMON_CONTROL.isDisabled,
    labelPosition: createControl.select('Label positioning', ['start', 'end']),
  },
  parameters: {
    controls: {
      exclude: [...EXCLUSIONS.COMMON, ...EXCLUSIONS.FORM],
    },
    docs: {
      subtitle: 'A toggle control for binary state changes',
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: Switch,
};

export const States: Story = createStatesStory({
  Component: Switch,
  baseProps: { children: 'Toggle setting' },
  stateProps: {
    disabled: { isDisabled: true, children: 'Disabled setting' },
  },
});

export const LabelPositions: Story = {
  // NOTE: `_args` is purely so that Storybook will use the "controls" from `meta`
  render: (_args) => (
    <div className='flex flex-col gap-l'>
      <Switch labelPosition='start'>Label at start</Switch>
      <Switch labelPosition='end'>Label at end</Switch>
    </div>
  ),
  ...hideControls(meta),
};

export const WithoutLabel: Story = {
  render: (args) => (
    <div className='flex items-center gap-m'>
      <span className='fg-primary-bold text-body-m'>Dark mode</span>
      <Switch {...args} />
    </div>
  ),
  args: {
    children: undefined,
  },
  ...hideControls(meta),
};
