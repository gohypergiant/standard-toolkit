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
import { ChevronRight } from '@accelint/icons';
import {
  Breadcrumbs as AriaBreadcrumbs,
  Breadcrumb,
  type BreadcrumbProps,
  type BreadcrumbsProps,
  composeRenderProps,
  Link,
} from 'react-aria-components';
import { containsExactChildren } from '@/lib/react';
import { Icon } from '../icon';
import { BreadcrumbsStyles } from './styles';
import type { BreadcrumbItemProps } from './types';

const { list, item, link, separator } = BreadcrumbsStyles();

/**
 * Breadcrumbs - Accessible breadcrumb navigation
 *
 * Displays the user's location within an application hierarchy and provides
 * links back to parent pages. The final item represents the current page.
 *
 * @example
 * <Breadcrumbs>
 *   <Breadcrumbs.Item linkProps={{ href: '/' }}>Home</Breadcrumbs.Item>
 *   <Breadcrumbs.Item>Current</Breadcrumbs.Item>
 * </Breadcrumbs>
 */
export function Breadcrumbs({
  children,
  className,
}: BreadcrumbsProps<BreadcrumbProps>) {
  containsExactChildren({
    children,
    componentName: Breadcrumbs.displayName,
    restrictions: [[BreadcrumbItem, { min: 1 }]],
  });

  return (
    <AriaBreadcrumbs className={list({ className })}>
      {children}
    </AriaBreadcrumbs>
  );
}
Breadcrumbs.displayName = 'Breadcrumbs';

function BreadcrumbItem({
  children,
  classNames,
  linkProps,
  ...rest
}: BreadcrumbItemProps) {
  return (
    <Breadcrumb
      {...rest}
      className={composeRenderProps(classNames?.item, (className) =>
        item({ className }),
      )}
    >
      {composeRenderProps(linkProps ? null : children, (itemChildren) => (
        <>
          {linkProps ? (
            <Link
              {...linkProps}
              className={composeRenderProps(classNames?.link, (className) =>
                link({ className }),
              )}
            >
              {children}
            </Link>
          ) : (
            itemChildren
          )}
          <Icon
            aria-hidden='true'
            className={separator({ className: classNames?.separator })}
          >
            <ChevronRight />
          </Icon>
        </>
      ))}
    </Breadcrumb>
  );
}
BreadcrumbItem.displayName = 'Breadcrumbs.Item';

Breadcrumbs.Item = BreadcrumbItem;
