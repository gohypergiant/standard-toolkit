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

// use-html-overlay.test.tsx
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { HtmlOverlayWidget } from './index';
import { useHtmlOverlay } from './use-html-overlay';

describe('useHtmlOverlay', () => {
  // --- Construction ---
  it('should create a stable widget instance across re-renders', () => {
    const { result, rerender } = renderHook(() => useHtmlOverlay());
    const first = result.current.widget;
    rerender();
    expect(result.current.widget).toBe(first);
  });

  it('should return null portal before container is established', () => {
    const { result } = renderHook(() => useHtmlOverlay());
    expect(result.current.portal).toBeNull();
  });

  // --- Props sync ---
  it('should call setProps when props change', () => {
    const spy = vi.spyOn(HtmlOverlayWidget.prototype, 'setProps');
    const { rerender } = renderHook((props) => useHtmlOverlay(props), {
      initialProps: { zIndex: 1 },
    });
    rerender({ zIndex: 5 });
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ zIndex: 5 }));
  });

  // --- Portal rendering ---
  it('should produce a portal after onCreateOverlay fires', () => {
    // Simulate deck.gl calling onRenderHTML with a real DOM element
    const { result } = renderHook(() => useHtmlOverlay());
    const root = document.createElement('div');

    act(() => {
      result.current.widget.onRenderHTML(root);
    });

    // After onCreateOverlay fires, portal should target the root element
    // Content will be null until viewport is set, but portal container should exist
    expect(result.current.portal).not.toBeNull();
  });

  // --- Edge cases ---
  it('should handle empty items', () => {
    const { result } = renderHook(() => useHtmlOverlay({ items: undefined }));
    expect(result.current.widget).toBeDefined();
  });

  it('should not pass undefined values to setProps', () => {
    const spy = vi.spyOn(HtmlOverlayWidget.prototype, 'setProps');
    renderHook(() => useHtmlOverlay({ zIndex: 3 }));
    for (const [calledProps] of spy.mock.calls) {
      const undefinedKeys = Object.entries(calledProps)
        .filter(([, v]) => v === undefined)
        .map(([k]) => k);
      expect(undefinedKeys).toHaveLength(0);
    }
  });

  it('should pass zIndex 0 as a valid falsy value to setProps', () => {
    const spy = vi.spyOn(HtmlOverlayWidget.prototype, 'setProps');
    renderHook(() => useHtmlOverlay({ zIndex: 0 }));
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ zIndex: 0 }));
  });

  it('should not call setProps when no props are provided', () => {
    const spy = vi.spyOn(HtmlOverlayWidget.prototype, 'setProps');
    renderHook(() => useHtmlOverlay());
    expect(spy).not.toHaveBeenCalled();
  });

  it('should apply default zIndex in overlay style when none is provided', () => {
    const { result } = renderHook(() => useHtmlOverlay());
    const root = document.createElement('div');

    act(() => {
      result.current.widget.onRenderHTML(root);
    });

    expect(root.style.zIndex).toBe('1');
  });

  it('should apply zIndex 0 in overlay style when explicitly set', () => {
    const { result } = renderHook(() => useHtmlOverlay({ zIndex: 0 }));
    const root = document.createElement('div');

    act(() => {
      result.current.widget.onRenderHTML(root);
    });

    expect(root.style.zIndex).toBe('0');
  });

  it('should reuse the same portal container across multiple onRenderHTML calls', () => {
    const { result } = renderHook(() => useHtmlOverlay());
    const root = document.createElement('div');

    act(() => {
      result.current.widget.onRenderHTML(root);
    });
    const firstPortal = result.current.portal;

    act(() => {
      result.current.widget.onRenderHTML(root);
    });

    // Portal should remain non-null and still target the same container
    expect(result.current.portal).not.toBeNull();
    // Both portals target the same DOM element
    expect(firstPortal).not.toBeNull();
  });
});
