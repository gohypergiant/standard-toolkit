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

import { Button, Tooltip, TooltipTrigger } from '@accelint/design-toolkit';
import { useState } from 'react';
import { useStressTest } from '~/memlab/hooks/use-stress-test';
import { getTestId } from '~/test/get-test-id';
import { PROP_COMBOS } from './variants';

/**
 * MemLab Test Page: Tooltip Component
 *
 * This page provides test scenarios for memory leak detection in the Tooltip component.
 * It supports three testing modes:
 * 1. Mount/Unmount - Single show/hide cycle of tooltip triggers
 * 2. User Flow - Hover interactions triggering tooltip display
 * 3. Stress Test - Rapid mount/unmount cycles
 */
export function TooltipExample() {
  const [hoverCount, setHoverCount] = useState(0);

  const {
    isRunning: isStressTesting,
    currentCycle: stressTestCount,
    totalCycles,
    run: runStressTest,
    visible: showTooltips,
    toggle: toggleTooltips,
  } = useStressTest({ cycles: 20, delay: 25 });

  const handleHover = () => {
    setHoverCount((c) => c + 1);
  };

  return (
    <div
      data-testid='memlab-tooltip-test'
      className='flex h-screen flex-col items-center justify-center gap-8 bg-surface-muted p-8'
    >
      <h1 className='text-xl font-bold'>Tooltip Memory Leak Test</h1>

      {/* Test Controls */}
      <div className='flex gap-4'>
        <Button data-testid='toggle-tooltips' onPress={toggleTooltips}>
          {showTooltips ? 'Hide Tooltips' : 'Show Tooltips'}
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

      {/* Test Subject: Tooltips */}
      {showTooltips && (
        <div
          data-testid='tooltip-container'
          className='flex flex-wrap gap-8 rounded-lg border border-surface-inverse p-8'
        >
          {PROP_COMBOS.map((props) => {
            const testId = getTestId('tooltip', props);
            return (
              <TooltipTrigger key={testId}>
                <Button data-testid={testId} onHoverStart={handleHover}>
                  {props.placement} Tooltip
                </Button>
                <Tooltip {...props}>
                  Tooltip positioned at {props.placement}
                </Tooltip>
              </TooltipTrigger>
            );
          })}

          {/* Tooltip with long content - additional test case */}
          <TooltipTrigger>
            <Button
              data-testid='tooltip-trigger-long'
              onHoverStart={handleHover}
            >
              Long Content
            </Button>
            <Tooltip>
              This is a tooltip with longer content that should wrap properly
              and test memory handling for larger DOM structures
            </Tooltip>
          </TooltipTrigger>
        </div>
      )}

      <p className='text-sm text-surface-inverse'>
        Hover count: {hoverCount} | Tooltips visible:{' '}
        {showTooltips ? 'Yes' : 'No'}
      </p>
    </div>
  );
}
