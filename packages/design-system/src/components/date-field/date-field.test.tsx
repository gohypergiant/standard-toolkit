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

import { type CalendarDate, parseDate } from '@internationalized/date';
import type { DateSegment as TDateSegment } from '@react-stately/datepicker';
import { render, screen } from '@testing-library/react';
import type { DateValue } from 'react-aria-components';
import { describe, expect, it } from 'vitest';
import { AriaFieldError, AriaLabel, AriaText } from '../aria';
import { DateInput, DateSegment, DateSegments } from '../date-input';
import { DateField } from './date-field';
import type { DateFieldProps } from './types';

function setup<T extends DateValue = CalendarDate>(
  props: Partial<DateFieldProps<T>> = {},
) {
  render(
    <DateField {...props}>
      <AriaLabel>Date</AriaLabel>
      <DateInput provider={true}>
        <DateSegments>
          {(segment: TDateSegment) => <DateSegment segment={segment} />}
        </DateSegments>
      </DateInput>

      <AriaText slot='description'>Hint</AriaText>
      <AriaFieldError>Error</AriaFieldError>
    </DateField>,
  );
}

describe('DateField', () => {
  it('should render', () => {
    setup<CalendarDate>({
      defaultValue: parseDate('2020-01-23'),
      'aria-label': 'datetime field',
    });

    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(
      screen.getByRole('spinbutton', {
        value: { now: 1 },
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('spinbutton', {
        value: { now: 23 },
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('spinbutton', {
        value: { now: 2020 },
      }),
    ).toBeInTheDocument();
  });
});
