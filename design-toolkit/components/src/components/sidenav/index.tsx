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

import { useOn } from '@accelint/bus/react';
import 'client-only';
import { useState } from 'react';
import { DEFAULT_SLOT, HeadingContext, Provider } from 'react-aria-components';
import { SidenavContext } from './context';
import { SidenavEventTypes } from './events';
import { SidenavStyles } from './styles';
import type {
  SidenavCloseEvent,
  SidenavOpenEvent,
  SidenavProps,
  SidenavToggleEvent,
} from './types';

const { sidenav, heading, transient, menuHeading, panelHeading } =
  SidenavStyles();

/**
 * Sidenav - Collapsible side navigation panel
 *
 * Provides a hierarchical collapsible side navigation intended to be used
 * inside a DrawerLayout. Supports headers, avatars, nested menus, and items.
 *
 * @example
 * <DrawerLayout push="left">
 *   <DrawerLayoutMain className="col-start-2">
 *     <SidenavTrigger>
 *       <Button variant="icon" size="large">
 *         <Icon>
 *           <MenuIcon />
 *         </Icon>
 *       </Button>
 *     </SidenavTrigger>
 *   </DrawerLayoutMain>
 *   <Sidenav>
 *     <SidenavHeader>
 *       <SidenavAvatar>
 *         <Icon><AppLogo /></Icon>
 *         <Heading>Application Header</Heading>
 *         <Text>subheader</Text>
 *       </SidenavAvatar>
 *     </SidenavHeader>
 *     <SidenavContent>
 *       <Heading>Navigation</Heading>
 *       <SidenavItem>
 *         <Icon><HomeIcon /></Icon>
 *         <Text>Home</Text>
 *       </SidenavItem>
 *       <Divider />
 *       <SidenavItem isSelected>
 *         <Icon><SettingsIcon /></Icon>
 *         <Text>Settings</Text>
 *       </SidenavItem>
 *       <Divider />
 *       <SidenavMenu title="More Options" icon={<Icon><MenuIcon /></Icon>}>
 *         <SidenavMenuItem>
 *           <Text>Sub Item 1</Text>
 *         </SidenavMenuItem>
 *         <SidenavMenuItem>
 *           <Text>Sub Item 2</Text>
 *         </SidenavMenuItem>
 *       </SidenavMenu>
 *     </SidenavContent>
 *     <SidenavFooter>
 *       <SidenavAvatar>
 *         <Icon><UserIcon /></Icon>
 *         <Heading>User Name</Heading>
 *         <Text>john@example.com</Text>
 *       </SidenavAvatar>
 *     </SidenavFooter>
 *   </Sidenav>
 * </DrawerLayout>
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
