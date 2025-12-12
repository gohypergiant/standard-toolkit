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

import { Badge, Button } from '@accelint/design-toolkit';
import { useStressTest } from '~/memlab/hooks/use-stress-test';
import { getTestId } from '~/test/get-test-id';
import { PROP_COMBOS } from './variants';

/**
 * MemLab Test Page: Badge Component
 *
 * This page provides test scenarios for memory leak detection in the Badge component.
 * It supports three testing modes:
 * 1. Mount/Unmount - Single show/hide cycle
 * 2. User Flow - Visibility toggle
 * 3. Stress Test - Rapid mount/unmount cycles
 */
export function BadgeExample() {
  const {
    isRunning: isStressTesting,
    currentCycle: stressTestCount,
    totalCycles,
    run: runStressTest,
    visible: showBadges,
    toggle: toggleBadges,
  } = useStressTest({ cycles: 20, delay: 25 });

  return (
    <div
      data-testid='memlab-badge-test'
      className='flex h-screen flex-col items-center justify-center gap-8 bg-surface-muted p-8'
    >
      <h1 className='text-xl font-bold'>Badge Memory Leak Test</h1>

      {/* Test Controls */}
      <div className='flex gap-4'>
        <Button data-testid='toggle-badges' onPress={toggleBadges}>
          {showBadges ? 'Hide Badges' : 'Show Badges'}
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

      {/* Test Subject: Badges */}
      {showBadges && (
        <div
          data-testid='badge-container'
          className='flex flex-wrap gap-4 rounded-lg border border-surface-inverse p-6'
        >
          {PROP_COMBOS.map((props, k) => (
            <Badge
              key={getTestId('badge', { color: props.color })}
              data-testid={getTestId('badge', { color: props.color })}
              {...props}
            >
              {props.children || props.color}
            </Badge>
          ))}
        </div>
      )}

      <p className='text-sm text-surface-inverse'>
        Badges visible: {showBadges ? 'Yes' : 'No'}
      </p>
    </div>
  );
}
