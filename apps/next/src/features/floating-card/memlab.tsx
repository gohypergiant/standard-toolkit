/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
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

import { Button } from '@accelint/design-toolkit/components/button';
import { FloatingCard } from '@accelint/design-toolkit/components/floating-card';
import { FloatingCardProvider } from '@accelint/design-toolkit/components/floating-card/provider';
import { useMemo } from 'react';
import { useStressTest } from '~/memlab/hooks/use-stress-test';
import type { UniqueId } from '@accelint/core/utility/uuid';

/**
 * MemLab Test Page: FloatingCard Component
 *
 * This page provides test scenarios for memory leak detection in the FloatingCard component.
 * FloatingCard uses React portals via dockview-react and registers/deregisters DOM refs
 * which are prone to memory leaks if subscriptions and refs are not properly cleaned up.
 *
 * It supports three testing modes:
 * 1. Mount/Unmount - Single show/hide cycle of the provider and its cards
 * 2. Controlled Visibility - Toggle individual card open/close state via `isOpen`
 * 3. Stress Test - Rapid mount/unmount cycles of the provider
 */
export function FloatingCardExample() {
  const ids = useMemo(
    () => ({
      cardA: 'test-card-a' as UniqueId, // Stable ID for controlled card
      cardB: 'test-card-b' as UniqueId, // Stable ID for always-open card
      cardC: 'test-card-c' as UniqueId, // Stable ID for custom dimensions card
    }),
    [],
  );

  // Controls mounting/unmounting the entire FloatingCardProvider subtree
  const {
    isRunning: isStressTesting,
    currentCycle: stressTestCount,
    totalCycles,
    run: runStressTest,
    visible: showProvider,
    toggle: toggleProvider,
  } = useStressTest({ cycles: 10, delay: 100 });

  // Controls the `isOpen` prop of a single card (portal registration lifecycle)
  const { visible: isCardOpen, toggle: toggleCard } = useStressTest({
    cycles: 10,
    delay: 100,
  });

  return (
    <div
      data-testid='memlab-floating-card-test'
      className='flex h-screen flex-col items-center justify-center gap-8 bg-surface-muted p-8'
    >
      <h1 className='text-xl font-bold'>FloatingCard Memory Leak Test</h1>

      {/* Test Controls */}
      <div className='flex flex-wrap justify-center gap-4'>
        <Button data-testid='toggle-provider' onPress={toggleProvider}>
          {showProvider ? 'Unmount Provider' : 'Mount Provider'}
        </Button>

        <Button
          data-testid='toggle-card'
          onPress={toggleCard}
          isDisabled={!showProvider}
        >
          {isCardOpen ? 'Close Card A' : 'Open Card A'}
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

      {/* Test Subject: FloatingCardProvider + FloatingCards */}
      {showProvider && (
        <div
          data-testid='floating-card-container'
          className='relative h-96 w-full max-w-2xl rounded-lg border border-surface-inverse'
        >
          <FloatingCardProvider>
            {/* Controlled visibility card — tests portal registration/teardown */}
            <FloatingCard
              id={ids.cardA}
              title='Card A – Controlled'
              isOpen={isCardOpen}
              initialDimensions={{ width: 280, height: 200 }}
            >
              <div
                data-testid='floating-card-a-content'
                className='flex h-full flex-col items-center justify-center gap-2 p-4'
              >
                <p className='text-sm font-semibold'>Card A</p>
                <p className='text-xs'>
                  Portal content — check for ref leaks on close.
                </p>
              </div>
            </FloatingCard>

            {/* Always-open card — tests stable portal mounts */}
            <FloatingCard
              id={ids.cardB}
              title='Card B – Always Open'
              initialDimensions={{ width: 260, height: 180 }}
            >
              <div
                data-testid='floating-card-b-content'
                className='flex h-full flex-col items-center justify-center gap-2 p-4'
              >
                <p className='text-sm font-semibold'>Card B</p>
                <p className='text-xs'>Persists while provider is mounted.</p>
              </div>
            </FloatingCard>

            {/* Custom dimensions card — tests varying layout engine allocations */}
            <FloatingCard
              id={ids.cardC}
              title='Card C – Large'
              initialDimensions={{ width: 400, height: 300 }}
            >
              <div
                data-testid='floating-card-c-content'
                className='flex h-full flex-col items-center justify-center gap-2 p-4'
              >
                <p className='text-sm font-semibold'>Card C</p>
                <p className='text-xs'>
                  Larger initial dimensions — tests layout engine cleanup.
                </p>
              </div>
            </FloatingCard>
          </FloatingCardProvider>
        </div>
      )}

      <div className='flex gap-8 text-sm text-surface-inverse'>
        <p>Provider mounted: {showProvider ? 'Yes' : 'No'}</p>
        <p>Card A open: {isCardOpen ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
}
