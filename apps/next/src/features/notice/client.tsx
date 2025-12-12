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

import { useEmit } from '@accelint/bus/react';
import { uuid } from '@accelint/core';
import {
  Button,
  type NoticeColor,
  type NoticeDequeueEvent,
  NoticeEventTypes,
  NoticeList,
  type NoticeQueueEvent,
} from '@accelint/design-toolkit';
import { useState } from 'react';
import { useStressTest } from '~/memlab/hooks/use-stress-test';
import { sleep } from '~/memlab/lib/sleep';

/**
 * MemLab Test Page: Notice/Toast Component
 *
 * This page provides test scenarios for memory leak detection in the NoticeList component.
 * NoticeList uses @accelint/bus for event communication and toast queues which are
 * prone to memory leaks if subscriptions aren't properly cleaned up.
 */
export function NoticeExample() {
  const [noticeCount, setNoticeCount] = useState(0);
  const [stressTestRunning, setStressTestRunning] = useState(false);
  const [stressTestCycle, setStressTestCycle] = useState(0);

  const emitQueue = useEmit<NoticeQueueEvent>(NoticeEventTypes.queue);
  const emitDequeue = useEmit<NoticeDequeueEvent>(NoticeEventTypes.dequeue);

  const addNotice = (color?: NoticeColor) => {
    const id = uuid();
    emitQueue({
      id,
      message: 'This is a test notice that should be cleaned up properly.',
      color,
      timeout: 5000,
    });
    setNoticeCount((c) => c + 1);
  };

  const clearAllNotices = () => {
    emitDequeue({});
  };

  // Stress test: rapid notice add/remove cycles (doesn't toggle visibility)
  const runNoticeStressTest = async () => {
    setStressTestRunning(true);
    setStressTestCycle(0);

    for (let i = 0; i < 20; i++) {
      const id = uuid();
      emitQueue({
        id,
        message: 'Stress test notice',
        color: 'info',
        timeout: 100,
      });

      await sleep(50);

      // Let it auto-dismiss or force clear every 5th iteration
      if (i % 5 === 0) {
        emitDequeue({});
      }

      setStressTestCycle(i + 1);
    }

    // Clear all at the end
    emitDequeue({});
    await sleep(500);

    setStressTestRunning(false);
  };

  // Mount/unmount test: toggle NoticeList visibility
  const {
    isRunning: mountUnmountRunning,
    currentCycle: mountUnmountCycle,
    totalCycles: mountUnmountTotal,
    run: runMountUnmountTest,
    visible: showNoticeList,
    toggle: toggleNoticeList,
  } = useStressTest({ cycles: 5, delay: 200 });

  const isStressTesting = stressTestRunning || mountUnmountRunning;

  return (
    <div
      data-testid='memlab-notice-test'
      className='relative flex h-screen flex-col items-center justify-center gap-8 bg-surface-muted p-8'
    >
      <h1 className='text-xl font-bold'>Notice/Toast Memory Leak Test</h1>

      {/* Notice List - positioned at top right */}
      {showNoticeList && (
        <div
          className='fixed right-4 top-4 z-50'
          data-testid='notice-container'
        >
          <NoticeList placement='top right' limit={5} defaultTimeout={5000} />
        </div>
      )}

      {/* Test Controls */}
      <div className='flex flex-col gap-4'>
        <div className='flex gap-4'>
          <Button data-testid='add-notice' onPress={() => addNotice('info')}>
            Add Info Notice
          </Button>
          <Button
            data-testid='add-critical-notice'
            onPress={() => addNotice('critical')}
            color='critical'
          >
            Add Critical Notice
          </Button>
          <Button
            data-testid='add-warning-notice'
            onPress={() => addNotice('serious')}
            color='serious'
          >
            Add Serious Notice
          </Button>
        </div>

        <div className='flex gap-4'>
          <Button
            data-testid='clear-notices'
            variant='outline'
            onPress={clearAllNotices}
          >
            Clear All Notices
          </Button>
          <Button
            data-testid='toggle-notice-list'
            variant='outline'
            onPress={toggleNoticeList}
          >
            {showNoticeList ? 'Hide Notice List' : 'Show Notice List'}
          </Button>
        </div>

        <div className='flex gap-4'>
          <Button
            data-testid='stress-test'
            onPress={runNoticeStressTest}
            isDisabled={isStressTesting}
          >
            {stressTestRunning
              ? `Stress Testing (${stressTestCycle}/20)...`
              : 'Stress Test (20 notices)'}
          </Button>
          <Button
            data-testid='mount-unmount-test'
            onPress={runMountUnmountTest}
            isDisabled={isStressTesting}
            variant='outline'
          >
            {mountUnmountRunning
              ? `Mount/Unmount (${mountUnmountCycle}/${mountUnmountTotal})...`
              : 'Mount/Unmount Test'}
          </Button>
        </div>
      </div>

      <div className='text-sm text-surface-inverse'>
        <p>Notices created: {noticeCount}</p>
        <p>Notice list visible: {showNoticeList ? 'Yes' : 'No'}</p>
      </div>

      <div className='max-w-md rounded-lg border border-surface-inverse bg-surface-base p-4 text-sm'>
        <p className='font-semibold'>Testing Notes:</p>
        <ul className='mt-2 list-inside list-disc space-y-1'>
          <li>NoticeList uses @accelint/bus for event subscriptions</li>
          <li>Each notice creates event listeners that must be cleaned up</li>
          <li>Mount/unmount test verifies bus subscription cleanup</li>
          <li>Stress test verifies rapid queue/dequeue handling</li>
        </ul>
      </div>
    </div>
  );
}
