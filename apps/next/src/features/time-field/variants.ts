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

import type { TimeFieldProps } from '@accelint/design-toolkit/components/time-field/types';
import type { TimeValue } from 'react-aria-components';

export type TimeFieldVisualProps = Pick<
  TimeFieldProps<TimeValue>,
  | 'size'
  | 'granularity'
  | 'hourCycle'
  | 'isDisabled'
  | 'isInvalid'
  | 'isReadOnly'
  | 'isRequired'
  | 'label'
  | 'description'
  | 'errorMessage'
>;

const SIZES = ['small', 'medium'] as const;

const BASE_SCENARIOS: {
  name: string;
  props: Omit<TimeFieldVisualProps, 'size'>;
}[] = [
  {
    name: 'with-label-description',
    props: {
      label: 'Start time',
      description: 'Enter the scheduled start time',
    },
  },
  {
    name: 'with-error',
    props: {
      label: 'Start time',
      isInvalid: true,
      errorMessage: 'Time is outside the valid range',
    },
  },
  {
    name: 'readonly',
    props: {
      label: 'Start time',
      isReadOnly: true,
    },
  },
  {
    name: 'required',
    props: {
      label: 'Start time',
      isRequired: true,
    },
  },
];

export const VISUAL_SCENARIOS: {
  name: string;
  props: TimeFieldVisualProps;
}[] = BASE_SCENARIOS.flatMap((scenario) =>
  SIZES.map((size) => ({
    name: `${size}-${scenario.name}`,
    props: { ...scenario.props, size },
  })),
);
