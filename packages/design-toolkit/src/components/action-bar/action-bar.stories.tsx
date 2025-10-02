import { Placeholder } from '@accelint/icons';
import { Button, ToggleButton } from '../button';
import { Icon } from '../icon';
import { ActionBar } from './index';
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
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/ActionBar',
  component: ActionBar,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ActionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <div className='relative h-[400px] bg-surface-overlay'>
        <ActionBar className='absolute top-s left-s'>
          <Button>
            <Icon>
              <Placeholder />
            </Icon>
          </Button>
          <Button>
            <Icon>
              <Placeholder />
            </Icon>
          </Button>
          <Button>
            <Icon>
              <Placeholder />
            </Icon>
          </Button>
        </ActionBar>
      </div>
    );
  },
};

export const Toggle: Story = {
  render: () => {
    return (
      <div className='relative h-[400px] bg-surface-overlay'>
        <ActionBar className='absolute top-s left-s'>
          <ToggleButton>
            <Icon>
              <Placeholder />
            </Icon>
          </ToggleButton>
          <ToggleButton>
            <Icon>
              <Placeholder />
            </Icon>
          </ToggleButton>
          <ToggleButton>
            <Icon>
              <Placeholder />
            </Icon>
          </ToggleButton>
        </ActionBar>
      </div>
    );
  },
};
