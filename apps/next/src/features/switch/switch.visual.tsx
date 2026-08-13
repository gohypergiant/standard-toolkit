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

import { Switch } from '@accelint/design-toolkit/components/switch';
import {
  createInteractiveVisualTests,
  generateVariantMatrix,
} from '~/visual-regression/vitest';
import type { SwitchProps } from '@accelint/design-toolkit/components/switch/types';

const switchVariants = generateVariantMatrix<SwitchProps>({
  dimensions: {
    labelPosition: ['start', 'end'],
    isSelected: [true, false],
  },
});

createInteractiveVisualTests({
  componentName: 'Switch',
  renderComponent: (props: SwitchProps) => <Switch {...props}>Label</Switch>,
  testId: 'test-switch',
  className: 'p-s',
  variants: switchVariants,
  states: ['default', 'hover', 'focus', 'pressed', 'disabled'],
});
