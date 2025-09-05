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
import { ExpandLeftPanel, Placeholder } from '@accelint/icons';
import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';
import { Heading, Text } from 'react-aria-components';
import { Button } from '../button';
import { Drawer } from '../drawer';
import { Icon } from '../icon';
import { Sidenav } from './index';

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
    hidden: false,
    pushLayout: false,
  },
};

export default meta;

export const Default: StoryObj<SidenavWithLayoutArgs> = {
  render: ({ hidden, pushLayout }) => {
    const push = pushLayout ? 'left' : undefined;
    const className = hidden ? undefined : '[--drawer-main-col-start:2]';
    return (
      <div className='h-screen bg-surface-raised text-default-light'>
        <Drawer.Layout className={className} push={push}>
          <Drawer.Layout.Main>
            <nav className='flex items-center bg-surface-default p-m'>
              <Sidenav.Trigger>
                <Button variant='icon' size='large'>
                  <Icon>
                    <ExpandLeftPanel />
                  </Icon>
                </Button>
              </Sidenav.Trigger>
            </nav>
          </Drawer.Layout.Main>
          <Sidenav hidden={hidden}>
            <Sidenav.Header>
              <Icon size='large'>
                <Placeholder />
              </Icon>
              <div>
                <Heading className='text-header-m'>Application Header</Heading>
                <Heading className='text-header-s'>subheader</Heading>
              </div>
            </Sidenav.Header>

            <Heading>Title</Heading>
            <Sidenav.Item>
              <Icon>
                <Placeholder />
              </Icon>
              <Text>Nav item</Text>
            </Sidenav.Item>
            <Sidenav.Item>
              <Icon>
                <Placeholder />
              </Icon>
              <Text>Nav item</Text>
            </Sidenav.Item>
            <Sidenav.Item>
              <Icon>
                <Placeholder />
              </Icon>
              <Text>Nav item</Text>
            </Sidenav.Item>
            <Sidenav.Divider />
            <Heading>Title</Heading>
            <Sidenav.Item isDisabled>
              <Icon>
                <Placeholder />
              </Icon>
              <Text>Nav item</Text>
            </Sidenav.Item>
            <Sidenav.Item>
              <Icon>
                <Placeholder />
              </Icon>
              <Text>Nav item</Text>
            </Sidenav.Item>
            <Sidenav.Item isSelected>
              <Icon>
                <Placeholder />
              </Icon>
              <Text>Nav item</Text>
            </Sidenav.Item>
          </Sidenav>
        </Drawer.Layout>
      </div>
    );
  },
};
