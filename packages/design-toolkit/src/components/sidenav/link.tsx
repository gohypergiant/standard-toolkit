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

import { ArrowNortheast } from '@accelint/icons';
import 'client-only';
import { clsx } from '@accelint/design-foundation/lib/utils';
import { useContext, useRef } from 'react';
import {
  composeRenderProps,
  Link,
  Provider,
  TextContext,
} from 'react-aria-components';
import { Icon } from '../icon';
import { Tooltip } from '../tooltip';
import { TooltipTrigger } from '../tooltip/trigger';
import { SidenavContext } from './context';
import styles from './styles.module.css';
import type { SidenavLinkProps } from './types';

/**
 * SidenavLink - Link component for sidenav
 *
 * Provides a link with tooltip for the sidenav
 */
export function SidenavLink({
  children,
  classNames,
  textValue,
  ...rest
}: SidenavLinkProps) {
  const { isOpen } = useContext(SidenavContext);

  // Implement ref to place tooltip inside Link DOM to enable contextual styling
  const ref = useRef(null);

  return (
    <Provider
      values={[
        [TextContext, { className: clsx(styles.text, styles.transient) }],
      ]}
    >
      <TooltipTrigger isDisabled={isOpen}>
        <Link
          {...rest}
          ref={ref}
          className={composeRenderProps(classNames?.button, (className) =>
            clsx('group/link', styles.link, className),
          )}
        >
          {composeRenderProps(children, (children) => (
            <>
              {children}
              <Icon className={styles.transient}>
                <ArrowNortheast />
              </Icon>
            </>
          ))}
        </Link>
        <Tooltip parentRef={ref} placement='right' className={styles.tooltip}>
          {textValue}
          <Icon>
            <ArrowNortheast />
          </Icon>
        </Tooltip>
      </TooltipTrigger>
    </Provider>
  );
}
