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

import { Information } from '@accelint/icons';
import type { Meta } from '@storybook/react';
import { DialogTrigger } from 'react-aria-components';
import { Icon } from '../icon';
import { IconButton } from '../icon-button';
import { Popover } from './';

const meta: Meta<typeof Popover> = {
  title: 'Components/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    showArrow: true,
  },
};

export default meta;

export const Example = (args: any) => (
  <DialogTrigger>
    <IconButton aria-label='Help'>
      <Icon>
        <Information className='h-4 w-4' />
      </Icon>
    </IconButton>
    <Popover {...args} className='max-w-[250px]'>
      <p>Something</p>
    </Popover>
  </DialogTrigger>
);
