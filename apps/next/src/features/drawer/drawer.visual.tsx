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

import { uuid } from '@accelint/core';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerHeaderTitle,
  DrawerLayout,
  DrawerLayoutMain,
  DrawerMenu,
  DrawerMenuItem,
  DrawerPanel,
  DrawerView,
} from '@accelint/design-toolkit';
import { useMemo } from 'react';
import { createVisualTestScenarios } from '~/visual-regression/vitest';
import { type DrawerVariant, PROP_COMBOS } from './variants';

function DrawerVariantComponent({ variant }: { variant: DrawerVariant }) {
  const ids = useMemo(
    () => ({
      drawer: uuid(),
      viewA: uuid(),
      viewB: uuid(),
      viewC: uuid(),
    }),
    [],
  );
  return (
    <DrawerLayout className='bg-surface-muted relative min-h-[600px] min-w-[800px]'>
      <Drawer
        id={ids.drawer}
        placement={variant.placement}
        size='medium'
        defaultView={ids.viewA}
      >
        <DrawerMenu position={variant.menuPosition}>
          <DrawerMenuItem toggle for={ids.viewA} textValue='Item A'>
            A
          </DrawerMenuItem>
          <DrawerMenuItem toggle for={ids.viewB} textValue='Item B'>
            B
          </DrawerMenuItem>
          <DrawerMenuItem toggle for={ids.viewC} textValue='Item C'>
            C
          </DrawerMenuItem>
        </DrawerMenu>

        <DrawerPanel>
          <DrawerView id={ids.viewA}>
            <DrawerHeader>
              <DrawerHeaderTitle>
                {variant.placement} / {variant.menuPosition}
              </DrawerHeaderTitle>
              <DrawerClose />
            </DrawerHeader>
            <DrawerContent>
              <p className='fg-primary'>
                Drawer placement: <strong>{variant.placement}</strong>
              </p>
              <p className='fg-primary'>
                Menu position: <strong>{variant.menuPosition}</strong>
              </p>
            </DrawerContent>
          </DrawerView>
          <DrawerView id={ids.viewB}>
            <DrawerHeader>
              <DrawerHeaderTitle>View B</DrawerHeaderTitle>
              <DrawerClose />
            </DrawerHeader>
            <DrawerContent>
              <p className='fg-primary'>Content for View B</p>
            </DrawerContent>
          </DrawerView>
          <DrawerView id={ids.viewC}>
            <DrawerHeader>
              <DrawerHeaderTitle>View C</DrawerHeaderTitle>
              <DrawerClose />
            </DrawerHeader>
            <DrawerContent>
              <p className='fg-primary'>Content for View C</p>
            </DrawerContent>
          </DrawerView>
        </DrawerPanel>
      </Drawer>

      <DrawerLayoutMain>
        <div className='flex h-full items-center justify-center'>
          Main Content Area
        </div>
      </DrawerLayoutMain>
    </DrawerLayout>
  );
}

createVisualTestScenarios(
  'Drawer',
  PROP_COMBOS.map((variant) => ({
    name: `${variant.placement} placement, ${variant.menuPosition} menu`,
    render: () => <DrawerVariantComponent variant={variant} />,
    screenshotName: `drawer-${variant.placement}-menu-${variant.menuPosition}.png`,
    waitMs: 200,
  })),
);
