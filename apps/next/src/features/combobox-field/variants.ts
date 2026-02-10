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

import type {
  ComboBoxFieldProps,
  OptionsDataItem,
} from '@accelint/design-toolkit';

export interface ComboboxScenario {
  name: string;
  state: 'closed' | 'open';
  size: 'small' | 'medium';
  props: Partial<ComboBoxFieldProps<OptionsDataItem>>;
  useSections?: boolean;
  hasDisabledItem?: boolean;
}

export const SCENARIOS: ComboboxScenario[] = [
  // Closed states
  {
    name: 'Closed - Empty Medium',
    state: 'closed',
    size: 'medium',
    props: {
      label: 'Label',
      description: 'Helper text',
      inputProps: { placeholder: 'Placeholder' },
    },
  },
  {
    name: 'Closed - Empty Small',
    state: 'closed',
    size: 'small',
    props: {
      inputProps: { placeholder: 'Placeholder' },
    },
  },
  {
    name: 'Closed - Disabled',
    state: 'closed',
    size: 'medium',
    props: {
      label: 'Label',
      description: 'Helper text',
      inputProps: { placeholder: 'Placeholder' },
      isDisabled: true,
    },
  },
  {
    name: 'Closed - Invalid',
    state: 'closed',
    size: 'medium',
    props: {
      label: 'Label',
      inputProps: { placeholder: 'Placeholder' },
      isInvalid: true,
      errorMessage: 'This field is required',
    },
  },
  {
    name: 'Closed - Readonly',
    state: 'closed',
    size: 'medium',
    props: {
      label: 'Label',
      isReadOnly: true,
      inputProps: { value: 'Selected value' },
    },
  },
  {
    name: 'Closed - Selected Value Medium',
    state: 'closed',
    size: 'medium',
    props: {
      label: 'Label',
      description: 'Helper text',
      defaultInputValue: 'Cat',
      defaultSelectedKey: 2,
    },
  },
  {
    name: 'Closed - Selected Value Small',
    state: 'closed',
    size: 'small',
    props: {
      defaultInputValue: 'Cat',
      defaultSelectedKey: 2,
    },
  },
  // Open states
  {
    name: 'Open - Default',
    state: 'open',
    size: 'medium',
    props: {
      label: 'Label',
      description: 'Helper text',
      inputProps: { placeholder: 'Placeholder' },
    },
  },
  {
    name: 'Open - Small',
    state: 'open',
    size: 'small',
    props: {
      inputProps: { placeholder: 'Placeholder' },
    },
  },
  {
    name: 'Open - With Sections',
    state: 'open',
    size: 'medium',
    props: {
      label: 'Label',
      inputProps: { placeholder: 'Placeholder' },

      layoutOptions: { rowHeight: 32, headingHeight: 28 },
    },
    useSections: true,
  },
  {
    name: 'Open - With Disabled Item',
    state: 'open',
    size: 'medium',
    props: {
      label: 'Label',
      inputProps: { placeholder: 'Placeholder' },
    },
    hasDisabledItem: true,
  },
  {
    name: 'Open - With Input Value',
    state: 'open',
    size: 'medium',
    props: {
      label: 'Label',
      defaultInputValue: 'Red',
    },
  },
  {
    name: 'Open - With Selected Value',
    state: 'open',
    size: 'medium',
    props: {
      label: 'Label',
      defaultInputValue: 'Cat',
      defaultSelectedKey: 2,
    },
  },
  {
    name: 'Open - Invalid',
    state: 'open',
    size: 'medium',
    props: {
      label: 'Label',
      inputProps: { placeholder: 'Placeholder' },

      isInvalid: true,
      errorMessage: 'This field is required',
    },
  },
  {
    name: 'Open - Small Invalid',
    state: 'open',
    size: 'small',
    props: {
      inputProps: { placeholder: 'Placeholder' },
      isInvalid: true,
    },
  },
];
