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

import { useCallback, useMemo, useRef, useState } from 'react';
import { useControlledState } from 'react-stately/useControlledState';
import type { Key } from '@react-types/shared';
import type { Orientation } from './types';

/**
 * Empty Set constant for stable default reference.
 */
const EMPTY_SET = new Set<Key>();

/**
 * Configuration options for {@link useStepperState}.
 *
 * Supports controlled and uncontrolled current-step state, completed-step
 * tracking, disabled-step constraints, and orientation metadata consumed by
 * stepper UI components.
 */
export type UseStepperStateProps = {
  /**
   * Controlled current step key.
   */
  currentStep?: Key;

  /**
   * Default step key for uncontrolled mode.
   */
  defaultStep?: Key;

  /**
   * Callback invoked when the current step changes.
   */
  onStepChange?: (key: Key) => void;

  /**
   * Validation callback invoked before step change.
   * Return false to block navigation.
   */
  onBeforeStepChange?: (fromKey: Key, toKey: Key) => boolean;

  /**
   * Controlled set of completed step keys.
   */
  completedSteps?: Set<Key>;

  /**
   * Default set of completed step keys for uncontrolled mode.
   */
  defaultCompletedSteps?: Set<Key>;

  /**
   * Set of disabled step keys that block navigation.
   */
  disabledKeys?: Set<Key>;

  /**
   * Layout orientation of the stepper.
   */
  orientation?: Orientation;
};

/**
 * State and navigation helpers returned by {@link useStepperState}.
 *
 * This shape is shared through {@link StepperContext} and consumed by the
 * stepper component family.
 */
export type StepperState = {
  /**
   * Current active step key.
   * `undefined` when no steps have been registered yet or no default/controlled value provided.
   */
  currentStep: Key | undefined;

  /**
   * Set of completed step keys.
   */
  completedSteps: Set<Key>;

  /**
   * Set of disabled step keys.
   */
  disabledKeys: Set<Key>;

  /**
   * Orientation of the stepper.
   */
  orientation: Orientation;

  /**
   * Array of registered step keys in order.
   */
  steps: Key[];

  /**
   * Registers a step key in navigation order.
   * Duplicate registrations are ignored.
   */
  register: (key: Key) => void;

  /**
   * Removes a step key from the registered navigation order.
   * Missing keys are ignored.
   */
  unregister: (key: Key) => void;

  /**
   * Attempts to navigate to the provided step key.
   * Does nothing when the target step is disabled, unregistered, or blocked by validation.
   */
  goToStep: (key: Key) => void;

  /**
   * Navigate to the next step.
   */
  next: () => void;

  /**
   * Navigate to the previous step.
   */
  previous: () => void;

  /**
   * Check if a step is disabled.
   */
  isDisabled: (key: Key) => boolean;

  /**
   * Whether current step is the first step.
   */
  isFirstStep: boolean;

  /**
   * Whether the current step is the last step.
   */
  isLastStep: boolean;

  /**
   * Get the index of a step in the registered steps array.
   */
  getStepIndex: (key: Key) => number;
};

/**
 * Manages state for the stepper component family.
 *
 * Tracks registered steps, resolves controlled versus uncontrolled state,
 * updates completed-step bookkeeping, and exposes navigation helpers used by
 * the stepper UI components.
 *
 * @param props - The stepper state configuration.
 * @param props.currentStep - Controlled active step key.
 * @param props.defaultStep - Initial active step key for uncontrolled usage.
 * @param props.onStepChange - Called after navigation changes the active step.
 * @param props.onBeforeStepChange - Called before navigation; return `false` to block it.
 * @param props.completedSteps - Controlled set of completed step keys.
 * @param props.defaultCompletedSteps - Initial completed step keys for uncontrolled usage.
 * @param props.disabledKeys - Step keys that cannot be navigated to.
 * @param props.orientation - Layout orientation metadata for the consuming UI.
 * @returns State and navigation helpers for the registered step sequence.
 *
 * @remarks
 * Steps register on mount and unregister on unmount. Moving forward marks the
 * previous step as completed, while moving backward clears completed state from
 * the destination step onward in uncontrolled mode.
 *
 * @example
 * ```tsx
 * const state = useStepperState({
 *   defaultStep: 'account',
 *   orientation: 'horizontal',
 * });
 * ```
 *
 * @example
 * ```tsx
 * const [currentStep, setCurrentStep] = useState<Key>('account');
 *
 * const state = useStepperState({
 *   currentStep,
 *   onStepChange: setCurrentStep,
 *   onBeforeStepChange: (fromKey, toKey) => {
 *     return validateStep(fromKey, toKey);
 *   },
 *   disabledKeys: new Set<Key>(['review']),
 * });
 * ```
 */
export function useStepperState(
  props: UseStepperStateProps = {},
): StepperState {
  const {
    currentStep: currentStepProp,
    defaultStep,
    onStepChange,
    onBeforeStepChange,
    completedSteps: completedStepsProp,
    defaultCompletedSteps,
    disabledKeys = EMPTY_SET,
    orientation = 'horizontal',
  } = props;

  // Controlled/uncontrolled state for current step using react-stately.
  // Pass undefined as the fallback to handle the case where no default is provided.
  // Cast through unknown to satisfy TypeScript when defaultStep is undefined.
  const [currentStep, setCurrentStep] = useControlledState(
    currentStepProp,
    defaultStep ?? (undefined as unknown as Key),
    onStepChange,
  );

  // Controlled/uncontrolled state for completed steps using react-stately.
  // This works with useControlledState because we always provide a default (empty Set).
  const [completedSteps, setCompletedSteps] = useControlledState<Set<Key>>(
    completedStepsProp,
    defaultCompletedSteps ?? EMPTY_SET,
  );

  const [steps, setSteps] = useState<Key[]>([]);

  // Registry of registered step keys for membership checks.
  const stepsRegistry = useRef(new Set<Key>());

  // Ordered registered step keys used to preserve navigation sequence
  // and publish React state snapshots efficiently.
  const orderedSteps = useRef<Key[]>([]);

  /**
   * Register a step.
   */
  const register = useCallback((key: Key): void => {
    if (stepsRegistry.current.has(key)) {
      return;
    }

    stepsRegistry.current.add(key);
    orderedSteps.current.push(key);
    setSteps(orderedSteps.current.slice());
  }, []);

  /**
   * Unregister a step.
   */
  const unregister = useCallback((key: Key): void => {
    if (!stepsRegistry.current.has(key)) {
      return;
    }

    stepsRegistry.current.delete(key);

    const keyIndex = orderedSteps.current.indexOf(key);
    if (keyIndex === -1) {
      return;
    }

    orderedSteps.current.splice(keyIndex, 1);
    setSteps(orderedSteps.current.slice());
  }, []);

  /**
   * Memoized step-key lookup table used to avoid repeated linear scans of `steps`
   * during navigation and derived state checks.
   */
  const stepIndexByKey = useMemo((): Map<Key, number> => {
    const nextStepIndexByKey = new Map<Key, number>();

    for (let index = 0; index < steps.length; index++) {
      const step = steps[index];
      if (step !== undefined) {
        nextStepIndexByKey.set(step, index);
      }
    }

    return nextStepIndexByKey;
  }, [steps]);

  const getStepIndex = useCallback(
    (key: Key): number => {
      return stepIndexByKey.get(key) ?? -1;
    },
    [stepIndexByKey],
  );

  /**
   * Check if a step is disabled.
   */
  const isDisabled = useCallback(
    (key: Key): boolean => {
      return disabledKeys.has(key);
    },
    [disabledKeys],
  );

  const currentStepIndex = useMemo((): number => {
    if (currentStep === undefined) {
      return -1;
    }

    return stepIndexByKey.get(currentStep) ?? -1;
  }, [currentStep, stepIndexByKey]);

  /**
   * Check if the current step is the first step.
   */
  const isFirstStep = currentStepIndex === 0;

  /**
   * Check if the current step is the last step.
   */
  const isLastStep =
    currentStepIndex !== -1 && currentStepIndex === steps.length - 1;

  /**
   * Check if navigation to target step is blocked.
   */
  const isNavigationBlocked = useCallback(
    (targetKey: Key): boolean => {
      if (isDisabled(targetKey)) {
        return true;
      }
      if (!stepsRegistry.current.has(targetKey)) {
        return true;
      }
      if (currentStep === targetKey) {
        return true;
      }
      return false;
    },
    [isDisabled, currentStep],
  );

  /**
   * Run validation callback if provided.
   */
  const runValidation = useCallback(
    (fromKey: Key | undefined, toKey: Key): boolean => {
      if (!onBeforeStepChange || fromKey === undefined) {
        return true;
      }
      return onBeforeStepChange(fromKey, toKey);
    },
    [onBeforeStepChange],
  );

  /**
   * Update completed steps based on navigation direction.
   * Moving forward: mark the step we're leaving as completed.
   * Moving backward: remove completed state from all steps at or after the destination.
   */
  const updateCompletedSteps = useCallback(
    (fromKey: Key | undefined, toKey: Key): void => {
      if (fromKey === undefined) {
        return;
      }

      const fromIndex = getStepIndex(fromKey);
      const toIndex = getStepIndex(toKey);
      const isForward = toIndex > fromIndex;

      setCompletedSteps((previousCompletedSteps) => {
        const nextCompletedSteps = new Set(previousCompletedSteps);
        if (isForward) {
          nextCompletedSteps.add(fromKey);
          // The active destination step is not considered completed.
          nextCompletedSteps.delete(toKey);
          return nextCompletedSteps;
        }

        for (let index = toIndex; index < steps.length; index++) {
          const step = steps[index];
          if (step !== undefined) {
            nextCompletedSteps.delete(step);
          }
        }
        return nextCompletedSteps;
      });
    },
    [setCompletedSteps, getStepIndex, steps],
  );

  /**
   * Navigate to a specific step.
   * Respects disabled keys and validation callbacks.
   */
  const goToStep = useCallback(
    (targetKey: Key): void => {
      if (isNavigationBlocked(targetKey)) {
        return;
      }

      const allowed = runValidation(currentStep, targetKey);
      if (!allowed) {
        return;
      }

      updateCompletedSteps(currentStep, targetKey);

      // useControlledState handles both controlled and uncontrolled modes,
      // and calls onStepChange callback automatically
      setCurrentStep(targetKey);
    },
    [
      currentStep,
      isNavigationBlocked,
      runValidation,
      updateCompletedSteps,
      setCurrentStep,
    ],
  );

  /**
   * Navigate to the next step in sequence.
   */
  const next = useCallback((): void => {
    if (currentStepIndex === -1 || currentStepIndex >= steps.length - 1) {
      return;
    }

    const nextKey = steps[currentStepIndex + 1];
    if (nextKey === undefined) {
      return;
    }

    goToStep(nextKey);
  }, [currentStepIndex, steps, goToStep]);

  /**
   * Navigate to the previous step in sequence.
   */
  const previous = useCallback((): void => {
    if (currentStepIndex <= 0) {
      return;
    }

    const previousKey = steps[currentStepIndex - 1];
    if (previousKey === undefined) {
      return;
    }

    goToStep(previousKey);
  }, [currentStepIndex, steps, goToStep]);

  return {
    currentStep,
    completedSteps,
    disabledKeys,
    orientation,
    steps,
    register,
    unregister,
    goToStep,
    next,
    previous,
    isDisabled,
    isFirstStep,
    isLastStep,
    getStepIndex,
  };
}
