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
import { ExpandLeftPanel, Placeholder } from '@accelint/icons';
import React, { type ComponentProps, useState } from 'react';
import { Heading, Text } from 'react-aria-components';
import { Avatar } from '../avatar';
import { Button } from '../button';
import { Drawer } from '../drawer';
import { Icon } from '../icon';
import { Sidenav } from './index';
import type { Meta, StoryObj } from '@storybook/react';

type SidenavWithLayoutArgs = ComponentProps<typeof Sidenav> & {
  pushLayout?: boolean;
};

const meta: Meta<SidenavWithLayoutArgs> = {
  title: 'Components/Sidenav',
  component: Sidenav,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    pushLayout: true,
    isHiddenWhenClosed: false,
  },
};

export default meta;

const sections = {
  'Title A': [
    {
      id: uuid(),
      text: 'Nav item',
      disabled: true,
    },
    {
      id: uuid(),
      text: 'Nav item',
      disabled: false,
    },
    {
      id: uuid(),
      text: 'Nav item',
      disabled: false,
    },
  ],
};

const id = uuid();

export const Default: StoryObj<SidenavWithLayoutArgs> = {
  render: ({ isHiddenWhenClosed, pushLayout }) => {
    const [activeItem, setActiveItem] = useState(
      sections['Title A'][2]?.id ?? null,
    );
    return (
      <div className='h-screen bg-surface-raised text-default-light'>
        <Drawer.Layout push={pushLayout ? 'left' : undefined}>
          <Drawer.Layout.Main>
            <nav className='flex items-center bg-surface-default p-m'>
              <Sidenav.Trigger for={id}>
                <Button variant='icon' size='large'>
                  <Icon>
                    <ExpandLeftPanel className='' />
                  </Icon>
                </Button>
              </Sidenav.Trigger>
            </nav>
          </Drawer.Layout.Main>
          <Sidenav id={id} isHiddenWhenClosed={isHiddenWhenClosed}>
            <Sidenav.Header>
              <Sidenav.Avatar>
                <Icon>
                  <Placeholder />
                </Icon>
                <Heading>Application Header</Heading>
                <Text>Secondary Text</Text>
              </Sidenav.Avatar>
            </Sidenav.Header>
            <Sidenav.Content>
              {Object.entries(sections).map(([section, items], i) => (
                <React.Fragment key={section}>
                  <Heading>{section}</Heading>
                  {items.map((item) => (
                    <Sidenav.Item
                      key={item.id}
                      textValue={item.text}
                      isDisabled={item.disabled}
                      isSelected={activeItem === item.id}
                      onPress={() =>
                        setActiveItem(activeItem === item.id ? null : item.id)
                      }
                    >
                      <Icon>
                        <Placeholder />
                      </Icon>
                      <Text>{item.text}</Text>
                    </Sidenav.Item>
                  ))}
                  {i !== Object.entries(sections).length - 1 && (
                    <Sidenav.Divider />
                  )}
                </React.Fragment>
              ))}
              <Sidenav.Divider />
              <Heading>External</Heading>
              <Sidenav.Link href='#' textValue='Nav Link'>
                <Icon>
                  <Placeholder />
                </Icon>
                <Text>Nav Link</Text>
              </Sidenav.Link>
              <Sidenav.Link isDisabled href='#' textValue='Nav Link'>
                <Icon>
                  <Placeholder />
                </Icon>
                <Text>Nav Link</Text>
              </Sidenav.Link>

              <Sidenav.Divider />
              <Heading>Menu</Heading>
              <Sidenav.Menu
                icon={
                  <Icon>
                    <Placeholder />
                  </Icon>
                }
                title='Nav Item'
              >
                <Sidenav.Menu.Item>
                  <Text>Sub item</Text>
                </Sidenav.Menu.Item>
                <Sidenav.Menu.Item>
                  <Text>Sub item</Text>
                </Sidenav.Menu.Item>
                <Sidenav.Menu.Item isDisabled>
                  <Text>Sub item</Text>
                </Sidenav.Menu.Item>
              </Sidenav.Menu>
            </Sidenav.Content>
            <Sidenav.Footer>
              <Sidenav.Item textValue='Application Footer'>
                <Sidenav.Avatar>
                  <Avatar
                    imageProps={{
                      alt: 'Dog',
                      src: 'https://placedog.net/100x100?id=144',
                    }}
                  />
                  <Heading>Application Footer</Heading>
                  <Text>Secondary Text</Text>
                </Sidenav.Avatar>
              </Sidenav.Item>
            </Sidenav.Footer>
          </Sidenav>
        </Drawer.Layout>
      </div>
    );
  },
};
