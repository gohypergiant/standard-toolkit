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

import { ChevronLeft } from '@accelint/icons';
import { Button } from '../button';
import { Icon } from '../icon';
import { NavigationStack } from './index';
import type { Meta, StoryObj } from '@storybook/react';
import type { NavigationStackProps } from './types';

const meta: Meta<typeof NavigationStack> = {
  title: 'Components/NavigationStack',
  component: NavigationStack,
  parameters: {
    docs: {
      description: {
        component: `
          A NavigationStack is a component that allows you to manage a stack of views. It is commonly
          used in drawers and modals to navigate between different views. The NavigationStack component
          provides a way to push and pop views from the stack and it also provides a way to clear all
          views back to the original view.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof NavigationStack>;

export const Default: Story = {
  render: (args: NavigationStackProps) => (
    <div className='h-[300px] w-[200px] text-default-light'>
      <NavigationStack defaultViewId='parent' {...args}>
        <NavigationStack.View id='parent-id'>
          <div className='flex flex-col gap-m'>
            <div className='text-header-l'>Parent View</div>
            <NavigationStack.Navigate for='child-id'>
              <Button>Go To Child</Button>
            </NavigationStack.Navigate>
          </div>
        </NavigationStack.View>
        <NavigationStack.View id='child-id'>
          <div className='flex items-center justify-between'>
            <NavigationStack.Navigate for='back'>
              <div className='flex cursor-pointer items-center'>
                <Button variant='icon'>
                  <Icon>
                    <ChevronLeft />
                  </Icon>
                </Button>
                <span className='text-body-xs'> Parent View </span>
              </div>
            </NavigationStack.Navigate>
            <div className='text-header-s uppercase'>Child View</div>
          </div>
          <div className='mt-m text-body-s'>
            <p>this is the child view</p>
          </div>
        </NavigationStack.View>
      </NavigationStack>
    </div>
  ),
};
