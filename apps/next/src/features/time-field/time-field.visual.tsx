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

import { TimeField } from '@accelint/design-toolkit/components/time-field';
import { Time } from '@internationalized/date';
import {
  createInteractiveVisualTests,
  createVisualTestScenarios,
  generateVariantMatrix,
} from '~/visual-regression/vitest';
import { VISUAL_SCENARIOS } from './variants';
import type { TimeFieldProps } from '@accelint/design-toolkit/components/time-field/types';
import type { TimeValue } from 'react-aria-components';

const defaultValue = new Time(14, 30, 45);

const interactiveVariants = generateVariantMatrix<
  Pick<TimeFieldProps<TimeValue>, 'size' | 'granularity' | 'hourCycle'>
>({
  dimensions: {
    size: ['small', 'medium'],
    granularity: ['hour', 'minute', 'second'],
    hourCycle: [12, 24],
  },
});

const renderTimeField = (
  props: Pick<TimeFieldProps<TimeValue>, 'size' | 'granularity' | 'hourCycle'>,
) => <TimeField {...props} label='Time' defaultValue={defaultValue} />;

createInteractiveVisualTests({
  componentName: 'TimeField',
  renderComponent: renderTimeField,
  variants: interactiveVariants,
  states: ['default', 'hover', 'focus', 'pressed', 'disabled'],
});

createVisualTestScenarios(
  'TimeField',
  VISUAL_SCENARIOS.map((scenario) => ({
    name: scenario.name,
    render: () => <TimeField {...scenario.props} defaultValue={defaultValue} />,
    screenshotName: `time-field-${scenario.name}.png`,
    className: 'inline-block p-s',
  })),
);
