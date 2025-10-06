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
import { factoryForRulerHour } from './ruler-hour';

describe('Plugin Factory for rulerHour', () => {
  it('should return false as a value if that is the literal value', () => {
    const result = factoryForRulerHour({ rulerHour: false });

    expect(result).toBe(false);
  });

  it('should render the default component', () => {
    const Component = factoryForRulerHour({});
    const { getByText } = render(
      <ChartContext.Provider
        value={
          {
            options: { hourDivisions: 1 },
          } as any
        }
      >
        {Component && (
          <Component
            column={1}
            gridRow={'1'}
            hours={2}
            span={1}
            time={new Date('2024-10-15T16:00:00Z')}
          />
        )}
      </ChartContext.Provider>,
    );

    expect(getByText('|')).toBeInTheDocument();
    expect(getByText('16')).toBeInTheDocument();
    expect(getByText('16:00')).toBeInTheDocument();
  });
});
