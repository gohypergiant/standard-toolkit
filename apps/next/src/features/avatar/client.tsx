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

import { Avatar, Badge, Button, Label } from '@accelint/design-toolkit';
import { useStressTest } from '~/memlab/hooks/use-stress-test';
import { type AvatarVariant, PROP_COMBOS } from './variants';

function getTestId(variant: AvatarVariant, index: number): string {
  const parts = ['avatar', variant.size];
  if (variant.hasBadge) parts.push('badge');
  if (variant.hasLabel) parts.push('label');
  if (variant.hasFallback) parts.push('fallback');
  parts.push(String(index));
  return parts.join('-');
}

/**
 * MemLab Test Page: Avatar Component
 *
 * This page provides test scenarios for memory leak detection in the Avatar component.
 * It supports three testing modes:
 * 1. Mount/Unmount - Single show/hide cycle
 * 2. User Flow - Visibility toggle
 * 3. Stress Test - Rapid mount/unmount cycles
 */
export function AvatarExample() {
  const {
    isRunning: isStressTesting,
    currentCycle: stressTestCount,
    totalCycles,
    run: runStressTest,
    visible: showAvatars,
    toggle: toggleAvatars,
  } = useStressTest({ cycles: 10, delay: 100 });

  return (
    <div
      data-testid='memlab-avatar-test'
      className='flex h-screen flex-col items-center justify-center gap-8 bg-surface-muted p-8'
    >
      <h1 className='text-xl font-bold'>Avatar Memory Leak Test</h1>

      {/* Test Controls */}
      <div className='flex gap-4'>
        <Button data-testid='toggle-avatars' onPress={toggleAvatars}>
          {showAvatars ? 'Hide Avatars' : 'Show Avatars'}
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

      {/* Test Subject: Avatars */}
      {showAvatars && (
        <div
          data-testid='avatar-container'
          className='flex flex-wrap items-center gap-4 rounded-lg border border-surface-inverse p-6'
        >
          {PROP_COMBOS.map((variant, k) => (
            <div
              key={getTestId(variant, k)}
              data-testid={getTestId(variant, k)}
              className='flex flex-col items-center gap-2'
            >
              <Avatar size={variant.size} imageProps={variant.imageProps}>
                {variant.hasBadge && <Badge color='info'>1</Badge>}
              </Avatar>
              {variant.hasLabel && (
                <Label className='text-xs'>
                  {variant.size} {variant.hasBadge ? '+ badge' : ''}
                </Label>
              )}
            </div>
          ))}
        </div>
      )}

      <p className='text-sm text-surface-inverse'>
        Avatars visible: {showAvatars ? 'Yes' : 'No'}
      </p>
    </div>
  );
}
