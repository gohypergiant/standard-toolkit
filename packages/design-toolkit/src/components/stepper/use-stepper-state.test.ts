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

import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useStepperState } from './use-stepper-state';
import type { Key } from '@react-types/shared';

describe('useStepperState', () => {
  describe('initialization', () => {
    it('should initialize with undefined currentStep when no default provided', () => {
      const { result } = renderHook(() => useStepperState());

      expect(result.current.currentStep).toBeUndefined();
      expect(result.current.steps).toEqual([]);
      expect(result.current.completedSteps.size).toBe(0);
    });

    it('should initialize with defaultStep in uncontrolled mode', () => {
      const { result } = renderHook(() =>
        useStepperState({ defaultStep: 'step-1' }),
      );

      expect(result.current.currentStep).toBe('step-1');
    });

    it('should initialize with numeric defaultStep', () => {
      const { result } = renderHook(() => useStepperState({ defaultStep: 0 }));

      expect(result.current.currentStep).toBe(0);
    });

    it('should initialize with defaultCompletedSteps', () => {
      const completedSteps = new Set<Key>(['step-1', 'step-2']);
      const { result } = renderHook(() =>
        useStepperState({ defaultCompletedSteps: completedSteps }),
      );

      expect(result.current.completedSteps).toEqual(completedSteps);
    });

    it('should use horizontal orientation by default', () => {
      const { result } = renderHook(() => useStepperState());

      expect(result.current.orientation).toBe('horizontal');
    });

    it('should accept vertical orientation', () => {
      const { result } = renderHook(() =>
        useStepperState({ orientation: 'vertical' }),
      );

      expect(result.current.orientation).toBe('vertical');
    });
  });

  describe('controlled mode', () => {
    it('should use controlled currentStep when provided', () => {
      const { result } = renderHook(() =>
        useStepperState({ currentStep: 'step-2' }),
      );

      expect(result.current.currentStep).toBe('step-2');
    });

    it('should invoke onStepChange when navigating in controlled mode', () => {
      const onStepChange = vi.fn();
      const { result } = renderHook(() =>
        useStepperState({
          currentStep: 'step-1',
          onStepChange,
        }),
      );

      act(() => {
        result.current.register('step-1');
        result.current.register('step-2');
      });

      act(() => {
        result.current.goToStep('step-2');
      });

      expect(result.current.currentStep).toBe('step-1');
      expect(onStepChange).toHaveBeenCalledTimes(1);
      expect(onStepChange).toHaveBeenCalledWith('step-2');
    });

    it('should reflect controlled completedSteps when provided', () => {
      const completedSteps = new Set<Key>(['step-1']);
      const { result } = renderHook(() => useStepperState({ completedSteps }));

      expect(result.current.completedSteps.has('step-1')).toBe(true);
      expect(result.current.completedSteps.size).toBe(1);
    });
  });

  describe('step registration', () => {
    it('should register steps', () => {
      const { result } = renderHook(() => useStepperState());

      act(() => {
        result.current.register('step-1');
        result.current.register('step-2');
        result.current.register('step-3');
      });

      expect(result.current.steps).toEqual(['step-1', 'step-2', 'step-3']);
    });

    it('should unregister steps', () => {
      const { result } = renderHook(() => useStepperState());

      act(() => {
        result.current.register('step-1');
        result.current.register('step-2');
        result.current.register('step-3');
      });

      act(() => {
        result.current.unregister('step-2');
      });

      expect(result.current.steps).toEqual(['step-1', 'step-3']);
    });

    it('should ignore unregister for a step that was never registered', () => {
      const { result } = renderHook(() => useStepperState());

      act(() => {
        result.current.register('step-1');
        result.current.unregister('step-2');
      });

      expect(result.current.steps).toEqual(['step-1']);
    });

    it('should handle registering same step multiple times', () => {
      const { result } = renderHook(() => useStepperState());

      act(() => {
        result.current.register('step-1');
        result.current.register('step-1');
      });

      expect(result.current.steps).toEqual(['step-1']);
    });

    it('should preserve insertion order after unregister and additional registration', () => {
      const { result } = renderHook(() => useStepperState());

      act(() => {
        result.current.register('step-1');
        result.current.register('step-2');
        result.current.register('step-3');
        result.current.unregister('step-2');
        result.current.register('step-4');
      });

      expect(result.current.steps).toEqual(['step-1', 'step-3', 'step-4']);
    });

    it('should support numeric step keys', () => {
      const { result } = renderHook(() => useStepperState());

      act(() => {
        result.current.register(0);
        result.current.register(1);
        result.current.register(2);
      });

      expect(result.current.steps).toEqual([0, 1, 2]);
    });
  });

  describe('navigation - goToStep', () => {
    it('should navigate to a registered step', () => {
      const { result } = renderHook(() =>
        useStepperState({ defaultStep: 'step-1' }),
      );

      act(() => {
        result.current.register('step-1');
        result.current.register('step-2');
      });

      act(() => {
        result.current.goToStep('step-2');
      });

      expect(result.current.currentStep).toBe('step-2');
    });

    it('should not navigate to an unregistered step', () => {
      const { result } = renderHook(() =>
        useStepperState({ defaultStep: 'step-1' }),
      );

      act(() => {
        result.current.register('step-1');
      });

      act(() => {
        result.current.goToStep('step-999');
      });

      expect(result.current.currentStep).toBe('step-1');
    });

    it('should not navigate to a disabled step', () => {
      const disabledKeys = new Set<Key>(['step-2']);
      const { result } = renderHook(() =>
        useStepperState({ defaultStep: 'step-1', disabledKeys }),
      );

      act(() => {
        result.current.register('step-1');
        result.current.register('step-2');
      });

      act(() => {
        result.current.goToStep('step-2');
      });

      expect(result.current.currentStep).toBe('step-1');
    });

    it('should not navigate when clicking current step', () => {
      const onStepChange = vi.fn();
      const { result } = renderHook(() =>
        useStepperState({ defaultStep: 'step-1', onStepChange }),
      );

      act(() => {
        result.current.register('step-1');
      });

      act(() => {
        result.current.goToStep('step-1');
      });

      expect(onStepChange).not.toHaveBeenCalled();
    });

    it('should block navigation when onBeforeStepChange returns false', () => {
      const onBeforeStepChange = vi.fn(() => false);
      const { result } = renderHook(() =>
        useStepperState({
          defaultStep: 'step-1',
          onBeforeStepChange,
        }),
      );

      act(() => {
        result.current.register('step-1');
        result.current.register('step-2');
      });

      act(() => {
        result.current.goToStep('step-2');
      });

      expect(result.current.currentStep).toBe('step-1');
      expect(onBeforeStepChange).toHaveBeenCalledTimes(1);
      expect(onBeforeStepChange).toHaveBeenCalledWith('step-1', 'step-2');
    });

    it('should allow navigation when onBeforeStepChange returns true', () => {
      const onBeforeStepChange = vi.fn(() => true);
      const { result } = renderHook(() =>
        useStepperState({
          defaultStep: 'step-1',
          onBeforeStepChange,
        }),
      );

      act(() => {
        result.current.register('step-1');
        result.current.register('step-2');
      });

      act(() => {
        result.current.goToStep('step-2');
      });

      expect(result.current.currentStep).toBe('step-2');
      expect(onBeforeStepChange).toHaveBeenCalledTimes(1);
      expect(onBeforeStepChange).toHaveBeenCalledWith('step-1', 'step-2');
    });
  });

  describe('completion tracking', () => {
    it('should mark current step as completed when moving forward', () => {
      const { result } = renderHook(() =>
        useStepperState({ defaultStep: 'step-1' }),
      );

      act(() => {
        result.current.register('step-1');
        result.current.register('step-2');
        result.current.register('step-3');
      });

      act(() => {
        result.current.goToStep('step-2');
      });

      expect(result.current.completedSteps.has('step-1')).toBe(true);
    });

    it('should not mark step as completed when moving backward', () => {
      const { result } = renderHook(() =>
        useStepperState({ defaultStep: 'step-2' }),
      );

      act(() => {
        result.current.register('step-1');
        result.current.register('step-2');
        result.current.register('step-3');
      });

      act(() => {
        result.current.goToStep('step-1');
      });

      expect(result.current.completedSteps.has('step-2')).toBe(false);
    });

    it('should not mark step as completed in controlled completedSteps mode', () => {
      const completedSteps = new Set<Key>();
      const { result } = renderHook(() =>
        useStepperState({
          defaultStep: 'step-1',
          completedSteps,
        }),
      );

      act(() => {
        result.current.register('step-1');
        result.current.register('step-2');
      });

      act(() => {
        result.current.goToStep('step-2');
      });

      expect(completedSteps.has('step-1')).toBe(false);
      expect(result.current.completedSteps.has('step-1')).toBe(false);
    });
  });

  describe('navigation - next', () => {
    it('should navigate to next step', () => {
      const { result } = renderHook(() =>
        useStepperState({ defaultStep: 'step-1' }),
      );

      act(() => {
        result.current.register('step-1');
        result.current.register('step-2');
        result.current.register('step-3');
      });

      act(() => {
        result.current.next();
      });

      expect(result.current.currentStep).toBe('step-2');
    });

    it('should not navigate beyond last step', () => {
      const { result } = renderHook(() =>
        useStepperState({ defaultStep: 'step-3' }),
      );

      act(() => {
        result.current.register('step-1');
        result.current.register('step-2');
        result.current.register('step-3');
      });

      act(() => {
        result.current.next();
      });

      expect(result.current.currentStep).toBe('step-3');
    });

    it('should mark current step as completed when navigating forward', () => {
      const { result } = renderHook(() =>
        useStepperState({ defaultStep: 'step-1' }),
      );

      act(() => {
        result.current.register('step-1');
        result.current.register('step-2');
      });

      act(() => {
        result.current.next();
      });

      expect(result.current.completedSteps.has('step-1')).toBe(true);
    });

    it('should respect disabled steps when using next', () => {
      const disabledKeys = new Set<Key>(['step-2']);
      const { result } = renderHook(() =>
        useStepperState({ defaultStep: 'step-1', disabledKeys }),
      );

      act(() => {
        result.current.register('step-1');
        result.current.register('step-2');
        result.current.register('step-3');
      });

      act(() => {
        result.current.next();
      });

      expect(result.current.currentStep).toBe('step-1');
    });
  });

  describe('navigation - previous', () => {
    it('should navigate to previous step', () => {
      const { result } = renderHook(() =>
        useStepperState({ defaultStep: 'step-2' }),
      );

      act(() => {
        result.current.register('step-1');
        result.current.register('step-2');
        result.current.register('step-3');
      });

      act(() => {
        result.current.previous();
      });

      expect(result.current.currentStep).toBe('step-1');
    });

    it('should not navigate before first step', () => {
      const { result } = renderHook(() =>
        useStepperState({ defaultStep: 'step-1' }),
      );

      act(() => {
        result.current.register('step-1');
        result.current.register('step-2');
      });

      act(() => {
        result.current.previous();
      });

      expect(result.current.currentStep).toBe('step-1');
    });

    it('should not mark step as completed when moving backward', () => {
      const { result } = renderHook(() =>
        useStepperState({ defaultStep: 'step-2' }),
      );

      act(() => {
        result.current.register('step-1');
        result.current.register('step-2');
      });

      act(() => {
        result.current.previous();
      });

      expect(result.current.completedSteps.has('step-2')).toBe(false);
    });

    it('should respect disabled steps when using previous', () => {
      const disabledKeys = new Set<Key>(['step-1']);
      const { result } = renderHook(() =>
        useStepperState({ defaultStep: 'step-2', disabledKeys }),
      );

      act(() => {
        result.current.register('step-1');
        result.current.register('step-2');
      });

      act(() => {
        result.current.previous();
      });

      expect(result.current.currentStep).toBe('step-2');
    });
  });

  describe('boundary detection', () => {
    it('should correctly identify first step', () => {
      const { result } = renderHook(() =>
        useStepperState({ defaultStep: 'step-1' }),
      );

      act(() => {
        result.current.register('step-1');
        result.current.register('step-2');
        result.current.register('step-3');
      });

      expect(result.current.isFirstStep).toBe(true);
    });

    it('should correctly identify last step', () => {
      const { result } = renderHook(() =>
        useStepperState({ defaultStep: 'step-3' }),
      );

      act(() => {
        result.current.register('step-1');
        result.current.register('step-2');
        result.current.register('step-3');
      });

      expect(result.current.isLastStep).toBe(true);
    });

    it('should return false for first step when in middle', () => {
      const { result } = renderHook(() =>
        useStepperState({ defaultStep: 'step-2' }),
      );

      act(() => {
        result.current.register('step-1');
        result.current.register('step-2');
        result.current.register('step-3');
      });

      expect(result.current.isFirstStep).toBe(false);
    });

    it('should return false for last step when in middle', () => {
      const { result } = renderHook(() =>
        useStepperState({ defaultStep: 'step-2' }),
      );

      act(() => {
        result.current.register('step-1');
        result.current.register('step-2');
        result.current.register('step-3');
      });

      expect(result.current.isLastStep).toBe(false);
    });

    it('should return false for isFirstStep when no steps registered', () => {
      const { result } = renderHook(() => useStepperState());

      expect(result.current.isFirstStep).toBe(false);
    });

    it('should return false for isLastStep when no steps registered', () => {
      const { result } = renderHook(() => useStepperState());

      expect(result.current.isLastStep).toBe(false);
    });

    it('should return false for isFirstStep when currentStep is undefined', () => {
      const { result } = renderHook(() => useStepperState());

      act(() => {
        result.current.register('step-1');
      });

      expect(result.current.isFirstStep).toBe(false);
    });
  });

  describe('step utilities', () => {
    it('should get correct step index', () => {
      const { result } = renderHook(() => useStepperState());

      act(() => {
        result.current.register('step-1');
        result.current.register('step-2');
        result.current.register('step-3');
      });

      expect(result.current.getStepIndex('step-1')).toBe(0);
      expect(result.current.getStepIndex('step-2')).toBe(1);
      expect(result.current.getStepIndex('step-3')).toBe(2);
    });

    it('should return -1 for unregistered step index', () => {
      const { result } = renderHook(() => useStepperState());

      act(() => {
        result.current.register('step-1');
      });

      expect(result.current.getStepIndex('step-999')).toBe(-1);
    });

    it('should correctly identify disabled steps', () => {
      const disabledKeys = new Set<Key>(['step-2']);
      const { result } = renderHook(() => useStepperState({ disabledKeys }));

      expect(result.current.isDisabled('step-1')).toBe(false);
      expect(result.current.isDisabled('step-2')).toBe(true);
      expect(result.current.isDisabled('step-3')).toBe(false);
    });
  });

  describe('dynamic step list', () => {
    it('should handle steps registered in non-sequential order', () => {
      const { result } = renderHook(() => useStepperState());

      act(() => {
        result.current.register('step-3');
        result.current.register('step-1');
        result.current.register('step-2');
      });

      expect(result.current.steps).toEqual(['step-3', 'step-1', 'step-2']);
    });

    it('should update boundary detection when steps are unregistered', () => {
      const { result } = renderHook(() =>
        useStepperState({ defaultStep: 'step-1' }),
      );

      act(() => {
        result.current.register('step-1');
        result.current.register('step-2');
        result.current.register('step-3');
      });

      expect(result.current.isFirstStep).toBe(true);

      act(() => {
        result.current.unregister('step-1');
      });

      act(() => {
        result.current.goToStep('step-2');
      });

      expect(result.current.isFirstStep).toBe(true);
    });
  });
});
