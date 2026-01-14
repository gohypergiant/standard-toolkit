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
  DrawerLayoutMain,
  DrawerMenu,
  DrawerMenuItem,
  DrawerPanel,
  DrawerTrigger,
  DrawerView,
} from '@accelint/design-toolkit';
import { useMemo } from 'react';
import { useStressTest } from '~/memlab/hooks/use-stress-test';

/**
 * MemLab Test Page: Drawer Component
 *
 * This page provides test scenarios for memory leak detection in the Drawer component.
 * It supports three testing modes:
 * 1. Mount/Unmount - Single open/close cycle
 * 2. User Flow - Navigation between multiple views
 * 3. Stress Test - Rapid open/close cycles
 */
export function DrawerExample() {
  const ids = useMemo(
    () => ({
      drawer: uuid(),
      viewA: uuid(),
      viewB: uuid(),
      viewC: uuid(),
    }),
    [],
  );

  const {
    isRunning: isStressTesting,
    currentCycle: stressTestCount,
    totalCycles,
    run: runStressTest,
    visible: showDrawer,
    toggle: toggleDrawer,
  } = useStressTest({ cycles: 10, delay: 50 });

  return (
    <div
      data-testid='memlab-drawer-test'
      className='fg-primary-bold h-screen bg-surface-muted'
    >
      <DrawerLayout>
        <DrawerLayoutMain>
          <div className='flex h-full flex-col items-center justify-center gap-4 p-8'>
            <h1 className='text-xl font-bold'>Drawer Memory Leak Test</h1>

            <div className='flex gap-4'>
              {/* Toggle drawer visibility */}
              <Button data-testid='toggle-drawer' onPress={toggleDrawer}>
                {showDrawer ? 'Hide Drawer' : 'Show Drawer'}
              </Button>

              {/* Open drawer trigger - only when drawer is mounted */}
              {showDrawer && (
                <DrawerTrigger for={`open:${ids.viewA}`}>
                  <Button data-testid='open-drawer'>Open Drawer</Button>
                </DrawerTrigger>
              )}

              {/* Stress test button */}
              <Button
                data-testid='stress-test'
                onPress={runStressTest}
                isDisabled={isStressTesting}
              >
                {isStressTesting
                  ? `Stress Testing (${stressTestCount}/${totalCycles})...`
                  : `Stress Test (${totalCycles} cycles)`}
              </Button>
            </div>

            <p className='text-sm text-surface-inverse'>
              Drawer mounted: {showDrawer ? 'Yes' : 'No'}
            </p>
          </div>
        </DrawerLayoutMain>

        {showDrawer && (
          <Drawer
            id={ids.drawer}
            defaultView={undefined}
            placement='right'
            size='medium'
          >
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
                  <DrawerClose data-testid='close-drawer' id={ids.viewA} />
                </DrawerHeader>
                <DrawerContent data-testid='drawer-content'>
                  <p>This is the content for View A.</p>
                  <p>Navigate between views to test memory cleanup.</p>
                </DrawerContent>
                <DrawerFooter>
                  <DrawerTrigger for={ids.viewB}>
                    <Button variant='outline' data-testid='navigate-to-b'>
                      Go to View B
                    </Button>
                  </DrawerTrigger>
                </DrawerFooter>
              </DrawerView>

              <DrawerView id={ids.viewB}>
                <DrawerHeader>
                  <DrawerHeaderTitle>View B</DrawerHeaderTitle>
                  <DrawerClose id={ids.viewB} />
                </DrawerHeader>
                <DrawerContent>
                  <p>This is the content for View B.</p>
                  <p>
                    Each view should properly clean up when navigating away.
                  </p>
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
                  <DrawerClose id={ids.viewC} />
                </DrawerHeader>
                <DrawerContent>
                  <p>This is the content for View C.</p>
                  <p>Final view in the navigation stack.</p>
                </DrawerContent>
                <DrawerFooter>Footer C</DrawerFooter>
              </DrawerView>
            </DrawerPanel>
          </Drawer>
        )}
      </DrawerLayout>
    </div>
  );
}
