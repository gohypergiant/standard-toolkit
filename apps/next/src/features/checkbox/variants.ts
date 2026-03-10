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

import type { CheckboxGroupProps } from '@accelint/design-toolkit/components/checkbox/types';

type CheckboxGroupVariant = Pick<
  CheckboxGroupProps,
  'defaultValue' | 'isDisabled' | 'isRequired' | 'labelPosition' | 'orientation'
>;

export const PROP_COMBOS: { name: string; props: CheckboxGroupVariant }[] = [
  { name: 'default', props: {} },
  { name: 'label-start', props: { labelPosition: 'start' } },
  { name: 'selected', props: { defaultValue: ['a'] } },
  { name: 'required', props: { isRequired: true } },
  { name: 'required-selected', props: { isRequired: true, defaultValue: ['a'] } },
  { name: 'disabled', props: { isDisabled: true } },
  { name: 'disabled-selected', props: { isDisabled: true, defaultValue: ['a'] } },
  { name: 'horizontal', props: { orientation: 'horizontal' } },
];
