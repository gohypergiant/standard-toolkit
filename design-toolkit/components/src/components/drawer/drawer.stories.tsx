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
import { Cancel, Placeholder } from '@accelint/icons';
import type { Meta, StoryObj } from '@storybook/react';
import { useCallback, useState } from 'react';
import { Button } from '../button';
import { Icon } from '../icon';
import { Drawer } from './index';
import type { DrawerProps } from './types';

const meta: Meta<DrawerProps> = {
  title: 'Components/Drawer',
  component: Drawer,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    id: 'left-drawer',
    placement: 'left',
    size: 'medium',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const WithTabs: Story = {
  render: ({ id, ...args }) => {
    return (
      <div className='h-screen w-full'>
        <Drawer.Provider>
          <Drawer.Layout>
            <Drawer.Main>
              <div className='h-dvh bg-surface-raised p-l text-default-light'>
                {longContent}
              </div>
            </Drawer.Main>
            <Drawer id='settings' {...args}>
              <Drawer.Menu>
                <Drawer.Menu.Item id='a'>
                  <Placeholder />
                </Drawer.Menu.Item>
                <Drawer.Menu.Item id='b'>
                  <Placeholder />
                </Drawer.Menu.Item>
              </Drawer.Menu>
              <Drawer.Content>
                <Drawer.Header>
                  <Drawer.Title>Title</Drawer.Title>
                  <Drawer.Trigger for='settings' behavior='close'>
                    <Button size='small' variant='flat'>
                      <Icon>
                        <Cancel />
                      </Icon>
                    </Button>
                  </Drawer.Trigger>
                </Drawer.Header>
                <Drawer.Panel id='a'>A Content</Drawer.Panel>
                <Drawer.Panel id='b'>B Content</Drawer.Panel>
              </Drawer.Content>
            </Drawer>
          </Drawer.Layout>
        </Drawer.Provider>
      </div>
    );
  },
};

export const WithLongContent: Story = {
  render: () => {
    return (
      <div className='h-screen w-full'>
        <Drawer.Provider>
          <Drawer.Layout>
            <Drawer.Main>
              <div className='h-dvh bg-surface-raised' />
            </Drawer.Main>
            <Drawer id='settings' placement='left'>
              <Drawer.Menu>
                <Drawer.Menu.Item>
                  <Placeholder />
                </Drawer.Menu.Item>
              </Drawer.Menu>
              <Drawer.Content>
                <Drawer.Header>
                  <Drawer.Title>Title</Drawer.Title>
                  <Drawer.Trigger for='settings' behavior='close'>
                    <Button size='small'>
                      <Icon>
                        <Cancel />
                      </Icon>
                    </Button>
                  </Drawer.Trigger>
                </Drawer.Header>
                <Drawer.Panel>{longContent}</Drawer.Panel>
                <Drawer.Footer>Footer</Drawer.Footer>
              </Drawer.Content>
            </Drawer>
          </Drawer.Layout>
        </Drawer.Provider>
      </div>
    );
  },
};

export const Controlled: Story = {
  args: {
    isOpen: true,
  },
  render: ({ isOpen: defaultOpen }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const handleOpenChange = useCallback((isOpen: boolean) => {
      setIsOpen(isOpen);
    }, []);
    return (
      <div className='h-screen w-full'>
        <Drawer.Provider>
          <Drawer.Layout push='left'>
            <Drawer.Main>
              <div className='flex h-dvh flex-col gap-m bg-surface-raised p-l'>
                <Button
                  variant='outline'
                  onPress={() => handleOpenChange(!isOpen)}
                >
                  {isOpen ? 'Close' : 'Open'}
                </Button>
              </div>
            </Drawer.Main>
            <Drawer
              isOpen={isOpen}
              onOpenChange={handleOpenChange}
              id='settings'
              placement='left'
              defaultSelectedMenuItemId='placeholder'
            >
              <Drawer.Menu>
                <Drawer.Menu.Item id='placeholder'>
                  <Placeholder />
                </Drawer.Menu.Item>
              </Drawer.Menu>
              <Drawer.Content>
                <Drawer.Header>
                  <Drawer.Title>Title</Drawer.Title>
                </Drawer.Header>
                <Drawer.Panel>A Content</Drawer.Panel>
                <Drawer.Footer>
                  <Drawer.Trigger for='settings' behavior='close'>
                    <Button>Cancel</Button>
                  </Drawer.Trigger>
                </Drawer.Footer>
              </Drawer.Content>
            </Drawer>
          </Drawer.Layout>
        </Drawer.Provider>
      </div>
    );
  },
};

export const Uncontrolled: Story = {
  render: () => {
    return (
      <div className='h-screen w-full'>
        <Drawer.Provider>
          <Drawer.Layout push='left'>
            <Drawer.Main>
              <div className='h-dvh bg-surface-raised p-l'>
                <div className='flex gap-m '>
                  <Drawer.Trigger for='settings' behavior='toggle'>
                    <Button variant='outline'>Toggle</Button>
                  </Drawer.Trigger>
                  <Drawer.Trigger for='settings' behavior='open'>
                    <Button variant='outline'>Open</Button>
                  </Drawer.Trigger>
                  <Drawer.Trigger for='settings' behavior='close'>
                    <Button variant='outline'>Close</Button>
                  </Drawer.Trigger>
                </div>
              </div>
            </Drawer.Main>
            <Drawer
              id='settings'
              placement='left'
              defaultSelectedMenuItemId='placeholder'
            >
              <Drawer.Menu>
                <Drawer.Menu.Item id='placeholder'>
                  <Placeholder />
                </Drawer.Menu.Item>
              </Drawer.Menu>
              <Drawer.Content>
                <Drawer.Header>
                  <Drawer.Title>Title</Drawer.Title>
                </Drawer.Header>
                <Drawer.Panel>A Content</Drawer.Panel>
                <Drawer.Footer>
                  <Drawer.Trigger for='settings' behavior='close'>
                    <Button>Cancel</Button>
                  </Drawer.Trigger>
                </Drawer.Footer>
              </Drawer.Content>
            </Drawer>
          </Drawer.Layout>
        </Drawer.Provider>
      </div>
    );
  },
};

const longContent = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sed rhoncus urna. Nam blandit tortor laoreet, efficitur ante eget, sagittis massa. Nam eu consequat nibh, a pulvinar mi. Donec in felis elementum turpis vehicula rutrum at vel purus. Integer tristique sodales eros, nec suscipit mi posuere a. Phasellus non mi erat. Sed at elementum lacus, ac rhoncus urna. Nullam metus diam, porta sed elementum in, rutrum eu turpis. Aliquam hendrerit eget augue ac sodales. Phasellus fermentum ante dolor, et hendrerit dolor bibendum id. Etiam placerat tortor sagittis diam faucibus feugiat. Etiam sed dolor a ante dignissim condimentum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed eu nulla consequat, malesuada elit eu, imperdiet nibh. Ut dictum enim non aliquam tempus.

Praesent ullamcorper neque non dolor ultrices porta. Suspendisse potenti. Integer ipsum mauris, vestibulum ut luctus sit amet, mollis vel velit. Cras vitae molestie nunc. In ut velit ut libero posuere porta. Pellentesque fringilla sollicitudin elit, ut feugiat augue pellentesque sed. Ut non dui tellus. Aenean vehicula ultrices vulputate. Morbi viverra interdum mi, eu convallis dolor hendrerit ac. Sed interdum est arcu, a tempus nunc accumsan a. Praesent porta malesuada laoreet. Sed ultrices elit quis enim pretium, in venenatis mauris faucibus. Curabitur nec velit ligula. Maecenas orci ipsum, accumsan quis nisi in, fringilla facilisis dolor. Proin magna felis, tristique nec elit rutrum, tristique aliquam sem.

Cras neque nulla, imperdiet nec nulla sed, tempus mollis purus. Etiam sed erat vitae enim sagittis tristique. Ut luctus felis et fermentum pellentesque. Pellentesque eleifend blandit nibh ut interdum. Etiam ultricies pretium eros, auctor vehicula tellus ornare nec. Donec metus risus, faucibus tincidunt arcu a, malesuada pretium metus. Nunc ac est vitae ex gravida euismod. Praesent quam ligula, venenatis eget neque ac, pellentesque finibus ipsum. Quisque rutrum ligula sed ex posuere mollis. Integer pretium luctus massa. Suspendisse diam massa, congue vitae bibendum quis, finibus quis felis. Vivamus in dui a lectus posuere rutrum.

Etiam venenatis vulputate dignissim. Proin risus sem, aliquet eget vestibulum ut, mattis nec nulla. Integer nec semper quam. Ut blandit mi quis eros imperdiet tincidunt. Maecenas ac tincidunt tortor. In accumsan sem eget massa bibendum euismod. Pellentesque sit amet lorem urna. Sed consectetur a mauris sit amet commodo. Sed quis laoreet dolor. Mauris quis mattis tellus.

Integer in libero velit. Donec fringilla sem eu tellus cursus, maximus bibendum lacus rhoncus. Vestibulum hendrerit porttitor neque, vitae venenatis nibh. Nulla risus quam, cursus ac ultricies at, mattis nec nisl. Suspendisse vulputate, sem at dapibus facilisis, nibh sapien cursus ipsum, at suscipit risus arcu sed nibh. Cras pellentesque, urna ut venenatis euismod, leo lacus facilisis turpis, in gravida tortor nisl eget ipsum. In finibus tempus est at tristique. Aenean ut hendrerit massa. Donec magna nisi, imperdiet at lacinia non, dictum non elit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam et enim consequat, malesuada urna et, placerat dui.
`;
