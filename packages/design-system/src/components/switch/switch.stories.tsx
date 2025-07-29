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

import { action, type Story, type StoryDefault } from '@ladle/react';
import { Switch } from './';
import type { SwitchProps } from './types';

export default {
  title: 'Components',
  argTypes: {
    children: {
      control: {
        type: 'text',
      },
      defaultValue: 'Hello',
    },
    alignInput: {
      control: {
        type: 'select',
      },
      options: ['start', 'end'],
      defaultValue: 'end',
    },
    isDisabled: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    isReadOnly: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
  },
} satisfies StoryDefault;

export const ControlledExample: Story<SwitchProps> = (props) => (
  <Switch {...props} onChange={action('onChange')} />
);

ControlledExample.storyName = 'Switch / Controlled';

ControlledExample.argTypes = {
  isSelected: {
    control: {
      type: 'boolean',
    },
    defaultValue: false,
  },
};

export const UncontrolledExample: Story<SwitchProps> = (props) => (
  <Switch {...props} defaultSelected={false} onChange={action('onChange')} />
);

UncontrolledExample.storyName = 'Switch / Uncontrolled';
