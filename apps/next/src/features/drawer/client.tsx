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

import { uuid } from '@accelint/core';
import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerHeaderTitle,
  DrawerLayout,
  DrawerMenu,
  DrawerMenuItem,
  DrawerPanel,
  DrawerTrigger,
  DrawerView,
} from '@accelint/design-toolkit';
import { useMemo } from 'react';

export function DrawerClient() {
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
    <div className='fg-primary-bold h-screen bg-surface-muted'>
      <DrawerLayout>
        <Drawer id={ids.drawer} placement='right' size='medium'>
          <DrawerMenu position='center'>
            <DrawerMenuItem toggle for={ids.viewA} textValue='View A'>
              A
            </DrawerMenuItem>
            <DrawerMenuItem toggle for={ids.viewB} textValue='View B'>
              B
            </DrawerMenuItem>
            <DrawerMenuItem toggle for={ids.viewC} textValue='View C'>
              C
            </DrawerMenuItem>
          </DrawerMenu>

          <DrawerPanel>
            <DrawerView id={ids.viewA}>
              <DrawerHeader>
                <DrawerHeaderTitle>View A</DrawerHeaderTitle>
                <DrawerClose />
              </DrawerHeader>
              <DrawerContent>
                <p>This is the content for View A.</p>
                <p>Navigate between views using the menu or buttons below.</p>
              </DrawerContent>
              <DrawerFooter>
                <DrawerTrigger for={ids.viewB}>
                  <Button variant='outline'>Go to View B</Button>
                </DrawerTrigger>
              </DrawerFooter>
            </DrawerView>

            <DrawerView id={ids.viewB}>
              <DrawerHeader>
                <DrawerHeaderTitle>View B</DrawerHeaderTitle>
                <DrawerClose />
              </DrawerHeader>
              <DrawerContent>
                <p>This is the content for View B.</p>
                <p>Each view can have its own content and actions.</p>
              </DrawerContent>
              <DrawerFooter>
                <DrawerTrigger for={ids.viewC}>
                  <Button variant='outline'>Go to View C</Button>
                </DrawerTrigger>
              </DrawerFooter>
            </DrawerView>

            <DrawerView id={ids.viewC}>
              <DrawerHeader>
                <DrawerHeaderTitle>View C</DrawerHeaderTitle>
                <DrawerClose />
              </DrawerHeader>
              <DrawerContent>
                <p>This is the content for View C.</p>
                <p>This is the final view in the navigation.</p>
              </DrawerContent>
              <DrawerFooter>Footer C</DrawerFooter>
            </DrawerView>
          </DrawerPanel>
        </Drawer>
      </DrawerLayout>
    </div>
  );
}
