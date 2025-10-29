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
import { Header } from 'react-aria-components';
import { ViewStackContext } from '../view-stack/context';
import { DrawerBack } from './back';
import { DrawerClose } from './close';
import { DrawerHeaderTitle } from './header-title';
import { DrawerStyles } from './styles';

const { header } = DrawerStyles();

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
