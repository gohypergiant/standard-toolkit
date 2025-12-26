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

import {
  BaseComponentObject,
  type ComponentObjectConfig,
} from './base-component-object';
import type { ButtonProps } from '@accelint/design-toolkit';

type ButtonObjectProps = Pick<
  ButtonProps,
  'variant' | 'color' | 'size' | 'isDisabled'
>;

export interface ButtonObjectConfig extends ComponentObjectConfig {
  /** Button props for context */
  props?: ButtonObjectProps;
}

/**
 * Component Object for Button visual regression testing.
 * Provides button-specific locators and interactions.
 */
export class ButtonObject extends BaseComponentObject {
  private buttonProps?: ButtonObjectProps;

  constructor(config: ButtonObjectConfig) {
    super({
      ...config,
      role: config.role ?? 'button',
    });
    this.buttonProps = config.props;
  }

  /**
   * Check if button is in disabled state
   */
  isDisabled(): boolean {
    return this.buttonProps?.isDisabled ?? false;
  }

  /**
   * Get button variant for screenshot naming
   */
  getVariant(): string {
    return this.buttonProps?.variant ?? 'filled';
  }

  /**
   * Get button color for screenshot naming
   */
  getColor(): string {
    return this.buttonProps?.color ?? 'mono-muted';
  }

  /**
   * Override hover - disabled buttons should not show hover state
   */
  override async hover(): Promise<void> {
    if (!this.isDisabled()) {
      await super.hover();
    }
  }

  /**
   * Override focus - disabled buttons cannot be focused
   */
  override async focus(): Promise<void> {
    if (!this.isDisabled()) {
      await super.focus();
    }
  }

  /**
   * Override press - disabled buttons cannot be pressed
   */
  override async press(): Promise<void> {
    if (!this.isDisabled()) {
      await super.press();
    }
  }
}
