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
import { Button } from '../button';
import { Tabs } from '../tabs';
import { Drawer } from './index';
import { NavigationStack } from '../navigation-stack';

const meta: Meta<typeof Drawer> = {
  title: 'Components/Drawer',
  component: Drawer,
};

export default meta;
type Story = StoryObj<typeof Drawer>;

function PositionedContent({ position }: { position: string }) {
  return (
    <div className='padding-l flex flex-row justify-between'>
      <div>{position} content</div>
    </div>
  );
}

export const Default: Story = {
  render: () => {
    return (
      <div className='absolute inset-0 grid grid-cols-3 grid-rows-3 bg-default-light'>
        <div className='col-start-1 row-start-2 flex items-center justify-center'>
          <Drawer position='left'>
            <Drawer.Trigger>
              <Button>Left</Button>
            </Drawer.Trigger>
            <Drawer.Content>
              <Drawer.Header>Header</Drawer.Header>
              <PositionedContent position='left' />
            </Drawer.Content>
          </Drawer>
        </div>

        <div className='col-start-3 row-start-2 flex items-center justify-center'>
          <Drawer position='right'>
            <Drawer.Trigger>
              <Button>Right</Button>
            </Drawer.Trigger>
            <Drawer.Content>
              <Drawer.Header>Header</Drawer.Header>
              <PositionedContent position='right' />
            </Drawer.Content>
          </Drawer>
        </div>

        <div className='col-start-2 row-start-1 flex items-center justify-center'>
          <Drawer position='top'>
            <Drawer.Trigger>
              <Button>Top</Button>
            </Drawer.Trigger>
            <Drawer.Content>
              <Drawer.Header>Header</Drawer.Header>
              <PositionedContent position='top' />
            </Drawer.Content>
          </Drawer>
        </div>

        <div className='col-start-2 row-start-3 flex items-center justify-center'>
          <Drawer position='bottom'>
            <Drawer.Trigger>
              <Button>Bottom</Button>
            </Drawer.Trigger>
            <Drawer.Content>
              <Drawer.Header>Header</Drawer.Header>
              <PositionedContent position='bottom' />
            </Drawer.Content>
          </Drawer>
        </div>
      </div>
    );
  },
};

export const AttachedTrigger: Story = {
  render: () => {
    return (
      <div className='absolute inset-0 grid grid-cols-3 grid-rows-3 bg-default-light'>
        <Tabs orientation='vertical'>
          <Drawer position='left' isDismissable={false}>
            <Drawer.Trigger attached>
              <Tabs.List drawer='left'>
                <Tabs.Tab id='a'>a</Tabs.Tab>
                <Tabs.Tab id='b'>b</Tabs.Tab>
              </Tabs.List>
            </Drawer.Trigger>
            <Drawer.Content>
              <Drawer.Header>Header</Drawer.Header>
              <Tabs.Panel id='a' className='h-full p-0'>
                a content
              </Tabs.Panel>
              <Tabs.Panel id='b' className='h-full p-0'>
                b content
              </Tabs.Panel>
            </Drawer.Content>
          </Drawer>
        </Tabs>
      </div>
    );
  },
};

export const ChildView: Story = {
  render: () => {
    return (
      <div className='absolute inset-0 grid grid-cols-3 grid-rows-3 bg-default-light'>
        <Tabs orientation='vertical'>
          <Drawer position='left' isDismissable={false}>
            <Drawer.Trigger attached>
              <Tabs.List drawer='left'>
                <Tabs.Tab id='a'>a</Tabs.Tab>
                <Tabs.Tab id='b'>b</Tabs.Tab>
              </Tabs.List>
            </Drawer.Trigger>
            <Drawer.Content>
              <Tabs.Panel id='a' className='h-full p-0'>
                <NavigationStack defaultViewId='a'>
                  <NavigationStack.View id='a'>
                    <Drawer.Header>
                      <NavigationStack.Header>
                        <NavigationStack.Title>Parent A</NavigationStack.Title>
                      </NavigationStack.Header>
                    </Drawer.Header>
                    <NavigationStack.Content>a content</NavigationStack.Content>
                    <Drawer.Footer>
                      <NavigationStack.NavigationButton childId='child-a'>
                        View Child
                      </NavigationStack.NavigationButton>
                    </Drawer.Footer>
                  </NavigationStack.View>

                  <NavigationStack.View id='child-a'>
                    <NavigationStack.Header>
                      <NavigationStack.Title>Child A</NavigationStack.Title>
                      <Drawer.CloseButton />
                    </NavigationStack.Header>
                    <NavigationStack.Content>
                      a child content
                    </NavigationStack.Content>
                  </NavigationStack.View>
                </NavigationStack>
              </Tabs.Panel>

              <Tabs.Panel id='b' className='h-full p-0'>
                <NavigationStack defaultViewId='b'>
                  <NavigationStack.View id='b'>
                    <Drawer.Header>
                      <NavigationStack.Header>
                        <NavigationStack.Title>Parent B</NavigationStack.Title>
                      </NavigationStack.Header>
                    </Drawer.Header>
                    <NavigationStack.Content>b content</NavigationStack.Content>
                    <Drawer.Footer>
                      <NavigationStack.NavigationButton childId='child-b'>
                        View Child
                      </NavigationStack.NavigationButton>
                    </Drawer.Footer>
                  </NavigationStack.View>

                  <NavigationStack.View id='child-b'>
                    <NavigationStack.Header>
                      <NavigationStack.Title>Child B</NavigationStack.Title>
                      <Drawer.CloseButton />
                    </NavigationStack.Header>
                    <NavigationStack.Content>
                      b child content
                    </NavigationStack.Content>
                  </NavigationStack.View>
                </NavigationStack>
              </Tabs.Panel>
            </Drawer.Content>
          </Drawer>
        </Tabs>
      </div>
    );
  },
};
