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
