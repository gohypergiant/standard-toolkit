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
import { useEmit, useOn } from '@accelint/bus/react';
import { isUUID, type UniqueId, uuid } from '@accelint/core';
import { ArrowNortheast, ChevronDown, ChevronLeft } from '@accelint/icons';
import { createContext, useContext, useRef, useState } from 'react';
import {
  Button,
  composeRenderProps,
  DEFAULT_SLOT,
  DialogTrigger,
  Disclosure,
  DisclosurePanel,
  Header,
  Heading,
  HeadingContext,
  Link,
  Popover,
  Pressable,
  Provider,
  Text,
  TextContext,
  ToggleButton,
} from 'react-aria-components';
import { containsAnyOfExactChildren, containsExactChildren } from '@/lib/react';
import { Avatar, AvatarContext } from '../avatar';
import { DividerContext } from '../divider';
import { Icon, IconContext } from '../icon';
import { Tooltip } from '../tooltip';
import { SidenavEventTypes } from './events';
import { SidenavStyles } from './styles';
import type {
  SidenavAvatarProps,
  SidenavCloseEvent,
  SidenavContentProps,
  SidenavContextValue,
  SidenavEvent,
  SidenavFooterProps,
  SidenavHeaderProps,
  SidenavItemProps,
  SidenavLinkProps,
  SidenavMenuItemProps,
  SidenavMenuProps,
  SidenavOpenEvent,
  SidenavProps,
  SidenavToggleEvent,
  SidenavTriggerProps,
} from './types';

const {
  sidenav,
  content,
  header,
  toggle,
  heading,
  divider,
  item,
  text,
  transient,
  avatar,
  avatarHeading,
  avatarIcon,
  avatarText,
  link,
  tooltip,
  menu,
  menuButton,
  menuHeading,
  menuPanel,
  menuItem,
  panelHeading,
  panelContent,
} = SidenavStyles();

const SidenavContext = createContext<SidenavContextValue>({
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
  containsExactChildren({
    children,
    componentName: Sidenav.displayName,
    restrictions: [
      [SidenavHeader, { min: 1, max: 1 }],
      [SidenavContent, { min: 1, max: 1 }],
      [SidenavFooter, { min: 0, max: 1 }],
    ],
  });
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
Sidenav.displayName = 'Sidenav';

function SidenavContent({ className, children, ...rest }: SidenavContentProps) {
  return (
    <Provider values={[[DividerContext, { className: divider() }]]}>
      <div {...rest} className={content({ className })}>
        {children}
      </div>
    </Provider>
  );
}
SidenavContent.displayName = 'Sidenav.Content';

function SidenavHeader({ children, classNames, ...rest }: SidenavHeaderProps) {
  const emit = useEmit<SidenavToggleEvent>(SidenavEventTypes.toggle);
  const { id } = useContext(SidenavContext);

  return (
    <Header {...rest} className={header({ className: classNames?.header })}>
      <Button
        className={composeRenderProps(classNames?.button, (className) =>
          toggle({ className }),
        )}
        onPress={() => emit({ id })}
      >
        {children}
        <Icon className={transient()}>
          <ChevronLeft />
        </Icon>
      </Button>
    </Header>
  );
}
SidenavHeader.displayName = 'Sidenav.Header';

function SidenavFooter(props: SidenavFooterProps) {
  return <footer {...props} />;
}
SidenavFooter.displayName = 'Sidenav.Footer';

function SidenavTrigger({ children, for: type, ...rest }: SidenavTriggerProps) {
  const [event, id] = (isUUID(type) ? ['toggle', type] : type.split(':')) as [
    'close' | 'open' | 'toggle',
    UniqueId,
  ];
  const emit = useEmit<SidenavEvent>(SidenavEventTypes[event]);

  return (
    <Pressable {...rest} onPress={() => emit({ id })}>
      {children}
    </Pressable>
  );
}
SidenavTrigger.displayName = 'Sidenav.Trigger';

function SidenavItem({
  children,
  classNames,
  textValue,
  ...rest
}: SidenavItemProps) {
  containsAnyOfExactChildren({
    children,
    componentName: SidenavItem.displayName,
    restrictions: [
      [[SidenavAvatar, { min: 1, max: 1 }]],
      [
        [Icon, { min: 1, max: 1 }],
        [Text, { min: 1, max: 1 }],
      ],
    ],
  });

  const { isOpen } = useContext(SidenavContext);

  // Implement ref to place tooltip inside Button DOM to enable contextual styling
  const ref = useRef(null);

  return (
    <Provider
      values={[
        [IconContext, { size: 'medium' }],
        [TextContext, { className: text({ className: transient() }) }],
      ]}
    >
      <Tooltip.Trigger isDisabled={isOpen}>
        <ToggleButton
          {...rest}
          ref={ref}
          className={composeRenderProps(classNames?.button, (className) =>
            item({ className }),
          )}
        >
          {children}
        </ToggleButton>
        <Tooltip parentRef={ref} placement='right' className={tooltip()}>
          {textValue}
        </Tooltip>
      </Tooltip.Trigger>
    </Provider>
  );
}
SidenavItem.displayName = 'Sidenav.Item';

function SidenavLink({
  children,
  classNames,
  textValue,
  ...rest
}: SidenavLinkProps) {
  containsExactChildren({
    children,
    componentName: SidenavLink.displayName,
    restrictions: [
      [Icon, { min: 1, max: 1 }],
      [Text, { min: 1, max: 1 }],
    ],
  });

  const { isOpen } = useContext(SidenavContext);

  // Implement ref to place tooltip inside Link DOM to enable contextual styling
  const ref = useRef(null);

  return (
    <Provider
      values={[[TextContext, { className: text({ className: transient() }) }]]}
    >
      <Tooltip.Trigger isDisabled={isOpen}>
        <Link
          {...rest}
          ref={ref}
          className={composeRenderProps(classNames?.button, (className) =>
            link({ className }),
          )}
        >
          {composeRenderProps(children, (children) => (
            <>
              {children}
              <Icon className={transient()}>
                <ArrowNortheast />
              </Icon>
            </>
          ))}
        </Link>
        <Tooltip parentRef={ref} placement='right' className={tooltip()}>
          {textValue}
          <Icon>
            <ArrowNortheast />
          </Icon>
        </Tooltip>
      </Tooltip.Trigger>
    </Provider>
  );
}
SidenavLink.displayName = 'Sidenav.Link';

function SidenavAvatar({ children, className, ...rest }: SidenavAvatarProps) {
  containsAnyOfExactChildren({
    children,
    componentName: SidenavAvatar.displayName,
    restrictions: [
      [
        [Avatar, { min: 1, max: 1 }],
        [Heading, { min: 1, max: 1 }],
        [Text, { min: 0, max: 1 }],
      ],
      [
        [Icon, { min: 1, max: 1 }],
        [Heading, { min: 1, max: 1 }],
        [Text, { min: 0, max: 1 }],
      ],
    ],
  });

  return (
    <Provider
      values={[
        [IconContext, { size: 'large', className: avatarIcon() }],
        [
          HeadingContext,
          { className: avatarHeading({ className: transient() }) },
        ],
        [TextContext, { className: avatarText({ className: transient() }) }],
        [AvatarContext, { classNames: { avatar: avatarIcon() } }],
      ]}
    >
      <div {...rest} className={avatar({ className })}>
        {children}
      </div>
    </Provider>
  );
}
SidenavAvatar.displayName = 'Sidenav.Avatar';

function SidenavMenu({
  icon,
  title,
  classNames,
  children,
  ...rest
}: SidenavMenuProps) {
  containsExactChildren({
    children,
    componentName: SidenavMenu.displayName,
    restrictions: [[SidenavMenuItem, { min: 2 }]],
  });

  const { isOpen } = useContext(SidenavContext);
  const ref = useRef(null);

  return isOpen ? (
    <Disclosure
      className={composeRenderProps(classNames?.menu, (className) =>
        menu({ className }),
      )}
    >
      <Button
        {...rest}
        slot='trigger'
        className={composeRenderProps(classNames?.button, (className) =>
          menuButton({ className }),
        )}
      >
        {icon}
        <Heading slot='menu'>{title}</Heading>
        <Icon className={transient({ className: classNames?.icon })}>
          <ChevronDown className='transform group-expanded/menu:rotate-180' />
        </Icon>
      </Button>
      <DisclosurePanel
        className={composeRenderProps(
          classNames?.disclosurePanel,
          (className) => className ?? '',
        )}
      >
        <div className={panelContent({ className: classNames?.panelContent })}>
          {children}
        </div>
      </DisclosurePanel>
    </Disclosure>
  ) : (
    <DialogTrigger>
      <Tooltip.Trigger isDisabled={isOpen}>
        <Button
          {...rest}
          ref={ref}
          className={composeRenderProps(classNames?.button, (className) =>
            menuButton({ className }),
          )}
        >
          {icon}
        </Button>
        <Tooltip parentRef={ref} placement='right' className={tooltip()}>
          {title}
        </Tooltip>
      </Tooltip.Trigger>
      <Popover
        className={composeRenderProps(classNames?.popoverPanel, (className) =>
          menuPanel({ className }),
        )}
        placement='right top'
        shouldFlip={false}
      >
        <Heading slot='panel'>{title}</Heading>
        <div className={panelContent({ className: classNames?.panelContent })}>
          {children}
        </div>
      </Popover>
    </DialogTrigger>
  );
}
SidenavMenu.displayName = 'Sidenav.Menu';

function SidenavMenuItem({
  className,
  children,
  ...rest
}: SidenavMenuItemProps) {
  containsExactChildren({
    children,
    componentName: SidenavMenuItem.displayName,
    restrictions: [[Text, { min: 1, max: 1 }]],
  });

  return (
    <ToggleButton
      {...rest}
      className={composeRenderProps(className, (className) =>
        menuItem({ className }),
      )}
    >
      {children}
    </ToggleButton>
  );
}
SidenavMenuItem.displayName = 'Sidenav.Menu.Item';

SidenavMenu.Item = SidenavMenuItem;

Sidenav.Trigger = SidenavTrigger;
Sidenav.Header = SidenavHeader;
Sidenav.Item = SidenavItem;
Sidenav.Link = SidenavLink;
Sidenav.Avatar = SidenavAvatar;
Sidenav.Footer = SidenavFooter;
Sidenav.Content = SidenavContent;
Sidenav.Menu = SidenavMenu;
