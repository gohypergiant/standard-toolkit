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

import { createControl, EXCLUSIONS } from '^storybook/utils';
import MouseRightClick from '@accelint/icons/mouse-right-click';
import { Icon } from '../icon';
import { Hotkey } from './index';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/Hotkey',
  component: Hotkey,
  args: {
    children: 'ctrl',
    variant: 'outline',
  },
  argTypes: {
    variant: createControl.select('Visual style of the hotkey display', [
      'outline',
      'flat',
      'icon',
    ]),
  },
  parameters: {
    controls: {
      exclude: [...EXCLUSIONS.COMMON],
    },
    docs: {
      subtitle: 'Visual representation of keyboard shortcuts and hotkeys.',
    },
  },
} satisfies Meta<typeof Hotkey>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: ({ children, variant }) => {
    return (
      <div className='flex flex-col gap-xl'>
        <Hotkey variant={variant}>
          {variant === 'icon' ? (
            <Icon>
              <MouseRightClick />
            </Icon>
          ) : (
            children
          )}
        </Hotkey>
      </div>
    );
  },
};

export const KeysSet: Story = {
  render: ({ variant }) => {
    return (
      <div className='flex flex-col gap-xl'>
        <Hotkey.Set>
          <Hotkey variant={variant}>CMD</Hotkey>
          <span>+</span>
          <Hotkey variant='icon'>
            <Icon>
              <MouseRightClick />
            </Icon>
          </Hotkey>
          <span>+</span>
          <Hotkey variant={variant}>⌘V</Hotkey>
        </Hotkey.Set>
        <Hotkey.Set>
          <Hotkey variant={variant}>CMD</Hotkey>
          <span>or</span>
          <Hotkey variant='icon'>
            <Icon>
              <MouseRightClick />
            </Icon>
          </Hotkey>
          <span>+</span>
          <Hotkey variant={variant}>⌘V</Hotkey>
        </Hotkey.Set>
      </div>
    );
  },
};
