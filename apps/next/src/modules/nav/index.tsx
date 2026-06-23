/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

'use client';

import { uuid } from '@accelint/core';
import {
  Sidenav,
  SidenavHeader,
  SidenavContent,
  SidenavFooter,
  SidenavAvatar,
  SidenavLink,
  SidenavTrigger,
  SidenavItem,
  SidenavMenu,
  Icon,
  Button,
} from '@accelint/design-toolkit';
import { useTheme } from '@accelint/design-toolkit';
import {
  Brightness,
  ExpandLeftPanel,
  Grid,
  Waffle,
  GlobalShare,
  Newspaper,
} from '@accelint/icons';
import { Text } from 'react-aria-components';
import { Heading } from 'react-aria-components';
import { useRouter } from 'next/navigation';

const COMPONENTS = [
  { path: '/', label: 'All' },
  { path: '/accordion', label: 'Accordion' },
  { path: '/accordion-group', label: 'Accordion Group' },
  { path: '/action-bar', label: 'Action Bar' },
  { path: '/avatar', label: 'Avatar' },
  { path: '/badge', label: 'Badge' },
  { path: '/breadcrumbs', label: 'Breadcrumbs' },
  { path: '/button', label: 'Button' },
  { path: '/classification-badge', label: 'Classification Badge' },
  { path: '/classification-banner', label: 'Classification Banner' },
  { path: '/color-picker', label: 'Color Picker' },
  { path: '/dialog/client', label: 'Dialog' },
  { path: '/divider', label: 'Divider' },
  { path: '/drawer', label: 'Drawer' },
  { path: '/floating-card', label: 'Floating Card' },
  { path: '/hero', label: 'Hero' },
  { path: '/label', label: 'Label' },
  { path: '/link', label: 'Link' },
  { path: '/notice', label: 'Notice' },
  { path: '/tooltip', label: 'Tooltip' },
];

export const NAV_ID = uuid();

export function NavTrigger() {
  return (
    <SidenavTrigger for={NAV_ID}>
      <Button variant='icon' size='large'>
        <Icon>
          <ExpandLeftPanel />
        </Icon>
      </Button>
    </SidenavTrigger>
  );
}

export function Nav() {
  const { mode, toggleMode } = useTheme();
  const router = useRouter();

  return (
    <Sidenav id={NAV_ID}>
      <SidenavHeader>
        <SidenavAvatar>
          <Icon>
            <Waffle />
          </Icon>
          <Heading>App Examples</Heading>
          <Text>QA Review</Text>
        </SidenavAvatar>
      </SidenavHeader>
      <SidenavContent>
        <SidenavMenu
          icon={
            <Icon>
              <Grid />
            </Icon>
          }
          title='Components'
        >
          {COMPONENTS.map((link) => (
            <SidenavLink
              key={link.path}
              href={link.path}
              textValue={link.label}
            >
              <Text>{link.label}</Text>
            </SidenavLink>
          ))}
        </SidenavMenu>
        <SidenavItem
          key='Map'
          textValue='Map'
          onPress={() => router.push('/map')}
        >
          <Icon>
            <GlobalShare />
          </Icon>
          <Text>Map</Text>
        </SidenavItem>
        <SidenavItem textValue='Forms' onPress={() => router.push('/forms')}>
          <Icon>
            <Newspaper />
          </Icon>
          <Text>Forms</Text>
        </SidenavItem>
      </SidenavContent>
      <SidenavFooter>
        <SidenavItem
          textValue={mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
          onPress={() => toggleMode(mode === 'dark' ? 'light' : 'dark')}
        >
          <Icon>
            <Brightness />
          </Icon>
          <Text>{mode === 'dark' ? '☀️ Light' : '🌙 Dark'}</Text>
        </SidenavItem>
      </SidenavFooter>
    </Sidenav>
  );
}
