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

import { uuid } from '@accelint/core/utility/uuid';
import { useState } from 'react';
import { Button } from '../button';
import { FloatingCard } from './index';
import { FloatingCardProvider } from './provider';
import type { Meta, StoryObj } from '@storybook/react-vite';

const panelIds = {
  a: uuid(),
  b: uuid(),
  c: uuid(),
  d: uuid(),
  e: uuid(),
};

const meta = {
  title: 'Components/FloatingCard',
  component: FloatingCard,
  args: {
    id: panelIds.a,
    title: 'Test FloatingCard',
  },
} satisfies Meta<typeof FloatingCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: false,
  },

  render: ({ children, ...args }) => {
    return (
      <div className='relative h-800 w-600 p-l outline outline-info-bold'>
        <FloatingCardProvider>
          <FloatingCard id={args.id} title={args.title}>
            <div className='flex h-full flex-col items-center justify-center gap-m self-stretch rounded-medium outline outline-dashed outline-1 outline-interactive-hover'>
              Panel Content
            </div>
          </FloatingCard>
        </FloatingCardProvider>
      </div>
    );
  },
};

export const WithHeaderActions: Story = {
  render: ({ children, ...args }) => {
    return (
      <div className='relative h-800 w-600 p-l outline outline-info-bold'>
        <FloatingCardProvider
          icon={() => <span className='text-lg'>🌟</span>}
          headerActions={[
            {
              icon: <span className='text-lg'>⚙️</span>,
              onClick: () => alert('Action clicked'),
            },
          ]}
        >
          <FloatingCard id={args.id} title={args.title}>
            <div className='flex w-full items-start justify-center self-stretch p-0'>
              <div className='flex flex-1 flex-col items-center justify-center p-s'>
                <div className='flex h-full flex-col items-center justify-center gap-m self-stretch rounded-medium outline outline-dashed outline-1 outline-interactive-hover'>
                  Panel Content with Custom Headers
                </div>
              </div>
            </div>
          </FloatingCard>
        </FloatingCardProvider>
      </div>
    );
  },
};

export const MultipleCards: Story = {
  render: () => {
    return (
      <div className='relative h-1000 w-600 p-l outline outline-info-bold'>
        <FloatingCardProvider>
          <FloatingCard id={panelIds.a} title='Card A'>
            <div className='flex h-full flex-col items-center justify-center gap-m self-stretch rounded-medium bg-base-surface p-m outline outline-dashed outline-1 outline-interactive-hover'>
              <div className='font-semibold text-sm'>Card A</div>
              <p className='text-base-text-secondary text-xs'>
                Draggable floating panel
              </p>
            </div>
          </FloatingCard>
          <FloatingCard id={panelIds.b} title='Card B'>
            <div className='flex h-full flex-col items-center justify-center gap-m self-stretch rounded-medium bg-base-surface p-m outline outline-dashed outline-1 outline-interactive-hover'>
              <div className='font-semibold text-sm'>Card B</div>
              <p className='text-base-text-secondary text-xs'>
                Another independent card
              </p>
            </div>
          </FloatingCard>
          <FloatingCard id={panelIds.c} title='Card C'>
            <div className='flex h-full flex-col items-center justify-center gap-m self-stretch rounded-medium bg-base-surface p-m outline outline-dashed outline-1 outline-interactive-hover'>
              <div className='font-semibold text-sm'>Card C</div>
              <p className='text-base-text-secondary text-xs'>
                Try dragging us around!
              </p>
            </div>
          </FloatingCard>
        </FloatingCardProvider>
      </div>
    );
  },
};

export const CustomDimensions: Story = {
  render: () => {
    return (
      <div className='relative h-800 w-600 p-l outline outline-info-bold'>
        <FloatingCardProvider>
          <FloatingCard
            id={panelIds.a}
            title='Small Card'
            initialDimensions={{ width: 250, height: 200 }}
          >
            <div className='flex h-full flex-col items-center justify-center gap-m self-stretch rounded-medium outline outline-dashed outline-1 outline-interactive-hover'>
              Small dimensions
            </div>
          </FloatingCard>
          <FloatingCard
            id={panelIds.b}
            title='Large Card'
            initialDimensions={{ width: 500, height: 400 }}
          >
            <div className='flex h-full flex-col items-center justify-center gap-m self-stretch rounded-medium outline outline-dashed outline-1 outline-interactive-hover'>
              Larger dimensions for more content
            </div>
          </FloatingCard>
        </FloatingCardProvider>
      </div>
    );
  },
};

export const ControlledVisibility: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <div className='relative h-800 w-600 p-l outline outline-info-bold'>
        <div className='absolute top-0 left-0 z-50 p-m'>
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className='rounded border border-interactive-default bg-base-surface px-m py-s font-semibold text-sm hover:bg-base-surface-hover'
          >
            {isOpen ? 'Close Card' : 'Open Card'}
          </Button>
        </div>
        <FloatingCardProvider>
          <FloatingCard
            id={panelIds.a}
            title='Controllable Card'
            isOpen={isOpen}
          >
            <div className='flex h-full flex-col items-center justify-center gap-m self-stretch rounded-medium outline outline-dashed outline-1 outline-interactive-hover'>
              <p className='text-sm'>This card can be opened and closed</p>
            </div>
          </FloatingCard>
        </FloatingCardProvider>
      </div>
    );
  },
};
