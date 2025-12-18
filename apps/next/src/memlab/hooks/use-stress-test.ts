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

import { useCallback, useState } from 'react';
import { sleep } from '../lib/sleep';

export interface UseStressTestOptions {
  /**
   * Number of mount/unmount cycles to run. Defaults to 10.
   */
  cycles?: number;
  /**
   * Delay in milliseconds between visibility toggles. Defaults to 25.
   */
  delay?: number;
  /**
   * Initial visibility state. Defaults to true.
   */
  initialVisible?: boolean;
}

export interface UseStressTestReturn {
  /**
   * Whether the stress test is currently running.
   */
  isRunning: boolean;
  /**
   * The current cycle number (1-based for display).
   */
  currentCycle: number;
  /**
   * The total number of cycles configured.
   */
  totalCycles: number;
  /**
   * Function to start the stress test.
   */
  run: () => Promise<void>;
  /**
   * Current visibility state for conditional rendering.
   */
  visible: boolean;
  /**
   * Toggle visibility manually.
   */
  toggle: () => void;
  /**
   * Set visibility directly (for controlled components like Dialog).
   */
  setVisible: (visible: boolean) => void;
}

/**
 * Hook for managing stress test state and visibility.
 * Handles mount/unmount cycles with configurable delays.
 *
 * @example
 * const { isRunning, currentCycle, totalCycles, run, visible, toggle } = useStressTest({
 *   cycles: 20,
 *   delay: 25,
 * });
 *
 * <Button onPress={toggle}>{visible ? 'Hide' : 'Show'}</Button>
 * <Button onPress={run} isDisabled={isRunning}>
 *   {isRunning ? `Testing (${currentCycle}/${totalCycles})...` : 'Run Stress Test'}
 * </Button>
 * {visible && <ComponentToTest />}
 */
export function useStressTest({
  cycles = 10,
  delay = 25,
  initialVisible = true,
}: UseStressTestOptions = {}): UseStressTestReturn {
  const [isRunning, setIsRunning] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [visible, setVisible] = useState(initialVisible);

  const toggle = useCallback(() => {
    setVisible((v) => !v);
  }, []);

  const run = useCallback(async () => {
    setIsRunning(true);
    setCurrentCycle(0);

    for (let i = 0; i < cycles; i++) {
      setVisible(false);
      await sleep(delay);
      setVisible(true);
      await sleep(delay);
      setCurrentCycle(i + 1);
    }

    setIsRunning(false);
  }, [cycles, delay]);

  return {
    isRunning,
    currentCycle,
    totalCycles: cycles,
    run,
    visible,
    toggle,
    setVisible,
  };
}
