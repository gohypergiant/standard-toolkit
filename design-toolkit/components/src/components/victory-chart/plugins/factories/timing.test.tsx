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
import { factoryForTiming } from './timing';
import type { ChartItem } from '../../data';

describe('Plugin Factory for timing', () => {
  it('should return false as a value if that is the literal value', () => {
    const result = factoryForTiming({ timing: () => null });

    expect(result).toBeDefined();
    expect(result({ item: {} as ChartItem })).toBe(null);
  });

  it('should render the default component', () => {
    const Component = factoryForTiming({});
    const { container } = render(
      <Component
        item={{
          end: new Date('2024-10-15T16:34:00Z'),
          start: new Date('2024-10-15T14:34:00Z'),
          title: 'something',
        }}
      />,
    );

    expect(
      container.querySelector('[title="14:34 - 16:34"]'),
    ).toBeInTheDocument();
  });
});
