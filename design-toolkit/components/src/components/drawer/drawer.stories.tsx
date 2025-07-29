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
import {
  Cancel,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Placeholder,
} from '@accelint/icons';
import type { Meta, StoryObj } from '@storybook/react';
import { type CSSProperties, useCallback, useState } from 'react';
import { Button } from '../button';
import { Icon } from '../icon';
import { NavigationStack } from '../navigation-stack';
import { Drawer } from './index';
import type { DrawerProps, DrawerRootProps } from './types';

type CombinedDrawerProps = DrawerProps & Pick<DrawerRootProps, 'extend'>;

const meta: Meta<CombinedDrawerProps> = {
  title: 'Components/Drawer',
  component: Drawer,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    id: 'left-drawer',
    placement: 'left',
    mode: 'overlay',
    size: 'medium',
    extend: 'left right',
  },
  argTypes: {
    extend: {
      control: 'radio',
      options: ['top bottom', 'left right', 'top', 'bottom', 'left', 'right'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

const placeholderIcons = Array.from({ length: 6 }, (_, index) => (
  <Drawer.Menu.Item id={`${index + 1}`} key={`${index + 1}`}>
    <Placeholder />
  </Drawer.Menu.Item>
));

export const WithTabs: Story = {
  render: ({ id, ...args }) => {
    return (
      <div className='h-screen w-full'>
        <Drawer.Root>
          <Drawer.Main>
            <div className='p-l text-default-light'>{longContent}</div>
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
                <Drawer.Close>
                  <Button size='small' variant='flat'>
                    <Icon>
                      <Cancel />
                    </Icon>
                  </Button>
                </Drawer.Close>
              </Drawer.Header>
              <Drawer.Panel id='a'>A Content</Drawer.Panel>
              <Drawer.Panel id='b'>B Content</Drawer.Panel>
            </Drawer.Content>
          </Drawer>
        </Drawer.Root>
      </div>
    );
  },
};

export const FullLayout: Story = {
  render: ({ extend, mode }: CombinedDrawerProps) => {
    return (
      <div className='h-screen w-full'>
        <Drawer.Root extend={extend}>
          <Drawer id='header' placement='top' mode={mode}>
            <Drawer.Menu>
              <Drawer.Trigger for='header'>
                <Icon>
                  <ChevronDown className='group-data-[top-open="true"]/layout:rotate-180' />
                </Icon>
              </Drawer.Trigger>

              {placeholderIcons}
            </Drawer.Menu>

            <Drawer.Content>
              <Drawer.Title>Top</Drawer.Title>
            </Drawer.Content>
          </Drawer>

          <Drawer.Main>
            <div
              className='flex h-full items-center justify-center bg-surface-overlay'
              style={
                {
                  '--single': '40px',
                  '--double': 'calc(2 * var(--single))',
                  backgroundImage: `
            radial-gradient(closest-side, transparent 98%, rgba(0,0,0,.8) 99%),
            radial-gradient(closest-side, transparent 98%, rgba(0,0,0,.4) 99%)
          `,
                  backgroundSize: 'var(--double) var(--double)',
                  backgroundPosition:
                    'center, calc(50% + var(--single)) calc(50% + var(--single))',
                } as CSSProperties
              }
            >
              <div className='flex w-1/2 flex-col rounded-large border-2 border-default-dark bg-surface-overlay p-xl [&>*]:my-s'>
                <p>This page is for demo purposes only!</p>
              </div>
            </div>
          </Drawer.Main>

          <Drawer id='footer' placement='bottom' mode={mode}>
            <Drawer.Menu>
              <Drawer.Trigger for='footer'>
                <Icon>
                  <ChevronUp className='group-data-[bottom-open="true"]/layout:rotate-180' />
                </Icon>
              </Drawer.Trigger>

              {placeholderIcons}
            </Drawer.Menu>

            <Drawer.Content>
              <Drawer.Title>Bottom</Drawer.Title>
            </Drawer.Content>
          </Drawer>

          <Drawer id='settings' placement='left' mode={mode}>
            <Drawer.Menu>
              <Drawer.Trigger for='settings'>
                <Icon>
                  <ChevronRight className='group-data-[left-open="true"]/layout:rotate-180' />
                </Icon>
              </Drawer.Trigger>

              {placeholderIcons}
            </Drawer.Menu>

            <Drawer.Content>
              <Drawer.Title>Left</Drawer.Title>
            </Drawer.Content>
          </Drawer>

          <Drawer id='sidebar' placement='right' mode={mode}>
            <Drawer.Menu>
              <Drawer.Trigger for='sidebar'>
                <Icon>
                  <ChevronLeft className='group-data-[right-open="true"]/layout:rotate-180' />
                </Icon>
              </Drawer.Trigger>

              {placeholderIcons}
            </Drawer.Menu>

            <Drawer.Content>
              <Drawer.Title>Right</Drawer.Title>
            </Drawer.Content>
          </Drawer>
        </Drawer.Root>
      </div>
    );
  },
};

export const WithLongContent: Story = {
  render: () => {
    return (
      <div className='h-screen w-full'>
        <Drawer.Root>
          <Drawer id='settings' placement='left' mode='overlay'>
            <Drawer.Menu>
              <Drawer.Menu.Item>
                <Placeholder />
              </Drawer.Menu.Item>
            </Drawer.Menu>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>Title</Drawer.Title>
                <Drawer.Close>
                  <Button size='small'>
                    <Icon>
                      <Cancel />
                    </Icon>
                  </Button>
                </Drawer.Close>
              </Drawer.Header>
              <Drawer.Panel>{longContent}</Drawer.Panel>
              <Drawer.Footer>Footer</Drawer.Footer>
            </Drawer.Content>
          </Drawer>
        </Drawer.Root>
      </div>
    );
  },
};

export const ControlledOpen: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    const handleOpenChange = useCallback((isOpen: boolean) => {
      setIsOpen(isOpen);
    }, []);
    return (
      <div className='h-screen w-full'>
        <Drawer.Root>
          <Drawer.Main>
            <div className='flex flex-col gap-m p-l'>
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
            mode='push'
            defaultSelectedMenuItemId='placeholder'
          >
            <Drawer.Header>
              <Drawer.Title>Title</Drawer.Title>
            </Drawer.Header>
            <Drawer.Menu>
              <Drawer.Menu.Item id='placeholder'>
                <Placeholder />
              </Drawer.Menu.Item>
            </Drawer.Menu>
            <Drawer.Content>
              <Drawer.Panel>A Content</Drawer.Panel>
              <Drawer.Footer>
                <Drawer.Close>
                  <Button>Cancel</Button>
                </Drawer.Close>
              </Drawer.Footer>
            </Drawer.Content>
          </Drawer>
        </Drawer.Root>
      </div>
    );
  },
};

export const WithNavigationStack: Story = {
  render: () => {
    return (
      <div className='h-screen w-full'>
        <Drawer.Root>
          <Drawer id='settings' placement='left' mode='overlay'>
            <Drawer.Menu>
              <Drawer.Menu.Item id='a'>
                <Placeholder />
              </Drawer.Menu.Item>
              <Drawer.Menu.Item id='b'>
                <Placeholder />
              </Drawer.Menu.Item>
            </Drawer.Menu>
            <Drawer.Content>
              <Drawer.Panel id='a'>
                <NavigationStack defaultViewId='a'>
                  <NavigationStack.View id='a' className='flex flex-col'>
                    <Drawer.Header>Parent A</Drawer.Header>
                    <div className='flex-1'>a content</div>
                    <Drawer.Footer>
                      <NavigationStack.Navigate childId='child-a'>
                        <span className='cursor-pointer'>View Child</span>
                      </NavigationStack.Navigate>
                    </Drawer.Footer>
                  </NavigationStack.View>

                  <NavigationStack.View
                    id='child-a'
                    className='flex flex-col gap-m'
                  >
                    <div className='flex cursor-pointer items-center justify-between'>
                      <NavigationStack.Back>
                        <span>Back</span>
                      </NavigationStack.Back>
                      <div>Child A</div>
                    </div>
                    <div> a child content </div>
                  </NavigationStack.View>
                </NavigationStack>
              </Drawer.Panel>

              <Drawer.Panel id='b' className='h-full p-0'>
                <NavigationStack defaultViewId='b'>
                  <NavigationStack.View id='b' className='flex flex-col'>
                    <Drawer.Header>Parent B</Drawer.Header>
                    <div className='flex-1'>b content</div>
                    <Drawer.Footer>
                      <NavigationStack.Navigate childId='child-b'>
                        <span className='cursor-pointer'>View Child</span>
                      </NavigationStack.Navigate>
                    </Drawer.Footer>
                  </NavigationStack.View>

                  <NavigationStack.View
                    id='child-b'
                    className='flex flex-col gap-m'
                  >
                    <div className='flex cursor-pointer items-center justify-between'>
                      <NavigationStack.Back>
                        <Icon>
                          <ChevronLeft />
                        </Icon>
                      </NavigationStack.Back>
                      Child B
                    </div>
                    <div className='flex-1'>b child content</div>
                  </NavigationStack.View>
                </NavigationStack>
              </Drawer.Panel>
            </Drawer.Content>
          </Drawer>
        </Drawer.Root>
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
