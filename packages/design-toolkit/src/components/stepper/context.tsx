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
import { createContext, useContext } from 'react';
import type { StepperState } from './use-stepper-state';

/**
 * Context for sharing Stepper state across child components.
 *
 * Provides access to current step, completion tracking, navigation methods,
 * and step registration for StepperStep, StepperPanel, and navigation components.
 *
 * @example
 * ```tsx
 * const { currentStep, completedSteps, next, previous } = useStepperContext();
 * ```
 */
export const StepperContext = createContext<StepperState | null>(null);

/**
 * Returns the nearest stepper state from context.
 *
 * Must be called within a {@link Stepper} component tree.
 *
 * @returns The shared stepper state for the current component subtree.
 * @throws {Error} Throws when called outside a stepper provider.
 *
 * @example
 * ```tsx
 * function CustomStepIndicator() {
 *   const { currentStep, steps, isFirstStep } = useStepperContext();
 *   return <div>Step {steps.indexOf(currentStep) + 1} of {steps.length}</div>;
 * }
 * ```
 */
export function useStepperContext(): StepperState {
  const context = useContext(StepperContext);

  if (context === null) {
    throw new Error(
      'useStepperContext must be used within a Stepper component',
    );
  }

  return context;
}
