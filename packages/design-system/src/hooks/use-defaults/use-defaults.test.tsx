import { render, renderHook, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { DefaultsContext } from './types';
import { DefaultsProvider, useDefaults } from './use-defaults';

describe('DefaultsProvider', () => {
  it('should render', () => {
    const children = 'Foo';

    render(<DefaultsProvider defaults={{}}>{children}</DefaultsProvider>);

    expect(screen.getByText(children)).toBeInTheDocument();
  });
});

describe('useDefaults', () => {
  it('should provide defaults context', () => {
    const defaults: DefaultsContext = {
      Button: { size: 'md', variant: 'solid' },
    };

    const { result } = renderHook(() => useDefaults(), {
      wrapper: ({ children }) => (
        <DefaultsProvider defaults={defaults}>{children}</DefaultsProvider>
      ),
    });

    expect(result.current).toEqual(defaults);
  });
});
