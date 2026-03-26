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

import { uuid } from '@accelint/core';
import { FloatingCard } from '@accelint/design-toolkit/components/floating-card';
import { FloatingCardProvider } from '@accelint/design-toolkit/components/floating-card/provider';
import { useMemo } from 'react';

export function FloatingCardExampleClient() {
  const ids = useMemo(
    () => ({
      cardA: uuid(),
      cardB: uuid(),
      cardC: uuid(),
    }),
    [],
  );

  return (
    <div className='fg-primary-bold h-screen bg-surface-muted'>
      <FloatingCardProvider>
        <FloatingCard
          id={ids.cardA}
          title='Card A'
          initialDimensions={{ width: 280, height: 200 }}
        >
          <div
            data-testid='floating-card-a-content'
            className='flex h-full flex-col items-center justify-center gap-xxs p-xs'
          >
            <p className='text-sm font-semibold'>Card A</p>
          </div>
        </FloatingCard>
        <FloatingCard
          id={ids.cardB}
          title='Card B'
          initialDimensions={{ width: 260, height: 180 }}
        >
          <div
            data-testid='floating-card-b-content'
            className='flex h-full flex-col items-center justify-center gap-xxs p-xs'
          >
            <p className='text-sm font-semibold'>Card B</p>
          </div>
        </FloatingCard>
        <FloatingCard
          id={ids.cardC}
          title='Card C'
          initialDimensions={{ width: 400, height: 300 }}
        >
          <div
            data-testid='floating-card-c-content'
            className='flex h-full flex-col items-center justify-center gap-xxs p-xs'
          >
            <p className='text-sm font-semibold'>Card C</p>
          </div>
        </FloatingCard>
      </FloatingCardProvider>
    </div>
  );
}
