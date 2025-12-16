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

import { Button } from '@accelint/design-toolkit';
import { useEffect, useRef, useState } from 'react';

/**
 * Global array that intentionally leaks memory by holding references
 * to DOM elements that should have been garbage collected.
 *
 * WARNING: This is intentionally bad code for testing purposes only!
 */
const leakedReferences: HTMLElement[] = [];

/**
 * Global array that holds closure references (simulating event listener leaks)
 */
const leakedClosures: (() => void)[] = [];

/**
 * MemLab Test Page: Intentional Memory Leak
 *
 * This page INTENTIONALLY leaks memory to verify that our testing
 * framework correctly detects memory leaks. This is a negative test
 * case - the tests should PASS by detecting these intentional leaks.
 *
 * Leak mechanisms tested:
 * 1. DOM element references stored in global arrays
 * 2. Closure references that prevent garbage collection
 * 3. Accumulated leaks over multiple operations
 */
export function IntentionalLeakExample() {
  const [leakCount, setLeakCount] = useState(0);
  const [closureLeakCount, setClosureLeakCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Clean up leaked references when component unmounts (optional - for cleanup test)
  useEffect(() => {
    return () => {
      // This cleanup only runs on page navigation, not on component unmount
      // The leaks are intentionally preserved across re-renders
    };
  }, []);

  /**
   * Creates a DOM element leak by:
   * 1. Creating a detached DOM element
   * 2. Storing a reference in a global array
   * 3. The element can never be garbage collected
   */
  const createDomLeak = () => {
    const div = document.createElement('div');
    div.className = 'leaked-element';
    div.dataset.leaked = 'true';
    div.dataset.leakIndex = String(leakCount);
    div.textContent = `Leaked DOM element #${leakCount}`;

    // Store in global array - this is the leak!
    leakedReferences.push(div);
    setLeakCount((c) => c + 1);
  };

  /**
   * Creates a closure leak by:
   * 1. Creating a function that captures local scope
   * 2. Storing the closure in a global array
   * 3. The closure and all captured variables can never be GC'd
   */
  const createClosureLeak = () => {
    // Create some data that will be captured by the closure
    const largeData = new Array(1000).fill(
      `Closure leak data #${closureLeakCount}`,
    );
    const timestamp = Date.now();

    // This closure captures largeData and timestamp
    const leakedClosure = () => {
      console.log('Leaked closure with data:', largeData.length, timestamp);
    };

    // Store in global array - this is the leak!
    leakedClosures.push(leakedClosure);
    setClosureLeakCount((c) => c + 1);
  };

  /**
   * Create multiple leaks at once (for stress testing)
   */
  const createBulkLeaks = async () => {
    for (let i = 0; i < 10; i++) {
      createDomLeak();
      createClosureLeak();
      // Small delay to simulate real-world usage
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  };

  /**
   * Clear all leaked references (for the "cleanup works" test)
   */
  const clearAllLeaks = () => {
    leakedReferences.length = 0;
    leakedClosures.length = 0;
    setLeakCount(0);
    setClosureLeakCount(0);
  };

  /**
   * Get current leak statistics
   */
  const getLeakStats = () => {
    return {
      domLeaks: leakedReferences.length,
      closureLeaks: leakedClosures.length,
      totalLeaks: leakedReferences.length + leakedClosures.length,
    };
  };

  const stats = getLeakStats();

  return (
    <div
      data-testid='memlab-intentional-leak-test'
      className='flex h-screen flex-col items-center justify-center gap-8 bg-surface-muted p-8'
    >
      <h1 className='text-xl font-bold text-critical'>
        Intentional Memory Leak Test
      </h1>

      <p className='max-w-md text-center text-sm text-surface-inverse'>
        This page INTENTIONALLY leaks memory to verify that our MemLab testing
        framework correctly detects leaks. These are negative test cases.
      </p>

      {/* Leak Creation Controls */}
      <div className='flex flex-col gap-4'>
        <div className='flex gap-4'>
          <Button
            data-testid='create-dom-leak'
            onPress={createDomLeak}
            color='critical'
          >
            Create DOM Leak ({leakCount})
          </Button>

          <Button
            data-testid='create-closure-leak'
            onPress={createClosureLeak}
            color='serious'
          >
            Create Closure Leak ({closureLeakCount})
          </Button>
        </div>

        <div className='flex gap-4'>
          <Button
            data-testid='create-bulk-leaks'
            onPress={createBulkLeaks}
            color='critical'
            variant='outline'
          >
            Create 10x Bulk Leaks
          </Button>

          <Button
            data-testid='clear-all-leaks'
            onPress={clearAllLeaks}
            color='accent'
            variant='outline'
          >
            Clear All Leaks
          </Button>
        </div>
      </div>

      {/* Leak Statistics */}
      <div
        data-testid='leak-stats'
        className='rounded-lg border border-critical bg-critical/10 p-4'
      >
        <h2 className='mb-2 font-semibold text-critical'>Leak Statistics</h2>
        <ul className='space-y-1 text-sm'>
          <li data-testid='dom-leak-count'>
            DOM Element Leaks: {stats.domLeaks}
          </li>
          <li data-testid='closure-leak-count'>
            Closure Leaks: {stats.closureLeaks}
          </li>
          <li data-testid='total-leak-count' className='font-bold'>
            Total Leaks: {stats.totalLeaks}
          </li>
        </ul>
      </div>

      {/* Hidden container for potential DOM manipulation */}
      <div ref={containerRef} data-testid='leak-container' className='hidden' />

      <p className='text-xs text-surface-inverse/60'>
        Warning: This page intentionally creates memory leaks for testing
        purposes.
      </p>
    </div>
  );
}
