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

/**
 * Component fixtures for visual regression testing.
 * @see README.md for pattern documentation
 */

import { ThemeProvider } from '@accelint/design-toolkit';
import { render } from 'vitest-browser-react';
import type { ComponentType, ReactNode } from 'react';
import type { FixtureContext } from '../lib/types';

export interface ComponentFixtureOptions {
  /** Wrapper components (e.g., additional context providers) */
  wrapper?: ComponentType<{ children: ReactNode }>;
  /** Apply full viewport sizing to container */
  fullViewport?: boolean;
}

/**
 * Base fixture for mounting components in visual tests.
 * Provides ThemeProvider wrapper and consistent container setup.
 */
export function createComponentFixture(options: ComponentFixtureOptions = {}) {
  const { wrapper: Wrapper, fullViewport = false } = options;

  return {
    /**
     * Mount a component with standard VRT setup
     */
    mount(element: ReactNode): FixtureContext {
      const content = Wrapper ? <Wrapper>{element}</Wrapper> : element;

      const { container, unmount } = render(
        <ThemeProvider>{content}</ThemeProvider>,
      );

      if (fullViewport) {
        container.style.width = '100vw';
        container.style.height = '100vh';
      }

      return {
        container,
        cleanup: unmount,
      };
    },
  };
}

/**
 * Default fixture instance for simple use cases
 */
export const defaultFixture = createComponentFixture();
