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
  Fragment,
  type JSX,
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
    element: JSX.Element | null,
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

  protected scaleWithZoom(n: number): number {
    return n / 2 ** (20 - this.getZoom());
  }

  protected breakpointWithZoom<T>(threshold: number, a: T, b: T): T {
    return this.getZoom() > threshold ? a : b;
  }

  protected getCoords(
    viewport: Viewport,
    coordinates: number[],
  ): [number, number] {
    const pos = viewport.project(coordinates);
    if (!pos) {
      return [-1, -1];
    }
    return pos as [number, number];
  }

  protected inView(viewport: Viewport, [x, y]: [number, number]): boolean {
    const overflowMargin = this.props.overflowMargin ?? 0;
    const { width, height } = viewport;
    return !(
      x < -overflowMargin ||
      y < -overflowMargin ||
      x > width + overflowMargin ||
      y > height + overflowMargin
    );
  }

  protected getOverlayItems(_viewport: Viewport): ReactElement[] {
    const { items } = this.props;
    return (items ? Children.toArray(items) : []) as ReactElement[];
  }

  protected projectItems(
    items: ReactElement[],
    viewport: Viewport,
  ): ReactElement[] {
    const renderItems: ReactElement[] = [];
    items.filter(Boolean).forEach((item, index) => {
      const coordinates = (item.props as Record<string, unknown>)?.coordinates;
      if (!coordinates) {
        return;
      }
      const [x, y] = this.getCoords(viewport, coordinates as number[]);
      if (this.inView(viewport, [x, y])) {
        const key = item.key ?? index;
        renderItems.push(
          cloneElement(item, { x, y, key } as Record<string, unknown>),
        );
      }
    });

    return renderItems;
  }

  override onRenderHTML(rootElement: HTMLElement): void {
    Object.assign(rootElement.style, ROOT_STYLE, {
      zIndex: `${this.props.zIndex ?? 1}`,
    });

    const viewport = this.getViewport();
    const element = viewport
      ? (() => {
          const overlayItems = this.getOverlayItems(viewport);
          const renderedItems = this.projectItems(overlayItems, viewport);
          return <Fragment>{renderedItems}</Fragment>;
        })()
      : null;

    const { onRenderOverlay, onCreateOverlay } = this.props;
    if (onRenderOverlay) {
      if (!this.overlayRootInitialized) {
        this.overlayRoot = onCreateOverlay?.(rootElement) ?? null;
        this.overlayRootInitialized = true;
      }
      onRenderOverlay(this.overlayRoot, element, rootElement);
      return;
    }

    if (!this.reactRoot) {
      this.reactRoot = createRoot(rootElement);
    }
    this.reactRoot.render(element);
  }
}
