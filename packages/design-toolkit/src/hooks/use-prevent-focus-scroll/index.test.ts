/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
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
import { afterEach, describe, expect, it, vi } from 'vitest';
import { usePreventFocusScroll } from './index';

function createLabelWithInput(): HTMLLabelElement {
  const label = document.createElement('label');
  const input = document.createElement('input');
  input.type = 'checkbox';
  label.appendChild(input);
  document.body.appendChild(label);
  return label;
}

describe('usePreventFocusScroll', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('returns a stable callback ref across re-renders', () => {
    const { result, rerender } = renderHook(() => usePreventFocusScroll(null));
    const first = result.current;

    rerender();

    expect(result.current).toBe(first);
  });

  it('forwards the node to an object ref', () => {
    const ref: { current: HTMLLabelElement | null } = { current: null };
    const { result } = renderHook(() => usePreventFocusScroll(ref));
    const node = createLabelWithInput();

    result.current(node);

    expect(ref.current).toBe(node);
  });

  it('forwards the node to a function ref', () => {
    const fn = vi.fn();
    const { result } = renderHook(() =>
      usePreventFocusScroll<HTMLLabelElement>(fn),
    );
    const node = createLabelWithInput();

    result.current(node);

    expect(fn).toHaveBeenCalledWith(node);
  });

  it('patches input.focus() to pass preventScroll: true', () => {
    const focusSpy = vi.spyOn(HTMLElement.prototype, 'focus');
    const node = createLabelWithInput();
    const input = node.querySelector('input') as HTMLInputElement;

    const { result } = renderHook(() => usePreventFocusScroll(null));
    result.current(node);

    input.focus();

    expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
  });

  it('overrides caller-supplied preventScroll: false to true', () => {
    const focusSpy = vi.spyOn(HTMLElement.prototype, 'focus');
    const node = createLabelWithInput();
    const input = node.querySelector('input') as HTMLInputElement;

    const { result } = renderHook(() => usePreventFocusScroll(null));
    result.current(node);

    input.focus({ preventScroll: false });

    expect(focusSpy).toHaveBeenLastCalledWith({ preventScroll: true });
  });

  it('restores the original focus method when the ref detaches', () => {
    const node = createLabelWithInput();
    const input = node.querySelector('input') as HTMLInputElement;
    const beforePatch = input.focus;

    const { result } = renderHook(() => usePreventFocusScroll(null));
    result.current(node);
    expect(input.focus).not.toBe(beforePatch);

    result.current(null);

    expect(input.focus).toBe(beforePatch);
  });

  it('does not throw when the label has no input child', () => {
    const label = document.createElement('label');
    document.body.appendChild(label);
    const { result } = renderHook(() => usePreventFocusScroll(null));

    expect(() => result.current(label)).not.toThrow();
  });

  it('does not throw when given null', () => {
    const { result } = renderHook(() => usePreventFocusScroll(null));

    expect(() => result.current(null)).not.toThrow();
  });
});
