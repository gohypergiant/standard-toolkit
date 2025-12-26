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

import type { ComponentType, ReactNode } from 'react';
import type { Locator } from 'vitest/browser';

// =============================================================================
// Theme Mode Types
// =============================================================================

/**
 * Theme modes that can be visually tested
 */
export type ThemeMode = 'dark' | 'light';

// =============================================================================
// Interactive State Types
// =============================================================================

/**
 * Interactive states that can be visually tested
 */
export type InteractiveState =
  | 'default'
  | 'hover'
  | 'focus'
  | 'pressed'
  | 'disabled';

/**
 * Configuration for a component variant to test
 */
export interface ComponentVariantConfig<TProps = Record<string, unknown>> {
  /** Unique identifier for this variant (used in screenshot names) */
  id: string;
  /** Human-readable name for test descriptions */
  name: string;
  /** Props to pass to the component */
  props: TProps;
  /** States to test for this variant (defaults to config-level states) */
  states?: InteractiveState[];
  /** Skip this variant entirely */
  skip?: boolean;
}

/**
 * Configuration for interactive visual tests
 */
export interface InteractiveVisualTestConfig<TProps = Record<string, unknown>> {
  /** Component name for test descriptions and filenames */
  componentName: string;
  /** Function to render the component with given props */
  renderComponent: (props: TProps) => ReactNode;
  /** Array of variant configurations to test */
  variants: ComponentVariantConfig<TProps>[];
  /** States to test (applies to all variants unless overridden) */
  states?: InteractiveState[];
  /** Test ID attribute on the component for targeting interactions */
  testId?: string;
  /** Role for locating component (alternative to testId) */
  role?: string;
  /** Wait time before screenshot (defaults to 100ms) */
  waitMs?: number;
  /** Additional setup before each test */
  beforeEach?: () => Promise<void> | void;
  /** Custom screenshot naming function */
  screenshotName?: (variant: string, state: InteractiveState) => string;
}

/**
 * Component Object interface for interactive components
 */
export interface InteractiveComponentObject {
  /** Get the root element locator */
  getRoot(): Locator;
  /** Trigger hover state */
  hover(): Promise<void>;
  /** Trigger focus state */
  focus(): Promise<void>;
  /** Trigger pressed state (mouse down without release) */
  press(): Promise<void>;
  /** Release pressed state */
  release(): Promise<void>;
  /** Reset to default state */
  reset(): Promise<void>;
  /** Take screenshot of current state */
  screenshot(filename: string): Promise<void>;
}

/**
 * Fixture context passed to tests
 */
export interface FixtureContext {
  /** The rendered container element */
  container: HTMLElement;
  /** Cleanup function */
  cleanup: () => void;
}

// =============================================================================
// Static Visual Test Types (existing)
// =============================================================================

/**
 * Configuration for a standard visual regression test
 */
export interface VisualTestConfig {
  /** Name of the component (used for test description) */
  componentName: string;
  /** React component that renders all variants */
  variantsComponent: ComponentType;
  /** Custom screenshot filename (defaults to `{componentName}-variants.png`) */
  screenshotName?: string;
  /** Wait time in ms before taking screenshot (defaults to 100) */
  waitMs?: number;
}

/**
 * Configuration for a single visual test scenario
 * Used for components that need multiple separate screenshots (e.g., Dialog sizes)
 */
export interface VisualTestScenario {
  /** Test name displayed in test runner */
  name: string;
  /** Function that returns the React element to render */
  render: () => ReactNode;
  /** Screenshot filename */
  screenshotName: string;
  /** Wait time in ms before taking screenshot (defaults to 100) */
  waitMs?: number;
  /** Optional selector to target specific element for screenshot */
  selector?: string;
}
