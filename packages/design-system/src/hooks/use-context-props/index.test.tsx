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

import { renderHook } from '@testing-library/react';
import { type CSSProperties, createContext, createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { useContextProps } from './';
import type { ContextValue } from 'react-aria-components';

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
