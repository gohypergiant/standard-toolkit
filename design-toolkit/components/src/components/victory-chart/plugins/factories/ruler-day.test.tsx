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
import { ChartContext } from '../../lib/chart-context';
import { factoryForRulerDay } from './ruler-day';

describe('Plugin Factory for rulerDay', () => {
  it('should return false as a value if that is the literal value', () => {
    const result = factoryForRulerDay({ rulerDay: false });

    expect(result).toBe(false);
  });

  it('should render the default component', () => {
    const Component = factoryForRulerDay({});
    const { getByText } = render(
      <ChartContext.Provider
        value={
          {
            options: { hourDivisions: 1 },
            // biome-ignore lint/suspicious/noExplicitAny: testing
          } as any
        }
      >
        {Component && (
          <Component
            column={1}
            fullDate={new Date('2024-10-15').toUTCString()}
            gridRow={'1'}
            span={1}
          />
        )}
      </ChartContext.Provider>,
    );

    expect(getByText('15')).toBeInTheDocument();
    expect(getByText('15 Oct')).toBeInTheDocument();

    // The time zone offset may vary due to daylight saving time, so match only the date part
    const dateText = getByText((content, node) => {
      return node?.tagName === 'SPAN' && /Tue, 15 Oct 2024/.test(content);
    });
    expect(dateText).toBeInTheDocument();
  });
});
