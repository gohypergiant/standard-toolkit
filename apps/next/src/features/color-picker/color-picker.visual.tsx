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

import { ColorPicker } from '@accelint/design-toolkit/components/color-picker';
import {
  createInteractiveVisualTests,
  createVisualTestScenarios,
} from '~/visual-regression/vitest';
import { COLORS, PROP_COMBOS } from './variants';
import type { ColorPickerProps } from '@accelint/design-toolkit/components/color-picker/types';

createVisualTestScenarios(
  'ColorPicker',
  PROP_COMBOS.map(({ name, props }) => ({
    name,
    render: () => <ColorPicker {...props} />,
    screenshotName: `color-picker-${name}.png`,
    className: 'inline-block p-s',
  })),
);

createInteractiveVisualTests({
  componentName: 'ColorPickerInteractive',
  renderComponent: (props: ColorPickerProps) => <ColorPicker {...props} />,
  variants: [
    {
      id: 'default',
      name: 'Default',
      props: { items: COLORS },
    },
    {
      id: 'selected',
      name: 'Selected',
      props: { items: COLORS, value: '#30D27E' },
    },
  ],
  states: ['default', 'hover', 'focus', 'pressed', 'disabled'],
  className: 'p-s',
  interactionTarget: '[role="option"]',
});
