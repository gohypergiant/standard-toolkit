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

import type { Color } from 'react-aria-components';

/**
 * Props for the CustomColorPicker component.
 */
export interface CustomColorPickerProps {
  /** The current color value. */
  colorValue: Color;
  /** Whether this picker is the active selection source. */
  isActive?: boolean;
  /** Whether the button is disabled. */
  isDisabled?: boolean;
  /** Change handler callback when color is updated. */
  onChange: (color: Color) => void;
  /** Additional CSS class name for the trigger button. */
  className?: string;
}
