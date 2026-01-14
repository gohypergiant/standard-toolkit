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

import { Button } from '@accelint/design-toolkit/components/button';
import { Icon } from '@accelint/design-toolkit/components/icon';
import PlaceholderIcon from '@accelint/icons/placeholder';
import {
  createInteractiveVisualTests,
  generateVariantMatrix,
} from '~/visual-regression/vitest';
import type { ButtonProps } from '@accelint/design-toolkit/components/button/types';

// Generate exhaustive matrix of variant x color combinations for standard buttons
const standardButtonVariants = generateVariantMatrix<ButtonProps>({
  dimensions: {
    variant: ['filled', 'outline', 'flat'],
    color: ['mono-muted', 'mono-bold', 'accent', 'serious', 'critical'],
    size: ['xsmall','small', 'medium', 'large'], // Test one size for states, sizes covered in static tests
  },
});

// Generate icon button variants separately (different rendering)
const iconButtonVariants = generateVariantMatrix<ButtonProps>({
  dimensions: {
    variant: ['icon'],
    color: ['mono-muted', 'mono-bold', 'accent', 'serious', 'critical'],
    size: ['xsmall','small', 'medium', 'large'],
  },
});

// Render function for standard buttons
const renderButton = (props: ButtonProps) => <Button {...props}>Button</Button>;

// Render function for icon buttons
const renderIconButton = (props: ButtonProps) => (
  <Button {...props}>
    <Icon>
      <PlaceholderIcon />
    </Icon>
  </Button>
);

// Test standard button variants with all interactive states
createInteractiveVisualTests({
  componentName: 'Button',
  renderComponent: renderButton,
  testId: 'test-button',
  variants: standardButtonVariants,
  states: ['default', 'hover', 'focus', 'pressed', 'disabled'],
});

// Test icon button variants with all interactive states
createInteractiveVisualTests({
  componentName: 'ButtonIcon',
  renderComponent: renderIconButton,
  testId: 'test-button',
  variants: iconButtonVariants,
  states: ['default', 'hover', 'focus', 'pressed', 'disabled'],
});
