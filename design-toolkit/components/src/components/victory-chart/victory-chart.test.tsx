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
import { describe, expect, it, vi } from 'vitest';
import { data as mockData } from './__fixtures__/mock-data';
import { VictoryChart } from './index';
import type { ChartState } from './lib/chart-state';
import type { PluginsInitial } from './plugins';

// Mock dependencies
vi.mock('./components/layout', () => ({
  // biome-ignore lint/suspicious/noExplicitAny: testing
  Layout: vi.fn(({ data, state }: any) => (
    <div
      data-testid='layout'
      data-data={JSON.stringify(data)}
      data-state={JSON.stringify(state)}
    />
  )),
}));
vi.mock('./lib/chart-context', () => ({
  ChartContext: {
    // biome-ignore lint/suspicious/noExplicitAny: testing
    Provider: ({ value, children }: any) => (
      <div data-testid='context-provider' data-value={JSON.stringify(value)}>
        {children}
      </div>
    ),
  },
}));
vi.mock('./lib/options', () => ({
  mergeChartOptions: vi.fn((opts) => ({ merged: true, ...opts })),
}));
vi.mock('./plugins/merge-plugins', () => ({
  mergePlugins: vi.fn((plugins) => ({ merged: true, ...plugins })),
}));
vi.mock('./lib/chart-state', () => ({
  initialChartState: vi.fn((data, state) => ({
    initial: true,
    data,
    ...state,
  })),
}));

describe('VictoryChart', () => {
  const mockPlugins: PluginsInitial = { title: 'Testing' };
  const mockState: Partial<ChartState> = { zoom: 200 };

  it('should render with correct data and state', () => {
    const { getByTestId } = render(<VictoryChart data={mockData} />);
    const layout = getByTestId('layout');

    expect(layout).toBeTruthy();
    expect(layout.getAttribute('data-data')).toBe(JSON.stringify(mockData));
    // state should include initial: true and data
    expect(layout.getAttribute('data-state')).toContain('"initial":true');
    expect(layout.getAttribute('data-state')).toContain('"data"');
  });

  it('should provide merged options and plugins to context', () => {
    const { getByTestId } = render(
      <VictoryChart data={mockData} plugins={mockPlugins} />,
    );
    const provider = getByTestId('context-provider');
    const value = JSON.parse(provider.getAttribute('data-value') ?? '');

    expect(value.plugins).toMatchObject({ merged: true, ...mockPlugins });
  });

  it('should pass state prop to initialChartState', () => {
    const data = [
      {
        title: 'hello',
        data: [
          [
            {
              end: new Date('2024-10-15 10:00Z'),
              start: new Date('2024-10-15 01:00Z'),
              title: 'world',
            },
          ],
        ],
      },
    ];

    const { getByTestId } = render(
      <VictoryChart data={data} state={mockState} />,
    );
    const layout = getByTestId('layout');
    const state = JSON.parse(layout.getAttribute('data-state') ?? '');

    expect(state).toMatchObject({
      initial: true,
      data: JSON.parse(JSON.stringify(data)),
      ...mockState,
    });
  });
});
