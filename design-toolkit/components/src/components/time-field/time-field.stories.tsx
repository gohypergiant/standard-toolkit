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

import { COMMON_CONTROL, createControl, EXCLUSIONS } from '^storybook/utils';
import { parseTime } from '@internationalized/date';
import { SIZE } from '@/constants/size';
import { TimeField } from './index';
import type { Meta, StoryObj } from '@storybook/react';

type PropAlias = Parameters<typeof TimeField>[0]['granularity'] & string;

const GRANULARITY = Object.freeze({
  HOUR: 'hour',
  MINUTE: 'minute',
  SECOND: 'second',
} as const satisfies Record<Uppercase<PropAlias>, PropAlias>);

const meta: Meta<typeof TimeField> = {
  title: 'Components/TimeField',
  component: TimeField,
  args: {
    defaultValue: parseTime('20:03'),
    description: 'Format: hh:mm:ssz',
    errorMessage: '',
    granularity: GRANULARITY.SECOND,
    isDisabled: false,
    isInvalid: false,
    isRequired: true,
    label: 'Label',
    size: SIZE.MEDIUM,
  },
  argTypes: {
    size: COMMON_CONTROL.size.compact,
    granularity: createControl.select(
      'Input granularity',
      Object.values(GRANULARITY),
    ),
  },
  parameters: {
    controls: {
      exclude: [
        ...EXCLUSIONS.COMMON,
        ...EXCLUSIONS.FORM,
        'defaultValue',
        'minValue',
        'maxValue',
        'hourCycle',
        'hideTimeZone',
        'shouldForceLeadingZeros',
        'placeholderValue',
      ],
    },
  },
} satisfies Meta<typeof TimeField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: TimeField,
};
