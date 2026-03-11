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

import {
  type JSX,
  type ReactPortal,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { HtmlOverlayWidget, type HtmlOverlayWidgetProps } from './index';

export type UseHtmlOverlayProps = Omit<
  HtmlOverlayWidgetProps,
  'onCreateOverlay' | 'onRenderOverlay' | '_container' | 'style'
> & {
  /**
   * Items to render as overlay children.
   *
   * **Must be referentially stable** — wrap inline JSX in `useMemo` or hoist
   * it outside the component. A new reference on every parent render will
   * trigger `setProps` on every render, causing unnecessary deck.gl redraws.
   *
   * @example
   * // ❌ Inline JSX creates a new reference on every parent render
   * useHtmlOverlay({ items: <Marker id="a" coordinates={[0, 0]} /> });
   *
   * // ✅ Stable reference — effect only fires when data changes
   * const items = useMemo(
   *   () => <Marker id="a" coordinates={coords} />,
   *   [coords],
   * );
   * useHtmlOverlay({ items });
   */
  items?: HtmlOverlayWidgetProps['items'];
};

export type UseHtmlOverlayResult = {
  widget: HtmlOverlayWidget;
  portal: ReactPortal | null;
};

export function useHtmlOverlay(
  props: UseHtmlOverlayProps = {},
): UseHtmlOverlayResult {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const [content, setContent] = useState<JSX.Element | null>(null);
  const widgetRef = useRef<HtmlOverlayWidget | null>(null);

  const { items, viewId, overflowMargin, zIndex, id, className } = props;

  widgetRef.current ??= new HtmlOverlayWidget({
    ...(props as HtmlOverlayWidgetProps),
    onCreateOverlay: (el) => {
      setContainer(el);
      return el;
    },
    onRenderOverlay: (_root, element) => {
      setContent(element);
    },
  });
  const widget = widgetRef.current;

  useEffect(() => {
    /**
     * Without these checks, if the hook is called with partial or no props,
     * every destructured value (e.g. zIndex, overflowMargin, className) is undefined
     * and is unconditionally merged into the widget's props object via setProps.
     *
     * Deck.gl's widget shallow-merges the partial, so zIndex: 1 → undefined, overflowMargin: 0 → undefined, etc.
     * The ?? 0 / ?? 1 runtime fallbacks in onRenderHTML masks the problem,
     * but widget.props is left in a corrupt state for any consumer that reads the props directly.
     *
     * Fix: Build an update object and only include keys whose values are not undefined.
     * Skip setProps entirely when nothing changed (bonus: eliminates redundant no-op call on initial render with no props).
     */
    const update: Partial<HtmlOverlayWidgetProps> = {};
    if (viewId !== undefined) {
      update.viewId = viewId;
    }
    if (items !== undefined) {
      update.items = items;
    }
    if (overflowMargin !== undefined) {
      update.overflowMargin = overflowMargin;
    }
    if (zIndex !== undefined) {
      update.zIndex = zIndex;
    }
    if (id !== undefined) {
      update.id = id;
    }
    if (className !== undefined) {
      update.className = className;
    }
    if (Object.keys(update).length > 0) {
      widget.setProps(update);
    }
  }, [widget, viewId, items, overflowMargin, zIndex, id, className]);

  const portal = useMemo(
    () => (container ? createPortal(content, container) : null),
    [container, content],
  );

  return { widget, portal };
}
