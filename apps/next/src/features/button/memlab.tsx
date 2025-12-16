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

import { Button, Icon } from '@accelint/design-toolkit';
import PlaceholderIcon from '@accelint/icons/placeholder';
import { useState } from 'react';
import { useStressTest } from '~/memlab/hooks/use-stress-test';
import { getTestId } from '~/test/get-test-id';
import { PROP_COMBOS } from './variants';

/**
 * MemLab Test Page: Button Component
 *
 * This page provides test scenarios for memory leak detection in the Button component.
 * It supports three testing modes:
 * 1. Mount/Unmount - Single show/hide cycle
 * 2. User Flow - Click interactions and state changes
 * 3. Stress Test - Rapid mount/unmount cycles
 */
export function ButtonExample() {
  const [clickCount, setClickCount] = useState(0);

  const {
    isRunning: isStressTesting,
    currentCycle: stressTestCount,
    totalCycles,
    run: runStressTest,
    visible: showButtons,
    toggle: toggleButtons,
  } = useStressTest({ cycles: 20, delay: 25 });

  return (
    <div
      data-testid='memlab-button-test'
      className='flex h-screen flex-col items-center justify-center gap-8 bg-surface-muted p-8'
    >
      <h1 className='text-xl font-bold'>Button Memory Leak Test</h1>

      {/* Test Controls */}
      <div className='flex gap-4'>
        <Button data-testid='toggle-buttons' onPress={toggleButtons}>
          {showButtons ? 'Hide Buttons' : 'Show Buttons'}
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

      {/* Test Subject: Buttons */}
      {showButtons && (
        <div
          data-testid='button-container'
          className='flex flex-wrap gap-4 rounded-lg border border-surface-inverse p-6'
        >
          {PROP_COMBOS.map((props, k) => {
            const isIconVariant = props.variant === 'icon';
            const isFirstFilled = k === 0;
            return (
              <Button
                key={getTestId('button', props)}
                data-testid={getTestId('button', props)}
                {...props}
                onPress={
                  isFirstFilled ? () => setClickCount((c) => c + 1) : undefined
                }
              >
                {isIconVariant ? (
                  <Icon>
                    <PlaceholderIcon />
                  </Icon>
                ) : isFirstFilled ? (
                  `Filled (${clickCount})`
                ) : (
                  'Button'
                )}
              </Button>
            );
          })}
        </div>
      )}

      <p className='text-sm text-surface-inverse'>
        Click count: {clickCount} | Buttons visible:{' '}
        {showButtons ? 'Yes' : 'No'}
      </p>
    </div>
  );
}
