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
import { Layout } from './layout';

type Context = Parameters<typeof ChartContext.Provider>[0]['value'];

const FUZZ = Math.random().toString(36).slice(2);
const DAY_FUZZ = `Day ${FUZZ}`;
const NO_DATA = `No Data ${FUZZ}`;
const TITLE_FUZZ = `A Title ${FUZZ}`;

describe('Layout Component', () => {
  const defaultContext: Context = {
    gridTemplateRows: 'auto 1fr',
    plugins: {
      detail: ({ item }) => <span>{item.title}</span>,
      focus: false,
      noData: () => <span>{NO_DATA}</span>,
      rulerDay: () => <span>{DAY_FUZZ}</span>,
      rulerHour: false,
      timing: ({ item }) => <span>{item.title}</span>,
      title: () => <span>{TITLE_FUZZ}</span>,
      zoom: false,
    },
    rulerRows: ['header', 'content'],
  };

  const renderWithContext = (
    props: Parameters<typeof Layout>[0],
    context = defaultContext,
  ) =>
    render(
      <ChartContext.Provider value={context}>
        <Layout {...props} />
      </ChartContext.Provider>,
    );

  it('should render "no-data"', () => {
    const { getByText } = renderWithContext({
      data: [],
      state: { data: [], focus: 24, zoom: 100 },
    });

    expect(getByText(NO_DATA)).toBeInTheDocument();
  });

  it('should render a chart', () => {
    const { getAllByText, getByText, queryByText } = renderWithContext({
      data: [
        {
          title: 'Alpha',
          data: [
            {
              title: 'Bravo',
              data: [
                [
                  {
                    end: new Date('15 Oct 2025 12:00 -5'),
                    start: new Date('15 Oct 2025 12:30 -5'),
                    title: 'Charlie',
                  },
                ],
                [], // tests empty filtered data set in `components/objective.tsx`
              ],
            },
          ],
        },
      ],
      state: { data: [], focus: 2, zoom: 100 },
    });

    expect(queryByText(NO_DATA)).not.toBeInTheDocument();
    expect(getByText(TITLE_FUZZ)).toBeInTheDocument();
    expect(getAllByText(DAY_FUZZ).length).toBe(1);

    expect(getByText('Alpha')).toBeInTheDocument();
    expect(getByText('Bravo')).toBeInTheDocument();
    expect(getByText('Charlie')).toBeInTheDocument();
  });
});
