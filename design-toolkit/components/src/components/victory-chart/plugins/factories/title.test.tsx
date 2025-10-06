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
import { factoryForTitle } from './title';

describe('Plugin Factory for title', () => {
  it('should not render a component', () => {
    const result = factoryForTitle({ title: false });

    expect(result).toBeDefined();
    expect(result).toBe(false);
  });

  it('should render the default component with a custom string', () => {
    const title = `Title ${Math.random().toString(36).slice(2)}`;
    const Component = factoryForTitle({ title });
    const { getByText } = render(Component && <Component />);

    expect(getByText(title)).toBeInTheDocument();
  });

  it('should render a custom component', () => {
    const foo = 'Foo!';
    const Component = factoryForTitle({ title: () => foo });
    const { getByText } = render(Component && <Component />);

    expect(getByText(foo)).toBeInTheDocument();
  });
});
