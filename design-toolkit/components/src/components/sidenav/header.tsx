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

import { useEmit } from '@accelint/bus/react';
import { ChevronLeft } from '@accelint/icons';
import 'client-only';
import { useContext } from 'react';
import { Button, composeRenderProps, Header } from 'react-aria-components';
import { Icon } from '../icon';
import { SidenavContext } from './context';
import { SidenavEventTypes } from './events';
import { SidenavStyles } from './styles';
import type { SidenavHeaderProps, SidenavToggleEvent } from './types';

const { header, toggle, transient } = SidenavStyles();

/**
 * SidenavHeader - Header component for sidenav
 *
 * Provides a header with toggle button for the sidenav
 */
export function SidenavHeader({
  children,
  classNames,
  ...rest
}: SidenavHeaderProps) {
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
