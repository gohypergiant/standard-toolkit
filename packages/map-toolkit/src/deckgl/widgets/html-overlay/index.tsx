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

import { Widget } from '@deck.gl/core';
import {
  Children,
  cloneElement,
  type ReactElement,
  type ReactNode,
} from 'react';
import { createRoot, type Root } from 'react-dom/client';
import type {
  Deck,
  Viewport,
  WidgetPlacement,
  WidgetProps,
} from '@deck.gl/core';

/**
 * Configuration for {@link HtmlOverlayWidget}.
 *
 * Extends the base Deck.gl `WidgetProps` with overlay-specific options for
 * rendering React content at geographic coordinates.
 */
export type HtmlOverlayWidgetProps = WidgetProps & {
  /** View id to attach the overlay to. Defaults to the containing view. */
  viewId?: string | null;
  /** Margin beyond the viewport before hiding overlay items. */
  overflowMargin?: number;
  /** z-index for the overlay container. */
  zIndex?: number;
  /** Items to render; defaults to the supplied children. */
  items?: ReactNode;
  /** Create an overlay root for custom rendering. */
  onCreateOverlay?: (container: HTMLElement) => unknown;
  /** Render into a previously created overlay root. */
  onRenderOverlay?: (
    overlayRoot: unknown,
    element: ReactNode,
    container: HTMLElement,
  ) => void;
};

const ROOT_STYLE: Partial<CSSStyleDeclaration> = {
  width: '100%',
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  overflow: 'hidden',
};

const OFFSCREEN: [number, number] = [-1, -1];
const EMPTY_ARRAY: ReactElement[] = [];

/**
 * Deck.gl widget that renders React elements at geographic coordinates.
 *
 * Projects `[lng, lat]` positions to screen pixels on every viewport change and
 * manages an absolutely-positioned overlay container. Items outside the viewport
 * (plus {@link HtmlOverlayWidgetProps.overflowMargin | overflowMargin}) are hidden
 * with `display: none`. When items haven't changed, the widget takes a fast path
 * and updates CSS transforms directly without a full React render.
 *
 * @template PropsT - Widget props type, defaults to {@link HtmlOverlayWidgetProps}.
 *
 * @example
 * ```typescript
 * import { HtmlOverlayWidget } from '@accelint/map-toolkit/deckgl/widgets/html-overlay';
 *
 * const overlay = new HtmlOverlayWidget({
 *   id: 'my-overlay',
 *   zIndex: 2,
 *   overflowMargin: 50,
 *   items: myReactElements,
 * });
 * ```
 */
export class HtmlOverlayWidget<
  PropsT extends HtmlOverlayWidgetProps = HtmlOverlayWidgetProps,
> extends Widget<PropsT> {
  static override readonly defaultProps = {
    id: 'html-overlay',
    viewId: null,
    // biome-ignore lint/style/useNamingConvention: Follows DeckGL format.
    _container: null,
    overflowMargin: 0,
    zIndex: 1,
    style: {},
    className: '',
  } satisfies Required<WidgetProps> &
    Required<Pick<HtmlOverlayWidgetProps, 'overflowMargin' | 'zIndex'>> &
    HtmlOverlayWidgetProps;

  placement: WidgetPlacement = 'fill';
  className = 'deck-widget-html-overlay';
  protected viewport: Viewport | null = null;
  protected overlayRoot: unknown = null;
  protected overlayRootInitialized = false;
  protected reactRoot: Root | null = null;

  constructor(props: PropsT = {} as PropsT) {
    super({ ...HtmlOverlayWidget.defaultProps, ...props });
    this.viewId = props.viewId ?? null;
  }

  override setProps(props: Partial<PropsT>): void {
    if (props.viewId !== undefined) {
      this.viewId = props.viewId;
    }
    super.setProps(props);
  }

  override onAdd({
    deck,
    viewId,
  }: {
    deck: Deck;
    viewId: string | null;
  }): void {
    this.deck = deck;
    this.viewId ??= viewId;
  }

  override onRemove(): void {
    this.deck = undefined;
    this.viewport = null;
    this.overlayRoot = null;
    this.overlayRootInitialized = false;
    this.reactRoot?.unmount();
    this.reactRoot = null;
    this.cachedItems = null;
    this.cachedItemsSource = undefined;
    this.lastRenderedItems = null;
    this.stylesApplied = false;
    this.lastZIndex = undefined;
  }

  override onViewportChange(viewport: Viewport): void {
    if (!this.viewId || this.viewId === viewport.id) {
      this.viewport = viewport;
      this.updateHTML();
    }
  }

  protected getViewport(): Viewport | null {
    return this.viewport;
  }

  protected getZoom(): number {
    return this.viewport?.zoom ?? 0;
  }

  protected getCoords(
    viewport: Viewport,
    coordinates: number[],
  ): [number, number] {
    const pos = viewport.project(coordinates);
    if (!pos) {
      return OFFSCREEN;
    }
    return pos as [number, number];
  }

  protected inView(
    width: number,
    height: number,
    x: number,
    y: number,
    overflowMargin: number,
  ): boolean {
    return !(
      x < -overflowMargin ||
      y < -overflowMargin ||
      x > width + overflowMargin ||
      y > height + overflowMargin
    );
  }

  // Cache the flattened array; invalidate when props.items changes
  private cachedItems: ReactElement[] | null = null;
  private cachedItemsSource: ReactNode | undefined;
  private lastRenderedItems: ReactElement[] | null = null;

  protected getOverlayItems(_viewport: Viewport): ReactElement[] {
    const { items } = this.props;
    if (items !== this.cachedItemsSource) {
      this.cachedItemsSource = items;
      this.cachedItems = items
        ? (Children.toArray(items) as ReactElement[])
        : EMPTY_ARRAY;
    }
    return this.cachedItems ?? EMPTY_ARRAY;
  }

  protected projectItems(
    items: ReactElement[],
    viewport: Viewport,
  ): ReactElement[] {
    const overflowMargin = this.props.overflowMargin ?? 0;
    const { width, height } = viewport;
    const renderItems: ReactElement[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item) {
        continue;
      }
      const coordinates = (item.props as Record<string, unknown>)?.coordinates;
      if (!coordinates) {
        continue;
      }
      const [x, y] = this.getCoords(viewport, coordinates as number[]);
      const visible = this.inView(width, height, x, y, overflowMargin);
      const key = item.key ?? i;

      const style = {
        position: 'absolute',
        left: 0,
        top: 0,
        transform: `translate(${x}px, ${y}px)`,
        display: visible ? undefined : 'none',
        pointerEvents: 'auto',
      } as const;

      renderItems.push(
        <div key={key} style={style}>
          {cloneElement(item, { x, y, key } as Record<string, unknown>)}
        </div>,
      );
    }

    return renderItems;
  }

  // Apply static styles once on first render; only update zIndex when it changes
  private stylesApplied = false;
  private lastZIndex: number | undefined;

  override onRenderHTML(rootElement: HTMLElement): void {
    if (!this.stylesApplied) {
      Object.assign(rootElement.style, ROOT_STYLE);
      this.stylesApplied = true;
    }
    const zIndex = this.props.zIndex;
    if (this.lastZIndex !== zIndex) {
      rootElement.style.zIndex = String(zIndex);
      this.lastZIndex = zIndex;
    }

    const viewport = this.getViewport();

    if (!viewport) {
      this.lastRenderedItems = null;
      this.renderOverlay(rootElement, null);
      return;
    }

    const overlayItems = this.getOverlayItems(viewport);

    if (overlayItems === this.lastRenderedItems) {
      // Position-only update — mutate DOM transforms directly, skip React
      this.updatePositionsDirect(rootElement, overlayItems, viewport);
    } else {
      // Items changed — full React render with positioned wrapper divs
      this.lastRenderedItems = overlayItems;
      const renderedItems = this.projectItems(overlayItems, viewport);
      this.renderOverlay(rootElement, renderedItems);
    }
  }

  private renderOverlay(rootElement: HTMLElement, element: ReactNode): void {
    const { onRenderOverlay, onCreateOverlay } = this.props;
    if (onRenderOverlay) {
      if (!this.overlayRootInitialized) {
        this.overlayRoot = onCreateOverlay?.(rootElement) ?? null;
        this.overlayRootInitialized = true;
      }
      onRenderOverlay(this.overlayRoot, element, rootElement);
      return;
    }

    this.reactRoot ??= createRoot(rootElement);
    this.reactRoot.render(element);
  }

  protected updatePositionsDirect(
    rootElement: HTMLElement,
    items: ReactElement[],
    viewport: Viewport,
  ): void {
    const overflowMargin = this.props.overflowMargin ?? 0;
    const { width, height } = viewport;
    const children = rootElement.children;
    let childIdx = 0;

    for (const element of items) {
      const item = element;
      if (!item) {
        continue;
      }
      const coordinates = (item.props as Record<string, unknown>)
        ?.coordinates as number[] | undefined;
      if (!coordinates) {
        continue;
      }

      if (childIdx >= children.length) {
        break;
      }
      const wrapper = children[childIdx] as HTMLElement;
      childIdx++;

      const [x, y] = this.getCoords(viewport, coordinates);
      const visible = this.inView(width, height, x, y, overflowMargin);

      wrapper.style.transform = `translate(${x}px, ${y}px)`;
      wrapper.style.display = visible ? '' : 'none';
    }
  }
}
