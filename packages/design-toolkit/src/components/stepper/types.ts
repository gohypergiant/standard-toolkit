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

import type { Key } from '@react-types/shared';
import type { PropsWithChildren, ReactNode, RefAttributes } from 'react';
import type { ButtonProps } from '../button/types';

/**
 * Orientation of the stepper layout.
 */
export type Orientation = 'horizontal' | 'vertical';

/**
 * Props for the root Stepper component.
 *
 * Supports controlled and uncontrolled navigation, completed-step tracking,
 * disabled-step constraints, and horizontal or vertical layouts.
 */
export type StepperProps = PropsWithChildren<
  RefAttributes<HTMLDivElement> & {
    /**
     * CSS class for the stepper container.
     */
    className?: string;

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
     *
     * @param fromKey - The current step key
     * @param toKey - The target step key
     * @returns true to allow navigation, false to block
     */
    onBeforeStepChange?: (fromKey: Key, toKey: Key) => boolean;

    /**
     * Layout orientation of the stepper.
     *
     * @default 'horizontal'
     */
    orientation?: Orientation;

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
  }
>;

/**
 * Render state describing the current stepper status.
 */
export type StepperRenderState = {
  /**
   * Current step key.
   */
  currentStep: Key | undefined;

  /**
   * Orientation of the stepper.
   */
  orientation: Orientation;

  /**
   * Whether the current step is the first step.
   */
  isFirstStep: boolean;

  /**
   * Whether the current step is the last step.
   */
  isLastStep: boolean;
};

/**
 * Props for the StepperList component.
 *
 * Applied to the navigation container that owns keyboard step navigation.
 */
export type StepperListProps = PropsWithChildren<
  RefAttributes<HTMLDivElement> & {
    /**
     * CSS class for the list container.
     */
    className?: string;
  }
>;

/**
 * Render state describing the current StepperList navigation status.
 */
export type StepperListRenderState = {
  /**
   * Current step key.
   */
  currentStep: Key | undefined;

  /**
   * Orientation of the stepper.
   */
  orientation: Orientation;
};

/**
 * Render state describing an individual step button.
 */
export type StepperStepRenderState = {
  /**
   * Whether this step is the current active step.
   */
  isCurrent: boolean;

  /**
   * Whether this step has been completed.
   */
  isCompleted: boolean;

  /**
   * Whether this step is disabled.
   */
  isDisabled: boolean;

  /**
   * The numeric position of this step (1-indexed).
   */
  stepNumber: number;

  /**
   * Total number of steps.
   */
  totalSteps: number;
};

/**
 * Props for the StepperStep component.
 *
 * Each step must provide an `id` that matches the corresponding
 * {@link StepperPanelProps.id} so the step button and panel stay in sync.
 */
export type StepperStepProps = PropsWithChildren<
  RefAttributes<HTMLButtonElement> & {
    /**
     * Unique identifier for the step. Must match corresponding StepperPanel id.
     */
    id: Key;

    /**
     * CSS class for the step button.
     */
    className?: string;

    /**
     * Whether this step is disabled and blocks navigation.
     */
    isDisabled?: boolean;
  }
>;

/**
 * Props for the StepperPanel component.
 *
 * The panel renders only when its `id` matches the current step.
 */
export type StepperPanelProps = RefAttributes<HTMLDivElement> & {
  /**
   * Unique identifier for the panel. Must match corresponding StepperStep id.
   */
  id: Key;

  /**
   * Child content to display when this panel is active.
   */
  children?: ReactNode;

  /**
   * CSS class for the panel container.
   */
  className?: string;
};

/**
 * Render state describing whether a panel is currently active.
 */
export type StepperPanelRenderState = {
  /**
   * Whether this panel is currently active.
   */
  isCurrent: boolean;
};

/**
 * Props for the StepperBack component.
 *
 * Inherits all button props and adds no stepper-specific fields.
 */
export type StepperBackProps = ButtonProps;

/**
 * Props for the StepperNext component.
 *
 * Inherits all button props and adds no stepper-specific fields.
 */
export type StepperNextProps = ButtonProps;
