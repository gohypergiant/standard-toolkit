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
