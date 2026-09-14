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
import { StepperContext } from './context';
import { useStepperState } from './use-stepper-state';
import type { StepperProps } from './types';

/**
 * Root Stepper component for building multi-step workflows.
 *
 * Manages step registration, navigation state, completion tracking, and
 * disabled-step behavior for the stepper component family. Supports both
 * controlled and uncontrolled current-step management.
 *
 * @param props - The stepper props.
 * @param props.children - Step list, step panels, and optional navigation controls.
 * @param props.className - CSS class applied to the root container.
 * @param props.currentStep - Controlled current step key.
 * @param props.defaultStep - Initial current step key for uncontrolled usage.
 * @param props.onStepChange - Called when navigation changes the current step.
 * @param props.onBeforeStepChange - Called before navigation; return `false` to block the move.
 * @param props.orientation - Layout orientation for the step list.
 * @param props.completedSteps - Controlled set of completed step keys.
 * @param props.defaultCompletedSteps - Initial completed step keys for uncontrolled usage.
 * @param props.disabledKeys - Step keys that cannot be navigated to.
 * @returns The rendered stepper root.
 *
 * @example
 * Uncontrolled stepper with default step:
 * ```tsx
 * <Stepper defaultStep="step-1" orientation="horizontal">
 *   <StepperList>
 *     <StepperStep id="step-1">Personal Info</StepperStep>
 *     <StepperStep id="step-2">Payment</StepperStep>
 *     <StepperStep id="step-3">Confirmation</StepperStep>
 *   </StepperList>
 *   <StepperPanel id="step-1">
 *     <h2>Personal Information</h2>
 *     <StepperNext>Next</StepperNext>
 *   </StepperPanel>
 *   <StepperPanel id="step-2">
 *     <h2>Payment Details</h2>
 *     <StepperBack>Back</StepperBack>
 *     <StepperNext>Next</StepperNext>
 *   </StepperPanel>
 *   <StepperPanel id="step-3">
 *     <h2>Confirmation</h2>
 *     <StepperBack>Back</StepperBack>
 *   </StepperPanel>
 * </Stepper>
 * ```
 *
 * @example
 * Controlled stepper with validation:
 * ```tsx
 * const [currentStep, setCurrentStep] = useState<Key>('step-1');
 * const [formData, setFormData] = useState({});
 *
 * const handleBeforeStepChange = (fromKey: Key, toKey: Key) => {
 *   // Validate form data before allowing navigation
 *   if (fromKey === 'step-1' && !formData.name) {
 *     alert('Please enter your name');
 *     return false;
 *   }
 *   return true;
 * };
 *
 * <Stepper
 *   currentStep={currentStep}
 *   onStepChange={setCurrentStep}
 *   onBeforeStepChange={handleBeforeStepChange}
 * >
 *   <StepperList>
 *     <StepperStep id="step-1">Step 1</StepperStep>
 *     <StepperStep id="step-2">Step 2</StepperStep>
 *   </StepperList>
 *   <StepperPanel id="step-1">
 *     <input onChange={(e) => setFormData({ name: e.target.value })} />
 *     <StepperNext>Next</StepperNext>
 *   </StepperPanel>
 *   <StepperPanel id="step-2">
 *     <StepperBack>Back</StepperBack>
 *   </StepperPanel>
 * </Stepper>
 * ```
 *
 * @example
 * Stepper with disabled steps:
 * ```tsx
 * const [completedSteps, setCompletedSteps] = useState(new Set<Key>());
 * const disabledKeys = useMemo(() => {
 *   const disabled = new Set<Key>();
 *   if (!completedSteps.has('step-1')) {
 *     disabled.add('step-2');
 *     disabled.add('step-3');
 *   }
 *   if (!completedSteps.has('step-2')) {
 *     disabled.add('step-3');
 *   }
 *   return disabled;
 * }, [completedSteps]);
 *
 * <Stepper
 *   defaultStep="step-1"
 *   completedSteps={completedSteps}
 *   disabledKeys={disabledKeys}
 * >
 *   <StepperList>
 *     <StepperStep id="step-1">Step 1</StepperStep>
 *     <StepperStep id="step-2">Step 2</StepperStep>
 *     <StepperStep id="step-3">Step 3</StepperStep>
 *   </StepperList>
 * </Stepper>
 * ```
 */
export function Stepper(props: StepperProps) {
  const {
    children,
    className,
    currentStep,
    defaultStep,
    onStepChange,
    onBeforeStepChange,
    orientation = 'horizontal',
    completedSteps,
    defaultCompletedSteps,
    disabledKeys,
    ...restProps
  } = props;

  const state = useStepperState({
    currentStep,
    defaultStep,
    onStepChange,
    onBeforeStepChange,
    completedSteps,
    defaultCompletedSteps,
    disabledKeys,
    orientation,
  });

  return (
    <StepperContext.Provider value={state}>
      <div {...restProps} className={className}>
        {children}
      </div>
    </StepperContext.Provider>
  );
}
