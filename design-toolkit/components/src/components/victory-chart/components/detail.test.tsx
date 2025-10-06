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
import { Detail } from './detail';

describe('Detail Component', () => {
  const mockItem = {
    start: new Date('2024-01-01T10:00:00Z'),
    end: new Date('2024-01-01T11:00:00Z'),
    title: 'Test Event',
  };
  const mockGroup = {
    title: 'Test Group',
    data: [[mockItem]],
  };

  const defaultContext: Context = {
    gridTemplateRows: '',
    plugins: {
      // biome-ignore lint/suspicious/noExplicitAny: testing
      detail: ({ item: { title } }: any) => title,
      focus: () => null,
      noData: () => null,
      rulerDay: () => null,
      rulerHour: () => null,
      timing: () => null,
      title: () => null,
      zoom: () => null,
    },
    rulerRows: ['', ''],
  };

  type Context = Parameters<typeof ChartContext.Provider>[0]['value'];
  type Props = Parameters<typeof Detail>[0];

  const renderWithContext = (
    { item, parents }: Props,
    context: Context = defaultContext,
  ) =>
    render(
      <ChartContext.Provider value={context}>
        <Detail item={item} parents={parents} />
      </ChartContext.Provider>,
    );

  it('should render without crashing', () => {
    const { container, getByText } = renderWithContext({
      item: mockItem,
      parents: [mockGroup],
    });

    expect(container).toBeTruthy();
    expect(getByText(mockItem.title)).toBeInTheDocument();
  });

  it('should render with correct styles', () => {
    const { container } = renderWithContext({
      item: mockItem,
      parents: [mockGroup],
    });

    const el = container.querySelector('div');
    expect(el).toHaveClass('pl-4'); // parents.length (1) * 4
    expect(el).toHaveStyle({ gridRow: 'test-group_test-event' });
  });
});
