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

import {
  Button,
  Dialog,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@accelint/design-toolkit';
import { useStressTest } from '~/memlab/hooks/use-stress-test';
import { PROP_COMBOS } from './variants';

/**
 * MemLab Test Page: Dialog Component
 *
 * This page provides test scenarios for memory leak detection in the Dialog component.
 * Dialog uses portals and modal overlays which are prone to memory leaks if not
 * properly cleaned up.
 */
export function DialogExample() {
  const {
    isRunning: isStressTesting,
    currentCycle: stressTestCount,
    totalCycles,
    run: runStressTest,
    visible: isOpen,
    setVisible: setIsOpen,
  } = useStressTest({ cycles: 10, delay: 100, initialVisible: false });

  return (
    <div
      data-testid='memlab-dialog-test'
      className='flex h-screen flex-col items-center justify-center gap-8 bg-surface-muted p-8'
    >
      <h1 className='text-xl font-bold'>Dialog Memory Leak Test</h1>

      {/* Test Controls */}
      <div className='flex gap-4'>
        <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
          <Button data-testid='toggle-dialog'>Open Dialog</Button>
          <Dialog>
            {({ close }) => (
              <>
                <DialogTitle>Test Dialog</DialogTitle>
                <div data-testid='dialog-content' className='p-4'>
                  <p>
                    This dialog content should be properly cleaned up on close.
                  </p>
                  <p>
                    Modal overlays use portals which can leak memory if not
                    handled correctly.
                  </p>
                </div>
                <DialogFooter>
                  <Button
                    variant='outline'
                    onPress={close}
                    data-testid='close-dialog'
                  >
                    Cancel
                  </Button>
                  <Button onPress={close}>Confirm</Button>
                </DialogFooter>
              </>
            )}
          </Dialog>
        </DialogTrigger>

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

      {/* Different dialog sizes */}
      <div className='flex gap-4'>
        {PROP_COMBOS.map((props) => (
          <DialogTrigger key={props.size}>
            <Button data-testid={`dialog-${props.size}`} variant='outline'>
              {props.size} Dialog
            </Button>
            <Dialog size={props.size}>
              {({ close }) => (
                <>
                  <DialogTitle>{props.size} Dialog</DialogTitle>
                  <div className='p-4'>{props.size} size content</div>
                  <DialogFooter>
                    <Button onPress={close}>Close</Button>
                  </DialogFooter>
                </>
              )}
            </Dialog>
          </DialogTrigger>
        ))}
      </div>

      <p className='text-sm text-surface-inverse'>
        Dialog open: {isOpen ? 'Yes' : 'No'}
      </p>
    </div>
  );
}
