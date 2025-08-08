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

import { uuid } from '@accelint/core';
import { ChevronLeft } from '@accelint/icons';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../button';
import { Icon } from '../icon';
import { ViewStack } from './index';

const meta: Meta<typeof ViewStack> = {
  title: 'Components/ViewStack',
  component: ViewStack,
  parameters: {
    docs: {
      description: {
        component: `
          The ViewStack component allows you to manage a stack of views. Think of it as similar to the
          functionality of tabs, but the triggers can be anywhere, even programmatic. The ViewStack
          component provides a way to push and pop views from the stack as well as clear all or reset back
          to the original view.
        `,
      },
    },
  },
};

export default meta;

const ids = {
  stack: uuid(),
  a: uuid(),
  b: uuid(),
  c: uuid(),
};

export const Default: StoryObj<typeof ViewStack> = {
  render: () => (
    <>
      <ViewStack id={ids.stack} defaultView={ids.a}>
        <ViewStack.View id={ids.a}>
          <ViewStack.Trigger for={ids.b}>
            <Button size='small' variant='flat'>
              Push View B
            </Button>
          </ViewStack.Trigger>
          <h1 className='fg-default-light h-oversized text-center'>View A</h1>
        </ViewStack.View>
        <ViewStack.View id={ids.b}>
          <div className='flex'>
            <ViewStack.Trigger for='back'>
              <Button variant='icon'>
                <Icon>
                  <ChevronLeft />
                </Icon>
              </Button>
            </ViewStack.Trigger>
            <ViewStack.Trigger for={ids.c}>
              <Button size='small' variant='flat'>
                Push View C
              </Button>
            </ViewStack.Trigger>
          </div>
          <h1 className='fg-default-light h-oversized text-center'>View B</h1>
        </ViewStack.View>
        <ViewStack.View id={ids.c}>
          <ViewStack.Trigger for='back'>
            <Button variant='icon'>
              <Icon>
                <ChevronLeft />
              </Icon>
            </Button>
          </ViewStack.Trigger>
          <h1 className='fg-default-light h-oversized text-center'>View C</h1>
        </ViewStack.View>
      </ViewStack>
      <div className='flex gap-s'>
        <ViewStack.Trigger for={[`clear:${ids.stack}`, ids.a]}>
          <Button variant='flat'>Goto View A</Button>
        </ViewStack.Trigger>
        <ViewStack.Trigger for={[`clear:${ids.stack}`, ids.b]}>
          <Button variant='flat'>Goto View B</Button>
        </ViewStack.Trigger>
        <ViewStack.Trigger for={[`clear:${ids.stack}`, ids.c]}>
          <Button variant='flat'>Goto View C</Button>
        </ViewStack.Trigger>
      </div>
    </>
  ),
};
