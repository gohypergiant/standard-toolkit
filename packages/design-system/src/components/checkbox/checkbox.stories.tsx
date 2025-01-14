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

import type { StoryObj, Meta } from '@storybook/react';
import { actions } from '../../storybook/actions';
import { AriaLabel, AriaText } from '../aria';
import { Icon } from '../icon';
import { Checkbox, CheckboxGroup } from './checkbox';
import type { CheckboxGroupProps, CheckboxProps } from './types';

const indeterminateSvg = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    strokeWidth={3}
  >
    <title>indeterminate</title>
    <line x1='6' y1='12' x2='18' y2='12' />
  </svg>
);

const checkedSvg = (
  <svg viewBox='0 0 18 18' aria-hidden='true' strokeWidth={3} fill='none'>
    <title>check</title>
    <polyline points='1 9 7 14 15 4' />
  </svg>
);

const meta: Meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
} satisfies Meta<typeof Checkbox>;

export default meta;

export const Single: StoryObj<CheckboxProps> = {
  args: {
    label: 'Checkbox Label',
    isDisabled: false,
    isReadOnly: false,
    isInvalid: false,
    alignInput: 'end',
    ...actions<CheckboxProps>('onChange'),
  },
  argTypes: {
    isDisabled: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    isReadOnly: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    isInvalid: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
  },
  render: ({ label, ...rest }) => (
    <Checkbox {...rest}>
      {({ isIndeterminate }) => (
        <>
          <Icon stroke='currentcolor'>
            {isIndeterminate ? indeterminateSvg : checkedSvg}
          </Icon>
          {label && <AriaText>{label}</AriaText>}
        </>
      )}
    </Checkbox>
  ),
};

export const Group: StoryObj<CheckboxGroupProps> = {
  args: {
    label: 'Checkbox Group',
    ...actions<CheckboxGroupProps>('onChange'),
  },
  render: ({ label, ...rest }) => (
    <CheckboxGroup {...rest}>
      <AriaLabel>{label}</AriaLabel>
      <Checkbox value='foo'>
        <Icon stroke='currentcolor'>{checkedSvg}</Icon>
        <AriaText>Checkbox label</AriaText>
      </Checkbox>
      <Checkbox value='bar'>
        <Icon stroke='currentcolor'>{checkedSvg}</Icon>
        <AriaText>Checkbox label</AriaText>
      </Checkbox>
      <Checkbox value='baz'>
        <Icon stroke='currentcolor'>{checkedSvg}</Icon>
        <AriaText>Checkbox label</AriaText>
      </Checkbox>
    </CheckboxGroup>
  ),
};
