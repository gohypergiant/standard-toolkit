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

import { render, screen } from '@testing-library/react';
import { clsx } from 'clsx';
import {
  DEFAULT_SLOT,
  Provider,
  ButtonContext as RACButtonContext,
  type ButtonProps as RACButtonProps,
} from 'react-aria-components';
import { describe, expect, it } from 'vitest';
import { callRenderProps } from '../../utils';
import { MergeProvider } from './merge-provider';

const renderProps = {
  defaultClassName: '',
  isDisabled: false,
  isFocused: false,
  isFocusVisible: false,
  isHovered: false,
  isPending: false,
  isPressed: false,
};

describe('MergeProvider', () => {
  it('should merge props from parent context', () => {
    render(
      <Provider values={[[RACButtonContext, { className: 'foo' }]]}>
        <MergeProvider values={[[RACButtonContext, { className: 'bar' }]]}>
          <RACButtonContext.Consumer>
            {(context) =>
              callRenderProps(
                (context as RACButtonProps).className,
                renderProps,
              )
            }
          </RACButtonContext.Consumer>
        </MergeProvider>
      </Provider>,
    );

    expect(screen.getByText('foo bar')).toBeInTheDocument();
  });

  it('should merge slotted props from parent context', () => {
    render(
      <Provider
        values={[
          [
            RACButtonContext,
            { slots: { [DEFAULT_SLOT]: { className: 'foo' } } },
          ],
        ]}
      >
        <MergeProvider
          values={[
            [
              RACButtonContext,
              { slots: { [DEFAULT_SLOT]: { className: 'bar' } } },
            ],
          ]}
        >
          <RACButtonContext.Consumer>
            {(context) =>
              context && 'slots' in context
                ? callRenderProps(
                    context?.slots?.[DEFAULT_SLOT]?.className,
                    renderProps,
                  )
                : null
            }
          </RACButtonContext.Consumer>
        </MergeProvider>
      </Provider>,
    );

    expect(screen.getByText('foo bar')).toBeInTheDocument();
  });

  it('should maintain slots from parent context', () => {
    // You wouldn't ever use props from multiple slots like in this test
    // but it's an easy method to verify that both slots survived the merge
    render(
      <Provider
        values={[
          [
            RACButtonContext,
            { slots: { [DEFAULT_SLOT]: { className: 'foo' } } },
          ],
        ]}
      >
        <MergeProvider
          values={[
            [
              RACButtonContext,
              { slots: { myCustomSlot: { className: 'bar' } } },
            ],
          ]}
        >
          <RACButtonContext.Consumer>
            {(context) =>
              context && 'slots' in context
                ? clsx(
                    callRenderProps(
                      context?.slots?.[DEFAULT_SLOT]?.className,
                      renderProps,
                    ),
                    callRenderProps(
                      context?.slots?.myCustomSlot?.className,
                      renderProps,
                    ),
                  )
                : null
            }
          </RACButtonContext.Consumer>
        </MergeProvider>
      </Provider>,
    );

    expect(screen.getByText('foo bar')).toBeInTheDocument();
  });

  it(`overrides context if there's a mismatch in context value structure`, () => {
    // No parent context
    const { rerender } = render(
      <MergeProvider values={[[RACButtonContext, { className: 'bar' }]]}>
        <RACButtonContext.Consumer>
          {(context) =>
            callRenderProps((context as RACButtonProps).className, renderProps)
          }
        </RACButtonContext.Consumer>
      </MergeProvider>,
    );

    expect(screen.getByText('bar')).toBeInTheDocument();

    // Parent doesn't provide slots, but merge does
    rerender(
      <Provider values={[[RACButtonContext, { className: 'foo' }]]}>
        <MergeProvider
          values={[
            [
              RACButtonContext,
              { slots: { [DEFAULT_SLOT]: { className: 'bar' } } },
            ],
          ]}
        >
          <RACButtonContext.Consumer>
            {(context) =>
              context && 'slots' in context
                ? callRenderProps(
                    context?.slots?.[DEFAULT_SLOT]?.className,
                    renderProps,
                  )
                : null
            }
          </RACButtonContext.Consumer>
        </MergeProvider>
      </Provider>,
    );

    expect(screen.getByText('bar')).toBeInTheDocument();

    // Parent provides slots, but merge doesn't
    rerender(
      <Provider
        values={[
          [
            RACButtonContext,
            { slots: { [DEFAULT_SLOT]: { className: 'foo' } } },
          ],
        ]}
      >
        <MergeProvider values={[[RACButtonContext, { className: 'bar' }]]}>
          <RACButtonContext.Consumer>
            {(context) =>
              callRenderProps(
                (context as RACButtonProps).className,
                renderProps,
              )
            }
          </RACButtonContext.Consumer>
        </MergeProvider>
      </Provider>,
    );

    expect(screen.getByText('bar')).toBeInTheDocument();
  });
});
