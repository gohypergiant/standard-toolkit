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
import { ArrowNortheast, ChevronLeft } from '@accelint/icons';
import { createContext, createRef, useEffect, useState } from 'react';
import {
  Button,
  Header,
  Heading,
  HeadingContext,
  Pressable,
  Provider,
  Text,
  TextContext,
  ToggleButton,
} from 'react-aria-components';
import { containsAnyOfExactChildren, containsExactChildren } from '@/lib/react';
import { LinkButton } from '../button';
import { Icon, IconContext } from '../icon';
import { Tooltip } from '../tooltip';
import { SidenavEventTypes } from './events';
import { SidenavStyles } from './styles';
import type {
  SidenavAvatarProps,
  SidenavContentProps,
  SidenavContextValue,
  SidenavDividerProps,
  SidenavFooterProps,
  SidenavHeaderProps,
  SidenavItemProps,
  SidenavLinkProps,
  SidenavProps,
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
} = SidenavStyles();

const SidenavContext = createContext<SidenavContextValue | null>(null);

export function Sidenav({
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

  useOn(SidenavEventTypes.toggle, () => setOpen((prev) => !prev));

  if (isHiddenWhenClosed && !open) {
    return null;
  }

  return (
    <Provider
      values={[
        [HeadingContext, { className: heading({ className: transient() }) }],
        [SidenavContext, { open }],
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
  const emit = useEmit(SidenavEventTypes.toggle);

  return (
    <Header {...rest} className={header({ className: classNames?.header })}>
      <Button
        className={toggle({ className: classNames?.button })}
        onPress={() => emit()}
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

function SidenavTrigger({ children, ...rest }: SidenavTriggerProps) {
  const emit = useEmit(SidenavEventTypes.toggle);

  return (
    <Pressable {...rest} onPress={() => emit()}>
      {children}
    </Pressable>
  );
}
SidenavTrigger.displayName = 'Sidenav.Trigger';

function SidenavItem({ children, classNames, ...rest }: SidenavItemProps) {
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
  const ref = createRef<HTMLButtonElement>();
  const textRef = createRef<HTMLElement>();

  const [toolTipText, setTooltipText] = useState('');

  useEffect(() => {
    setTooltipText(textRef.current?.innerText ?? '');
  }, [textRef.current]);

  return (
    <Provider
      values={[
        [IconContext, { size: 'medium' }],
        [
          TextContext,
          { ref: textRef, className: text({ className: transient() }) },
        ],
      ]}
    >
      <Tooltip>
        <Tooltip.Trigger>
          <ToggleButton
            {...rest}
            ref={ref}
            className={item({ className: classNames?.button })}
          >
            {children}
          </ToggleButton>
        </Tooltip.Trigger>
        <Tooltip.Body parentRef={ref} placement='right' className={tooltip()}>
          {toolTipText}
        </Tooltip.Body>
      </Tooltip>
    </Provider>
  );
}
SidenavItem.displayName = 'Sidenav.Item';

function SidenavLink({ children, classNames, ...rest }: SidenavLinkProps) {
  containsExactChildren({
    children,
    componentName: SidenavLink.displayName,
    restrictions: [
      [Icon, { min: 1, max: 1 }],
      [Text, { min: 1, max: 1 }],
    ],
  });

  const ref = createRef<HTMLAnchorElement>();
  const textRef = createRef<HTMLElement>();

  const [toolTipText, setTooltipText] = useState('');

  useEffect(() => {
    setTooltipText(textRef.current?.innerText ?? '');
  }, [textRef.current]);

  return (
    <Provider
      values={[
        [IconContext, { size: 'medium', slot: 'icon' }],
        [
          TextContext,
          { ref: textRef, className: text({ className: transient() }) },
        ],
      ]}
    >
      <Tooltip>
        <Tooltip.Trigger>
          <LinkButton
            {...rest}
            ref={ref}
            variant='icon'
            className={link({ className: classNames?.button })}
          >
            <>
              {children}
              <Icon size='medium' className={transient()}>
                <ArrowNortheast />
              </Icon>
            </>
          </LinkButton>
        </Tooltip.Trigger>
        <Tooltip.Body parentRef={ref} placement='right' className={tooltip()}>
          {toolTipText}
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
  containsExactChildren({
    children,
    componentName: SidenavAvatar.displayName,
    restrictions: [
      [Icon, { min: 1, max: 1 }],
      [Heading, { min: 1, max: 1 }],
      [Text, { min: 1, max: 1 }],
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
      ]}
    >
      <div {...rest} className={avatar({ className })}>
        {children}
      </div>
    </Provider>
  );
}
SidenavAvatar.displayName = 'Sidenav.Avatar';

Sidenav.Trigger = SidenavTrigger;
Sidenav.Header = SidenavHeader;
Sidenav.Item = SidenavItem;
Sidenav.Link = SidenavLink;
Sidenav.Divider = SidenavDivider;
Sidenav.Avatar = SidenavAvatar;
Sidenav.Footer = SidenavFooter;
Sidenav.Content = SidenavContent;
