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
'use client';

import 'client-only';
import { useOn } from '@accelint/bus/react';
import { uuid } from '@accelint/core';
import { createContext, useState } from 'react';
import { DEFAULT_SLOT, HeadingContext, Provider } from 'react-aria-components';
import { SidenavEventTypes } from './events';
import { SidenavStyles } from './styles';
import type {
  SidenavCloseEvent,
  SidenavContextValue,
  SidenavOpenEvent,
  SidenavProps,
  SidenavToggleEvent,
} from './types';

const { sidenav, heading, transient, menuHeading, panelHeading } =
  SidenavStyles();

export const SidenavContext = createContext<SidenavContextValue>({
  id: uuid(),
  isOpen: false,
});

/**
 * Sidenav - Collapsible side navigation panel
 *
 * Provides a hierarchical collapsible side navigation intended to be used
 * inside a Drawer.Layout. Supports headers, avatars, nested menus, and items.
 *
 * @example
 * <Drawer.Layout push="left">
 *   <Drawer.Layout.Main className="col-start-2">
 *     <Sidenav.Trigger>
 *       <Button variant="icon" size="large">
 *         <Icon>
 *           <MenuIcon />
 *         </Icon>
 *       </Button>
 *     </Sidenav.Trigger>
 *   </Drawer.Layout.Main>
 *   <Sidenav>
 *     <Sidenav.Header>
 *       <Sidenav.Avatar>
 *         <Icon><AppLogo /></Icon>
 *         <Heading>Application Header</Heading>
 *         <Text>subheader</Text>
 *       </Sidenav.Avatar>
 *     </Sidenav.Header>
 *     <Sidenav.Content>
 *       <Heading>Navigation</Heading>
 *       <Sidenav.Item>
 *         <Icon><HomeIcon /></Icon>
 *         <Text>Home</Text>
 *       </Sidenav.Item>
 *       <Divider />
 *       <Sidenav.Item isSelected>
 *         <Icon><SettingsIcon /></Icon>
 *         <Text>Settings</Text>
 *       </Sidenav.Item>
 *       <Divider />
 *       <Sidenav.Menu title="More Options" icon={<Icon><MenuIcon /></Icon>}>
 *         <Sidenav.Menu.Item>
 *           <Text>Sub Item 1</Text>
 *         </Sidenav.Menu.Item>
 *         <Sidenav.Menu.Item>
 *           <Text>Sub Item 2</Text>
 *         </Sidenav.Menu.Item>
 *       </Sidenav.Menu>
 *     </Sidenav.Content>
 *     <Sidenav.Footer>
 *       <Sidenav.Avatar>
 *         <Icon><UserIcon /></Icon>
 *         <Heading>User Name</Heading>
 *         <Text>john@example.com</Text>
 *       </Sidenav.Avatar>
 *     </Sidenav.Footer>
 *   </Sidenav>
 * </Drawer.Layout>
 */
export function Sidenav({
  id,
  className,
  isHiddenWhenClosed,
  children,
  ...rest
}: SidenavProps) {
  const [isOpen, setIsOpen] = useState(false);

  useOn(SidenavEventTypes.toggle, (data: SidenavToggleEvent) => {
    if (data.payload.id === id) {
      setIsOpen((prev) => !prev);
    }
  });

  useOn(SidenavEventTypes.open, (data: SidenavOpenEvent) => {
    if (!isOpen && data.payload.id === id) {
      setIsOpen(true);
    }
  });

  useOn(SidenavEventTypes.close, (data: SidenavCloseEvent) => {
    if (isOpen && data.payload.id === id) {
      setIsOpen(false);
    }
  });

  if (isHiddenWhenClosed && !isOpen) {
    return null;
  }

  return (
    <Provider
      values={[
        [
          HeadingContext,
          {
            slots: {
              [DEFAULT_SLOT]: {
                className: heading({ className: transient() }),
              },
              menu: { className: menuHeading({ className: transient() }) },
              panel: { className: panelHeading() },
            },
          },
        ],
        [SidenavContext, { id, isOpen }],
      ]}
    >
      <nav
        {...rest}
        className={sidenav({ className })}
        data-open={isOpen || null}
      >
        {children}
      </nav>
    </Provider>
  );
}
