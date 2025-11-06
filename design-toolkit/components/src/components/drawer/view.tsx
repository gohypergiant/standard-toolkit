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
import { type ComponentPropsWithRef, useContext, useEffect } from 'react';
import { ViewStackView } from '../view-stack/view';
import { DrawerContext } from './context';
import { DrawerStyles } from './styles';
import type { ViewStackViewProps } from '../view-stack/types';

const { view } = DrawerStyles();

export function DrawerView({
  id,
  children,
  className,
  ...rest
}: ViewStackViewProps & ComponentPropsWithRef<'div'>) {
  const { register, unregister } = useContext(DrawerContext);

  useEffect(() => {
    register(id);

    return () => unregister(id);
  }, [register, unregister, id]);

  return (
    <ViewStackView id={id}>
      <div {...rest} className={view({ className })} role='tabpanel'>
        {children}
      </div>
    </ViewStackView>
  );
}
