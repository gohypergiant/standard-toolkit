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
import { useContext, useRef } from 'react';
import {
  composeRenderProps,
  Provider,
  TextContext,
  ToggleButton,
} from 'react-aria-components';
import { IconContext } from '../icon/context';
import { Tooltip } from '../tooltip';
import { TooltipTrigger } from '../tooltip/trigger';
import { SidenavContext } from './context';
import { SidenavStyles } from './styles';
import type { SidenavItemProps } from './types';

const { item, text, transient, tooltip } = SidenavStyles();

/**
 * SidenavItem - Item component for sidenav
 *
 * Provides a selectable item with tooltip for the sidenav
 */
export function SidenavItem({
  children,
  classNames,
  textValue,
  ...rest
}: SidenavItemProps) {
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
      <TooltipTrigger isDisabled={isOpen}>
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
      </TooltipTrigger>
    </Provider>
  );
}
