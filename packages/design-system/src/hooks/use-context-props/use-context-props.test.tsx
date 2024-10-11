import { renderHook } from '@testing-library/react';
import { type CSSProperties, createContext, createRef } from 'react';
import type { ContextValue } from 'react-aria-components';
import { describe, expect, it } from 'vitest';
import { useContextProps } from './use-context-props';

type Props = {
  className?: string;
  classNames?: {
    foo?: string;
    bar?: string;
  };
  style?: CSSProperties;
};

const Context = createContext<ContextValue<Props, Element>>(null);

describe('useContextProps', () => {
  it('should merge props provide with props from context', () => {
    const context: Props = {
      className: 'foo',
      classNames: {
        foo: 'foo',
      },
      style: {
        display: 'block',
      },
    };

    const props: Props = {
      className: 'bar',
      classNames: {
        foo: 'bar',
        bar: 'bar',
      },
      style: {
        position: 'relative',
      },
    };

    const ref = createRef<Element>();

    const { result } = renderHook(() => useContextProps(props, ref, Context), {
      wrapper: ({ children }) => (
        <Context.Provider value={context}>{children}</Context.Provider>
      ),
    });

    const [mergedProps] = result.current;

    expect(mergedProps).toEqual({
      className: 'foo bar',
      classNames: {
        foo: 'foo bar',
        bar: 'bar',
      },
      style: {
        display: 'block',
        position: 'relative',
      },
    });
  });
});
