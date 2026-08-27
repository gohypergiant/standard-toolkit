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
import { Button } from '../button';
import { useStepperContext } from './context';
import type { StepperNextProps } from './types';

/**
 * Navigation button that moves to the next step.
 *
 * Automatically disables on the last step unless the disabled state is
 * explicitly overridden. Uses an accessible name of `Go to next step`
 * regardless of the visible button label.
 *
 * @param props - The next-button props.
 * @param props.children - Visible button content, typically "Next", "Continue", or "Finish".
 * @param props.isDisabled - Overrides the automatic last-step disabled state.
 * @param props.className - CSS class applied to the button.
 * @returns The rendered next-step button.
 *
 * @example
 * Basic usage:
 * ```tsx
 * <Stepper defaultStep="step-1">
 *   <StepperList>
 *     <StepperStep id="step-1">Step 1</StepperStep>
 *     <StepperStep id="step-2">Step 2</StepperStep>
 *   </StepperList>
 *   <StepperPanel id="step-1">Content 1</StepperPanel>
 *   <StepperPanel id="step-2">Content 2</StepperPanel>
 *   <StepperBack>Back</StepperBack>
 *   <StepperNext>Next</StepperNext>
 * </Stepper>
 * ```
 *
 * @example
 * Dynamic label based on step:
 * ```tsx
 * const { isLastStep } = useStepperContext();
 * <StepperNext>
 *   {isLastStep() ? 'Finish' : 'Next'}
 * </StepperNext>
 * ```
 *
 * @example
 * Override disabled state:
 * ```tsx
 * <StepperNext isDisabled={!formIsValid}>
 *   Continue
 * </StepperNext>
 * ```
 *
 * @example
 * Custom styling:
 * ```tsx
 * <StepperNext className="custom-next-button">
 *   Next →
 * </StepperNext>
 * ```
 */

export function StepperNext({
  children = 'Next',
  isDisabled: isDisabledProp,
  className,
  ...rest
}: StepperNextProps) {
  const { next, isLastStep } = useStepperContext();

  // Auto-disable at last step unless explicitly overridden
  const isDisabled = isDisabledProp ?? isLastStep;

  return (
    <Button
      {...rest}
      className={className}
      isDisabled={isDisabled}
      onClick={next}
      aria-label='Go to next step'
      aria-disabled={isDisabled}
    >
      {children}
    </Button>
  );
}
