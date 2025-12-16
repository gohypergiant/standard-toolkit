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

import { ActionBar, Button, Icon } from '@accelint/design-toolkit';
import PlaceholderIcon from '@accelint/icons/placeholder';
import { useState } from 'react';
import { useStressTest } from '~/memlab/hooks/use-stress-test';
import { getTestId } from '~/test/get-test-id';
import { PROP_COMBOS } from './variants';

/**
 * MemLab Test Page: ActionBar Component
 *
 * This page provides test scenarios for memory leak detection in the ActionBar component.
 * It supports three testing modes:
 * 1. Mount/Unmount - Single show/hide cycle
 * 2. User Flow - Button interactions
 * 3. Stress Test - Rapid mount/unmount cycles
 */
export function ActionBarExample() {
  const [clickCount, setClickCount] = useState(0);

  const {
    isRunning: isStressTesting,
    currentCycle: stressTestCount,
    totalCycles,
    run: runStressTest,
    visible: showActionBars,
    toggle: toggleActionBars,
  } = useStressTest({ cycles: 20, delay: 25 });

  return (
    <div
      data-testid='memlab-action-bar-test'
      className='flex h-screen flex-col items-center justify-center gap-8 bg-surface-muted p-8'
    >
      <h1 className='text-xl font-bold'>ActionBar Memory Leak Test</h1>

      {/* Test Controls */}
      <div className='flex gap-4'>
        <Button data-testid='toggle-action-bars' onPress={toggleActionBars}>
          {showActionBars ? 'Hide ActionBars' : 'Show ActionBars'}
        </Button>

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

      {/* Test Subject: ActionBars */}
      {showActionBars && (
        <div
          data-testid='action-bar-container'
          className='flex flex-col gap-4 rounded-lg border border-surface-inverse p-6'
        >
          {PROP_COMBOS.map((props, k) => (
            <div
              key={getTestId('action-bar', props)}
              className='flex flex-col gap-2'
            >
              <span className='text-sm font-medium'>Size: {props.size}</span>
              <ActionBar
                data-testid={getTestId('action-bar', props)}
                {...props}
              >
                <Button onPress={() => setClickCount((c) => c + 1)}>
                  <Icon>
                    <PlaceholderIcon />
                  </Icon>
                </Button>
                <Button onPress={() => setClickCount((c) => c + 1)}>
                  <Icon>
                    <PlaceholderIcon />
                  </Icon>
                </Button>
                <Button onPress={() => setClickCount((c) => c + 1)}>
                  <Icon>
                    <PlaceholderIcon />
                  </Icon>
                </Button>
              </ActionBar>
            </div>
          ))}
        </div>
      )}

      <p className='text-sm text-surface-inverse'>
        Click count: {clickCount} | ActionBars visible:{' '}
        {showActionBars ? 'Yes' : 'No'}
      </p>
    </div>
  );
}
