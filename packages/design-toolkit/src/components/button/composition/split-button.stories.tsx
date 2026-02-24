/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import type { StoryObj } from '@storybook/react-vite';

type StoryArgs = {
  buttonVariant: 'filled' | 'flat' | 'icon' | 'outline';
  buttonColor: 'mono-muted' | 'mono-bold' | 'accent';
  buttonSize: 'large' | 'medium' | 'small' | 'xsmall';
  menuVariant: 'compact' | 'cozy';
  isDisabled: boolean;
};

const meta = {
  title: 'Components/Button/Composition/Split Button',
  tags: ['!autodocs'], // what this do
  args: {
    buttonVariant: 'filled',
    buttonColor: 'mono-muted',
  },
  argTypes: {
    buttonVariant: {
      control: 'select',
      options: ['filled', 'flat', 'icon', 'outline'],
    },
    buttonColor: {
      control: 'select',
      options: ['mono-muted', 'mono-bold', 'accent'],
    },
    buttonSize: {
      control: 'select',
      options: ['large', 'medium', 'small', 'xsmall'],
    },
    menuVariant: {
      control: 'select',
      options: ['compact', 'cozy'],
    },
    isDisabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const Default: Story = {
  render: (_args) => {
    return <div>sup</div>;
  },
};
