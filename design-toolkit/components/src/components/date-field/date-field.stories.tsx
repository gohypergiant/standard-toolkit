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

import {
  COMMON_ARG_TYPES,
  createArgTypeSelect,
  createParameters,
} from '^storybook/utils';
import { parseAbsoluteToLocal, parseDate } from '@internationalized/date';
import { DateField } from './index';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof DateField> = {
  title: 'Components/DateField',
  component: DateField,
  args: {
    label: 'Label',
    defaultValue: parseDate('2020-01-23'),
    description: 'Format: MM DD yyyy',
    errorMessage: '',
    granularity: 'day',
    size: 'medium',
    isDisabled: false,
    isInvalid: false,
    isRequired: true,
  },
  argTypes: {
    label: COMMON_ARG_TYPES.label,
    description: COMMON_ARG_TYPES.description,
    errorMessage: COMMON_ARG_TYPES.errorMessage,
    isDisabled: COMMON_ARG_TYPES.isDisabled,
    isInvalid: COMMON_ARG_TYPES.isInvalid,
    isRequired: COMMON_ARG_TYPES.isRequired,
    size: COMMON_ARG_TYPES.size.compact,
    granularity: createArgTypeSelect('Date granularity', [
      'day',
      'hour',
      'minute',
      'second',
    ]),
  },
  parameters: {
    ...createParameters(
      'centered',

      // exclude
      'FORM',
      'autoComplete',
      'hideTimeZone',
      'isDateUnavailable',
      'maxValue',
      'minValue',
      'placeholderValue',
      'shouldForceLeadingZeros',
      'shortMonth',
    ),
    docs: {
      subtitle:
        'Date input field with granular control over date/time selection.',
    },
  },
};

export default meta;

export const Default: StoryObj<typeof DateField> = {
  render: DateField,
};

export const WithoutShortMonth: StoryObj<typeof DateField> = {
  args: {
    ...Default.args,
    shortMonth: false,
    description: 'Format: d MM yyyy',
    defaultValue: parseDate('2020-01-23'),
  },
  render: DateField,
};

export const DateTime: StoryObj<typeof DateField> = {
  args: {
    ...Default.args,
    granularity: 'second',
    description: 'Format: d MMM yyyy hh:mm:ss a ZZZZ',
    defaultValue: parseAbsoluteToLocal('2021-04-07T18:45:22Z'),
  },
  render: DateField,
};
