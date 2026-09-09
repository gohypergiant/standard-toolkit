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

import type { Key } from '@react-types/shared';
import 'client-only';
import { useStepperContext } from './context';
import type { StepperListProps } from './types';

/**
 * Maps arrow keys to navigation direction based on orientation.
 * @param key - Keyboard event key
 * @param orientation - Stepper orientation
 * @returns 1 for forward, -1 for backward, null for non-navigation keys
 */
const getDirectionFromKey = (
  key: string,
  orientation: 'horizontal' | 'vertical',
): number | null => {
  if (orientation === 'horizontal') {
    if (key === 'ArrowRight') {
      return 1;
    }
    if (key === 'ArrowLeft') {
      return -1;
    }
  } else {
    if (key === 'ArrowDown') {
      return 1;
    }
    if (key === 'ArrowUp') {
      return -1;
    }
  }
  return null;
};

/**
 * Navigation container for {@link StepperStep} children.
 *
 * Provides arrow-key step navigation based on the current stepper orientation.
 * Horizontal steppers use Left and Right arrows, while vertical steppers use
 * Up and Down arrows. Disabled steps are skipped during keyboard navigation.
 *
 * @param props - The step list props.
 * @param props.children - Step buttons to render in navigation order.
 * @param props.className - CSS class applied to the navigation container.
 * @returns The rendered step navigation container.
 *
 * @example
 * Horizontal step list:
 * ```tsx
 * <StepperList aria-label="Registration steps">
 *   <StepperStep id="account">Account</StepperStep>
 *   <StepperStep id="profile">Profile</StepperStep>
 *   <StepperStep id="preferences">Preferences</StepperStep>
 * </StepperList>
 * ```
 *
 * @example
 * Vertical step list:
 * ```tsx
 * <Stepper orientation="vertical">
 *   <StepperList aria-label="Setup wizard">
 *     <StepperStep id="step-1">Welcome</StepperStep>
 *     <StepperStep id="step-2">Configuration</StepperStep>
 *     <StepperStep id="step-3">Review</StepperStep>
 *   </StepperList>
 * </Stepper>
 * ```
 *
 * @example
 * Custom styling:
 * ```tsx
 * <StepperList className="flex-row gap-4">
 *   <StepperStep id="step-1">Step 1</StepperStep>
 *   <StepperStep id="step-2">Step 2</StepperStep>
 * </StepperList>
 * ```
 */
export function StepperList(props: StepperListProps) {
  const { children, className, ...restProps } = props;

  const { currentStep, orientation, steps, goToStep, isDisabled } =
    useStepperContext();

  const wrapIndex = (index: number): number => {
    if (index < 0) {
      return steps.length - 1;
    }
    if (index >= steps.length) {
      return 0;
    }
    return index;
  };

  const findNavigableStep = (
    startIndex: number,
    direction: number,
  ): Key | null => {
    let searchIndex = wrapIndex(startIndex);
    const maxIterations = steps.length;

    for (let i = 0; i < maxIterations; i++) {
      const key = steps[searchIndex];
      if (key !== undefined && !isDisabled(key)) {
        return key;
      }
      searchIndex = wrapIndex(searchIndex + direction);
    }

    return null;
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (currentStep === undefined || steps.length === 0) {
      return;
    }

    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex === -1) {
      return;
    }

    const direction = getDirectionFromKey(event.key, orientation);
    if (direction === null) {
      return;
    }

    const targetIndex = wrapIndex(currentIndex + direction);
    const targetKey = findNavigableStep(targetIndex, direction);

    if (targetKey !== null) {
      event.preventDefault();
      goToStep(targetKey);
    }
  };

  return (
    <nav
      {...restProps}
      className={className}
      data-orientation={orientation}
      onKeyDown={handleKeyDown}
    >
      {children}
    </nav>
  );
}
