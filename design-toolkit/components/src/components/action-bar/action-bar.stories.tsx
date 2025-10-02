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

import { EXCLUSIONS } from '^storybook/utils';
import { Placeholder } from '@accelint/icons';
import { Button, ToggleButton } from '../button';
import { Icon } from '../icon';
import { ActionBar } from './index';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/ActionBar',
  component: ActionBar,
  parameters: {
    controls: {
      exclude: [...EXCLUSIONS.COMMON],
    },
    docs: {
      subtitle:
        'A horizontal toolbar component for grouping actions and controls',
    },
  },
} satisfies Meta<typeof ActionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <ActionBar>
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
    );
  },
};

export const Toggle: Story = {
  render: () => {
    return (
      <ActionBar>
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
    );
  },
};
