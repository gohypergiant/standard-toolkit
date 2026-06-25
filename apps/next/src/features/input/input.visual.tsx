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

import { Input } from '@accelint/design-toolkit/components/input';
import {
  createInteractiveVisualTests,
  createVisualTestScenarios,
  type VisualTestScenario,
} from '~/visual-regression/vitest';
import type { InputProps } from '@accelint/design-toolkit/components/input/types';

const SCENARIOS: VisualTestScenario[] = [
  // Content compositions (medium, clearable)
  {
    name: 'empty with placeholder',
    className: 'inline-block p-s',
    screenshotName: 'input-empty-placeholder.png',
    render: () => <Input placeholder='Enter text...' />,
  },
  {
    name: 'with value',
    className: 'inline-block p-s',
    screenshotName: 'input-with-value.png',
    render: () => (
      <Input placeholder='Enter text...' defaultValue='Hello World' />
    ),
  },
  {
    name: 'with prefix',
    className: 'inline-block p-s',
    screenshotName: 'input-with-prefix.png',
    render: () => <Input placeholder='0.00' prefix='$' />,
  },
  {
    name: 'with suffix',
    className: 'inline-block p-s',
    screenshotName: 'input-with-suffix.png',
    render: () => <Input placeholder='0' suffix='kg' />,
  },
  {
    name: 'with prefix and suffix',
    className: 'inline-block p-s',
    screenshotName: 'input-with-prefix-suffix.png',
    render: () => <Input placeholder='0' prefix='~' suffix='°C' />,
  },
  // Clearable variations
  {
    name: 'not clearable empty',
    className: 'inline-block p-s',
    screenshotName: 'input-not-clearable.png',
    render: () => <Input placeholder='Enter text...' isClearable={false} />,
  },
  {
    name: 'not clearable with value',
    className: 'inline-block p-s',
    screenshotName: 'input-not-clearable-with-value.png',
    render: () => (
      <Input
        placeholder='Enter text...'
        defaultValue='Hello World'
        isClearable={false}
      />
    ),
  },
  // Size variations (small)
  {
    name: 'small empty',
    className: 'inline-block p-s',
    screenshotName: 'input-small-empty.png',
    render: () => <Input placeholder='Small input...' size='small' />,
  },
  {
    name: 'small with value',
    className: 'inline-block p-s',
    screenshotName: 'input-small-with-value.png',
    render: () => (
      <Input
        placeholder='Small input...'
        defaultValue='Small value'
        size='small'
      />
    ),
  },
  {
    name: 'small with prefix and suffix',
    className: 'inline-block p-s',
    screenshotName: 'input-small-with-prefix-suffix.png',
    render: () => <Input placeholder='0' prefix='~' suffix='°C' size='small' />,
  },
  // Form states
  {
    name: 'disabled empty',
    className: 'inline-block p-s',
    screenshotName: 'input-disabled-empty.png',
    render: () => <Input placeholder='Disabled...' disabled />,
  },
  {
    name: 'disabled with value',
    className: 'inline-block p-s',
    screenshotName: 'input-disabled-with-value.png',
    render: () => (
      <Input placeholder='Disabled...' defaultValue='Disabled value' disabled />
    ),
  },
  {
    name: 'readonly',
    className: 'inline-block p-s',
    screenshotName: 'input-readonly.png',
    render: () => (
      <Input
        placeholder='Readonly...'
        defaultValue='Read only value'
        readOnly
      />
    ),
  },
  {
    name: 'required',
    className: 'inline-block p-s',
    screenshotName: 'input-required.png',
    render: () => <Input placeholder='Required...' required />,
  },
  {
    name: 'invalid empty',
    className: 'inline-block p-s',
    screenshotName: 'input-invalid.png',
    render: () => <Input placeholder='Invalid...' isInvalid />,
  },
  {
    name: 'invalid with value',
    className: 'inline-block p-s',
    screenshotName: 'input-invalid-with-value.png',
    render: () => (
      <Input placeholder='Invalid...' defaultValue='Bad value' isInvalid />
    ),
  },
  // AutoSize
  {
    name: 'autosize short',
    className: 'inline-block p-s',
    screenshotName: 'input-autosize-short.png',
    render: () => <Input placeholder='Auto' defaultValue='Hi' autoSize />,
  },
  {
    name: 'autosize long',
    className: 'inline-block p-s',
    screenshotName: 'input-autosize-long.png',
    render: () => (
      <Input
        placeholder='Auto'
        defaultValue='This is a much longer value to test autosize'
        autoSize
      />
    ),
  },
];

createVisualTestScenarios('Input', SCENARIOS);

createInteractiveVisualTests<InputProps>({
  componentName: 'Input',
  renderComponent: (props) => <Input {...props} />,
  interactionTarget: 'input',
  className: 'p-s',
  variants: [
    {
      id: 'medium-default',
      name: 'Medium Default',
      props: { placeholder: 'Enter text...' },
    },
    {
      id: 'medium-with-value',
      name: 'Medium With Value',
      props: { defaultValue: 'Hello World' },
    },
    {
      id: 'medium-with-prefix',
      name: 'Medium With Prefix',
      props: { prefix: '$', placeholder: '0.00' },
    },
    {
      id: 'medium-with-suffix',
      name: 'Medium With Suffix',
      props: { suffix: 'kg', placeholder: '0' },
    },
    {
      id: 'medium-invalid',
      name: 'Medium Invalid',
      props: { isInvalid: true, placeholder: 'Invalid' },
    },
    {
      id: 'small-default',
      name: 'Small Default',
      props: { size: 'small', placeholder: 'Small' },
    },
    {
      id: 'small-with-value',
      name: 'Small With Value',
      props: { size: 'small', defaultValue: 'Small value' },
    },
  ],
  // Note: 'disabled' omitted because the test builder injects `isDisabled`
  // but Input uses native `disabled`, causing subpixel rendering flakiness.
  // Disabled state is covered by the static scenarios instead.
  states: ['default', 'hover', 'focus', 'pressed'],
});
