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
import { isUUID, type UniqueId } from '@accelint/core';
import { ArrowNortheast, ChevronDown, ChevronLeft } from '@accelint/icons';
import { createContext, useContext, useRef, useState } from 'react';
import {
  Button,
  composeRenderProps,
  DEFAULT_SLOT,
  Disclosure,
  DisclosurePanel,
  Header,
  Heading,
  HeadingContext,
  Link,
  Pressable,
  Provider,
  Text,
  TextContext,
  ToggleButton,
} from 'react-aria-components';
import { containsAnyOfExactChildren, containsExactChildren } from '@/lib/react';
import { Avatar, AvatarContext } from '../avatar';
import { Icon, IconContext } from '../icon';
import { Tooltip } from '../tooltip';
import { SidenavEventTypes } from './events';
import { SidenavStyles } from './styles';
import type {
  SidenavAvatarProps,
  SidenavCloseEvent,
  SidenavContentProps,
  SidenavContextValue,
  SidenavDividerProps,
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

const SidenavContext = createContext<SidenavContextValue>({ open: false });

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
  const [open, setOpen] = useState(false);

  useOn(SidenavEventTypes.toggle, (data: SidenavToggleEvent) => {
    if (data.payload.id === id) {
      setOpen((prev) => !prev);
    }
  });

  useOn(SidenavEventTypes.open, (data: SidenavOpenEvent) => {
    if (!open && data.payload.id === id) {
      setOpen(() => true);
    }
  });

  useOn(SidenavEventTypes.close, (data: SidenavCloseEvent) => {
    if (open && data.payload.id === id) {
      setOpen(() => false);
    }
  });

  if (isHiddenWhenClosed && !open) {
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
        [SidenavContext, { open, id }],
      ]}
    >
      <nav
        {...rest}
        className={sidenav({ className })}
        data-open={open || null}
      >
        {children}
      </nav>
    </Provider>
  );
}
Sidenav.displayName = 'Sidenav';

function SidenavContent({ className, children, ...rest }: SidenavContentProps) {
  return (
    <div {...rest} className={content({ className })}>
      {children}
    </div>
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
        onPress={() => emit({ id: id as UniqueId })}
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

function SidenavTrigger({
  children,
  for: events,
  ...rest
}: SidenavTriggerProps) {
  let [event, id] = events.split(':') as [
    keyof typeof SidenavEventTypes,
    UniqueId | undefined,
  ];
  if (isUUID(event)) {
    id = event;
    event = 'toggle';
  }

  if (!id) {
    throw new Error('Sidenav.Trigger requires a target UniqueId');
  }

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
      [[Text, { min: 1, max: 1 }]],
      [
        [Icon, { min: 1, max: 1 }],
        [Text, { min: 1, max: 1 }],
      ],
    ],
  });

  const { open } = useContext(SidenavContext);

  // Implement ref to place tooltip inside Button DOM to enable contextual styling
  const ref = useRef(null);

  return (
    <Provider
      values={[
        [IconContext, { size: 'medium' }],
        [TextContext, { className: text({ className: transient() }) }],
      ]}
    >
      <Tooltip isDisabled={open}>
        <Tooltip.Trigger>
          <ToggleButton
            {...rest}
            ref={ref}
            className={composeRenderProps(classNames?.button, (className) =>
              item({ className }),
            )}
          >
            {children}
          </ToggleButton>
        </Tooltip.Trigger>
        <Tooltip.Body parentRef={ref} placement='right' className={tooltip()}>
          {textValue}
        </Tooltip.Body>
      </Tooltip>
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

  const { open } = useContext(SidenavContext);

  // Implement ref to place tooltip inside Link DOM to enable contextual styling
  const ref = useRef(null);

  return (
    <Provider
      values={[
        [IconContext, { size: 'medium', slot: 'icon' }],
        [TextContext, { className: text({ className: transient() }) }],
      ]}
    >
      <Tooltip isDisabled={open}>
        <Tooltip.Trigger>
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
                <Icon size='medium' className={transient()}>
                  <ArrowNortheast />
                </Icon>
              </>
            ))}
          </Link>
        </Tooltip.Trigger>
        <Tooltip.Body parentRef={ref} placement='right' className={tooltip()}>
          {textValue}
          <Icon size='medium'>
            <ArrowNortheast />
          </Icon>
        </Tooltip.Body>
      </Tooltip>
    </Provider>
  );
}
SidenavLink.displayName = 'Sidenav.Link';

function SidenavDivider({ className, ...rest }: SidenavDividerProps) {
  return <hr {...rest} className={divider({ className })} />;
}
SidenavDivider.displayName = 'Sidenav.Divider';

function SidenavAvatar({ children, className, ...rest }: SidenavAvatarProps) {
  containsAnyOfExactChildren({
    children,
    componentName: SidenavAvatar.displayName,
    restrictions: [
      [
        [Avatar, { min: 1, max: 1 }],
        [Heading, { min: 1, max: 1 }],
        [Text, { min: 1, max: 1 }],
      ],
      [
        [Icon, { min: 1, max: 1 }],
        [Heading, { min: 1, max: 1 }],
        [Text, { min: 1, max: 1 }],
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
        [AvatarContext, { classNames: { avatar: '[grid-area:content]' } }],
      ]}
    >
      <div {...rest} className={avatar({ className })}>
        {children}
      </div>
    </Provider>
  );
}
SidenavAvatar.displayName = 'Sidenav.Avatar';

function SidenavMenu({ icon, title, classNames, children }: SidenavMenuProps) {
  return (
    <Disclosure
      className={composeRenderProps(classNames?.menu, (className) =>
        menu({ className }),
      )}
    >
      <Button
        slot='trigger'
        className={composeRenderProps(classNames?.button, (className) =>
          menuButton({ className }),
        )}
      >
        {icon}
        <Heading slot='menu'>{title}</Heading>
        <Icon className={transient({ className: classNames?.icon })}>
          <ChevronDown className='transform group-expanded/accordion:rotate-180' />
        </Icon>
      </Button>

      <DisclosurePanel
        className={composeRenderProps(classNames?.panel, (className) =>
          menuPanel({ className }),
        )}
      >
        <Heading slot='panel'>{title}</Heading>
        <div className={panelContent({ className: classNames?.panelContent })}>
          {children}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
SidenavMenu.displayName = 'Sidenav.Menu';

function SidenavMenuItem({
  className,
  children,
  ...rest
}: SidenavMenuItemProps) {
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
Sidenav.Divider = SidenavDivider;
Sidenav.Avatar = SidenavAvatar;
Sidenav.Footer = SidenavFooter;
Sidenav.Content = SidenavContent;
Sidenav.Menu = SidenavMenu;
