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

import { expect } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import type { Locator } from 'vitest/browser';
import type { InteractiveComponentObject } from '../lib/types';

export interface ComponentObjectConfig {
  /** Test ID for locating the component */
  testId?: string;
  /** ARIA role for locating the component */
  role?: string;
  /** Accessible name for role-based location */
  name?: string;
}

/**
 * Base implementation of Component Object pattern for visual regression testing.
 * Encapsulates locators and interaction methods.
 */
export abstract class BaseComponentObject
  implements InteractiveComponentObject
{
  protected config: ComponentObjectConfig;

  constructor(config: ComponentObjectConfig) {
    this.config = config;
  }

  /**
   * Get the root element locator using configured strategy
   */
  getRoot(): Locator {
    if (this.config.testId) {
      return page.getByTestId(this.config.testId);
    }
    if (this.config.role) {
      // biome-ignore lint/suspicious/noExplicitAny: ARIA roles are dynamic
      return page.getByRole(this.config.role as any, {
        name: this.config.name,
      });
    }
    throw new Error(
      'ComponentObject requires either testId or role to be configured',
    );
  }

  /**
   * Hover over the component to trigger :hover state
   */
  async hover(): Promise<void> {
    const element = this.getRoot();
    await userEvent.hover(element.element());
  }

  /**
   * Focus the component to trigger :focus-visible state
   */
  focus(): Promise<void> {
    return new Promise((resolve) => {
      const element = this.getRoot();
      const el = element.element();
      if (el instanceof HTMLElement) {
        el.focus();
        // Dispatch keyboard event to ensure focus-visible styling
        el.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }),
        );
      }
      resolve();
    });
  }

  /**
   * Trigger pressed/active state by holding mouse down
   */
  press(): Promise<void> {
    return new Promise((resolve) => {
      const element = this.getRoot();
      const el = element.element();
      el.dispatchEvent(
        new MouseEvent('mousedown', { bubbles: true, cancelable: true }),
      );
      resolve();
    });
  }

  /**
   * Release the pressed state
   */
  release(): Promise<void> {
    return new Promise((resolve) => {
      const element = this.getRoot();
      const el = element.element();
      el.dispatchEvent(
        new MouseEvent('mouseup', { bubbles: true, cancelable: true }),
      );
      resolve();
    });
  }

  /**
   * Reset component to default state by moving mouse away and blurring
   */
  async reset(): Promise<void> {
    // Move mouse to body to clear hover
    await userEvent.hover(document.body);
    // Release any mouse buttons
    document.body.dispatchEvent(
      new MouseEvent('mouseup', { bubbles: true, cancelable: true }),
    );
    // Blur active element
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  /**
   * Take a screenshot of the component
   */
  async screenshot(filename: string): Promise<void> {
    const element = this.getRoot();
    await expect.element(element).toMatchScreenshot(filename);
  }
}
