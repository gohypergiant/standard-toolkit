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

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ChartContext } from '../lib/chart-context';
import { Ruler } from './ruler';

type Context = Parameters<typeof ChartContext.Provider>[0]['value'];

const ARBITRARY_DATE = '15 Oct 2024';
const SATISFYING_TIME = '12:34';

describe('Ruler Component', () => {
  const defaultContext: Context = {
    gridTemplateRows: 'auto',
    plugins: {
      detail: () => null,
      focus: () => null,
      noData: () => null,
      rulerDay: ({ fullDate }) => <div data-testid='rulerDay'>{fullDate}</div>,
      rulerHour: ({ time }) => (
        <div data-testid='rulerHour'>{time.getUTCHours()}</div>
      ),
      timing: () => null,
      title: () => null,
      zoom: () => null,
    },
    rulerRows: ['header', 'content'],
  };
  const renderWithContext = (
    props: Parameters<typeof Ruler>[0],
    context: Context = defaultContext,
  ) =>
    render(
      <ChartContext.Provider value={context}>
        <Ruler {...props} />
      </ChartContext.Provider>,
    );

  it.each`
    startDate         | startTime  | totalHours | expectedDays | title
    ${ARBITRARY_DATE} | ${'16:00'} | ${2}       | ${1}         | ${'2 hours on 1 day'}
    ${ARBITRARY_DATE} | ${'23:00'} | ${2}       | ${2}         | ${'2 hours on 2 days'}
    ${ARBITRARY_DATE} | ${'00:00'} | ${24}      | ${1}         | ${'24 hours on 1 days'}
    ${ARBITRARY_DATE} | ${'23:00'} | ${48}      | ${3}         | ${'48 hours on 3 days'}
    ${ARBITRARY_DATE} | ${'00:00'} | ${48}      | ${2}         | ${'48 hours on 2 days'}
  `(
    'should render ruler for $title',
    ({ expectedDays, startDate, startTime, totalHours }) => {
      const { getAllByTestId } = renderWithContext({
        hours: totalHours,
        startAt: new Date(`${startDate} ${startTime}Z`),
      });
      const days = getAllByTestId('rulerDay');
      const hours = getAllByTestId('rulerHour');

      expect(days.length).toBe(expectedDays);
      expect(hours.length).toBe(totalHours);
    },
  );

  it('should render ruler with "day" AND "hour" indicators', () => {
    const totalHours = 2;
    const { getAllByTestId } = renderWithContext({
      hours: totalHours,
      startAt: new Date(`${ARBITRARY_DATE} ${SATISFYING_TIME}Z`),
    });
    const days = getAllByTestId('rulerDay');
    const hours = getAllByTestId('rulerHour');

    expect(days.length).toBe(1);
    expect(days[0]).toBeInTheDocument();
    expect(days[0]).toHaveTextContent(ARBITRARY_DATE);

    expect(hours.length).toBe(totalHours);
    expect(hours[0]).toHaveTextContent('12');
    expect(hours[1]).toHaveTextContent('13');
  });

  it('should render ruler WITHOUT "day" indicators', () => {
    const totalHours = 2;
    const { getAllByTestId, queryAllByTestId } = renderWithContext(
      {
        hours: totalHours,
        startAt: new Date(`${ARBITRARY_DATE} ${SATISFYING_TIME}Z`),
      },
      {
        ...defaultContext,
        plugins: {
          ...defaultContext.plugins,
          rulerDay: false,
        },
      },
    );
    const days = queryAllByTestId('rulerDay');
    const hours = getAllByTestId('rulerHour');

    expect(days.length).toBe(0);
    expect(hours.length).toBe(totalHours);
  });

  it('should render ruler WITHOUT "hour" indicators', () => {
    const totalHours = 2;
    const { getAllByTestId, queryAllByTestId } = renderWithContext(
      {
        hours: totalHours,
        startAt: new Date(`${ARBITRARY_DATE} ${SATISFYING_TIME}Z`),
      },
      {
        ...defaultContext,
        plugins: {
          ...defaultContext.plugins,
          rulerHour: false,
        },
      },
    );
    const days = getAllByTestId('rulerDay');
    const hours = queryAllByTestId('rulerHour');

    expect(days.length).toBe(1);
    expect(hours.length).toBe(0);
  });
});
