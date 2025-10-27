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
import { type ComponentPropsWithRef, useContext } from 'react';
import { Header, Heading } from 'react-aria-components';
import { ViewStackContext } from '../view-stack';
import { DrawerStyles, DrawerTitleStyles } from './styles';
import { DrawerBack, DrawerClose } from './trigger';
import type { DrawerTitleProps } from './types';

const { header } = DrawerStyles();

/**
 * To change size of title, use the `level` prop: `1`-`3` (large), `4`-`6` (medium).
 *
 * `level` also changes the semantic heading tag number `h1`-`h6`
 */
export function DrawerHeaderTitle({
  className,
  level,
  ...rest
}: DrawerTitleProps) {
  return (
    <Heading
      {...rest}
      className={DrawerTitleStyles({ className, level })}
      level={level}
    />
  );
}

export function DrawerHeader({
  className,
  title,
  children,
  ...rest
}: ComponentPropsWithRef<'header'>) {
  const { stack } = useContext(ViewStackContext);
  const level = stack.length > 1 ? 4 : 1;

  return (
    <Header {...rest} className={header({ className })}>
      {title ? (
        <>
          <DrawerBack />
          <DrawerHeaderTitle level={level} className='w-fit'>
            {title}
          </DrawerHeaderTitle>
          <DrawerClose />
        </>
      ) : (
        children
      )}
    </Header>
  );
}
