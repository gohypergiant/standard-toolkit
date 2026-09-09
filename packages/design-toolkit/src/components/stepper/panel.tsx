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
import { useStepperContext } from './context';
import type { StepperPanelProps } from './types';

/**
 * Content panel displayed for the active step.
 *
 * Renders its children only when its `id` matches the current step. Inactive
 * panels are unmounted from the DOM and do not participate in layout or focus order.
 *
 * @param props - The panel props.
 * @param props.id - Step key matched against the current step and corresponding step button.
 * @param props.children - Panel content to render when the step is active.
 * @param props.className - CSS class applied to the panel container.
 * @returns The rendered panel for the active step, or `null` when inactive.
 *
 * @example
 * Basic panel:
 * ```tsx
 * <Stepper defaultStep="account">
 *   <StepperList>
 *     <StepperStep id="account">Account</StepperStep>
 *     <StepperStep id="profile">Profile</StepperStep>
 *   </StepperList>
 *   <StepperPanel id="account">
 *     <h2>Account Information</h2>
 *     <input type="text" name="username" />
 *   </StepperPanel>
 *   <StepperPanel id="profile">
 *     <h2>Profile Details</h2>
 *     <input type="text" name="displayName" />
 *   </StepperPanel>
 * </Stepper>
 * ```
 *
 * @example
 * Custom styling:
 * ```tsx
 * <StepperPanel id="summary" className="panel-content">
 *   <SummaryContent />
 * </StepperPanel>
 * ```
 */

export function StepperPanel({
  id,
  children,
  className,
  ...rest
}: StepperPanelProps) {
  const { currentStep, getStepIndex } = useStepperContext();

  const isCurrent = currentStep === id;

  // Conditional rendering: only render when current
  if (!isCurrent) {
    return null;
  }

  // Get the step index for aria-labelledby
  const stepIndex = getStepIndex(id);
  const stepId = `stepper-step-${stepIndex}`;

  return (
    <div
      {...rest}
      role='tabpanel'
      aria-labelledby={stepId}
      tabIndex={-1}
      className={className}
      data-current='true'
    >
      {children}
    </div>
  );
}
