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

import { ChevronDown } from '@accelint/icons';
import 'client-only';
import { useContext, useRef } from 'react';
import {
  Button,
  composeRenderProps,
  DialogTrigger,
  Disclosure,
  DisclosurePanel,
  Heading,
  Popover,
} from 'react-aria-components';
import { Icon } from '../icon';
import { Tooltip } from '../tooltip';
import { TooltipTrigger } from '../tooltip/trigger';
import { SidenavContext } from './context';
import { SidenavStyles } from './styles';
import type { SidenavMenuProps } from './types';

const { menu, menuButton, menuPanel, panelContent, tooltip, transient } =
  SidenavStyles();

/**
 * SidenavMenu - Menu component for sidenav
 *
 * Provides a collapsible menu with items for the sidenav
 */
export function SidenavMenu({
  icon,
  title,
  classNames,
  children,
  ...rest
}: SidenavMenuProps) {
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
      <TooltipTrigger isDisabled={isOpen}>
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
      </TooltipTrigger>
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
