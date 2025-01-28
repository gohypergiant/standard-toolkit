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
import { TooltipTrigger } from 'react-aria-components';
import { Button } from '../button';
import { Tooltip } from './tooltip';
import type { TooltipProps } from './types';

const meta: Meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  args: {
    children: 'Hello World',
    placement: 'top',
    shouldFlip: true,
  },
  argTypes: {
    children: {
      control: {
        type: 'text',
      },
    },
    containerPadding: {
      control: {
        type: 'number',
      },
    },
    crossOffset: {
      control: {
        type: 'number',
      },
    },
    offset: {
      control: {
        type: 'number',
      },
    },
    placement: {
      control: {
        type: 'select',
      },
      options: ['top', 'right', 'bottom', 'left'],
    },
    shouldFlip: {
      control: {
        type: 'boolean',
      },
    },
  },
};

export default meta;

export const Default: StoryObj<TooltipProps> = {
  render: (props) => (
    <TooltipTrigger>
      <Button>Hover me</Button>
      <Tooltip {...props} />
    </TooltipTrigger>
  ),
};
