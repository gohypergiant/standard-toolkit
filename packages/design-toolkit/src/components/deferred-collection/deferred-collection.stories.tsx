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

import { useState } from 'react';
import { Button } from '../button';
import { Skeleton } from '../skeleton';
import { DeferredCollection } from './index';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/DeferredCollection',
  component: DeferredCollection,
  parameters: {
    docs: {
      description: {
        component: `
          DeferredCollection defers rendering of large collections to prevent UI freezes.
          React Aria's collection system processes ALL items synchronously before virtualization
          begins, which can block the main thread for large datasets. This component defers the
          collection render by a few animation frames, allowing a fallback to display first.
        `,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [key, setKey] = useState(0);
    const itemCount = 100;

    return (
      <div className='flex flex-col gap-s'>
        <Button size='small' onPress={() => setKey((k) => k + 1)}>
          Reset to see skeleton
        </Button>
        <DeferredCollection
          key={key}
          fallback={
            <div className='flex h-[300px] w-[300px] flex-col gap-xs overflow-y-scroll'>
              {Array.from({ length: 10 }, (_, i) => (
                <Skeleton
                  // biome-ignore lint/suspicious/noArrayIndexKey: Static demo items never reorder
                  key={i}
                  className='h-[32px]'
                />
              ))}
            </div>
          }
          deferFrames={15}
        >
          {() => (
            <div className='flex h-[300px] w-[300px] flex-col overflow-y-scroll'>
              {Array.from({ length: itemCount }, (_, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: Static demo items never reorder
                  key={i}
                  className='mb-xs flex min-h-[30px] items-center rounded-small bg-interactive-disabled px-s text-fg-default'
                >
                  Item {i + 1}
                </div>
              ))}
            </div>
          )}
        </DeferredCollection>
      </div>
    );
  },
};
