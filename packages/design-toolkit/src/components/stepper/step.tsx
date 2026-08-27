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

import 'client-only';
import { useEffect } from 'react';
import { useStepperContext } from './context';
import type { StepperStepProps } from './types';

/**
 * Interactive step button rendered inside a {@link StepperList}.
 *
 * Registers itself with the parent stepper on mount, unregisters on unmount,
 * and exposes current, visited, and disabled state through data attributes for styling.
 *
 * @param props - The step props.
 * @param props.id - Unique step key that must match the corresponding panel id.
 * @param props.children - Visible content rendered inside the step button.
 * @param props.className - CSS class applied to the step button.
 * @param props.isDisabled - Whether this step is disabled locally in addition to shared disabled keys.
 * @returns The rendered step button.
 *
 * @example
 * Basic step with text label:
 * ```tsx
 * <StepperStep id="personal-info">Personal Information</StepperStep>
 * ```
 *
 * @example
 * Disabled step:
 * ```tsx
 * <StepperStep id="payment" isDisabled={!hasCompletedProfile}>
 *   Payment Details
 * </StepperStep>
 * ```
 */
export function StepperStep(props: StepperStepProps) {
  const { id, children, className, isDisabled = false, ...restProps } = props;

  const {
    currentStep,
    completedSteps,
    steps,
    register,
    unregister,
    goToStep,
    disabledKeys,
  } = useStepperContext();

  // Register/unregister step on mount/unmount
  useEffect(() => {
    register(id);
    return () => {
      unregister(id);
    };
  }, [id, register, unregister]);

  const isCurrent = currentStep === id;
  const isCompleted = completedSteps.has(id);
  const isStepDisabled = isDisabled || disabledKeys.has(id);
  const stepNumber = steps.indexOf(id) + 1;
  const totalSteps = steps.length;

  const handleClick = () => {
    if (isStepDisabled) {
      return;
    }
    goToStep(id);
  };

  return (
    <button
      {...restProps}
      type='button'
      className={className}
      aria-current={isCurrent ? 'step' : undefined}
      aria-disabled={isStepDisabled}
      aria-label={`Step ${stepNumber} of ${totalSteps}`}
      data-current={isCurrent || undefined}
      data-visited={isCompleted || undefined}
      data-disabled={isStepDisabled || undefined}
      disabled={isStepDisabled}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
