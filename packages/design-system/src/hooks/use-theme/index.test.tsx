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

import { render, renderHook, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { ThemeContext } from './types';
import { ThemeProvider, useTheme } from './use-theme';

describe('ThemeProvider', () => {
  it('should render', () => {
    const children = 'Foo';

    render(<ThemeProvider>{children}</ThemeProvider>);

    expect(screen.getByText(children)).toBeInTheDocument();
  });
});

describe('useTheme', () => {
  it('should provide theme context', () => {
    // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
    const theme: ThemeContext = { Button: { container: 'Foo', button: 'Bar' } };

    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => (
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      ),
    });

    expect(result.current).toEqual({
      ...theme,
      className: expect.any(String),
      style: expect.any(Object),
    });
  });
});
