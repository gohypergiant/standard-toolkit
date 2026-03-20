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

import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

/**
 * Props for {@link HtmlOverlayItem}.
 *
 * Extends standard HTML div attributes with geographic positioning. The `x` and
 * `y` props are injected by {@link HtmlOverlayWidget} after coordinate projection
 * and do not need to be set manually.
 */
export type HtmlOverlayItemProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  /** Injected by HtmlOverlayWidget */
  x?: number;
  /** Injected by HtmlOverlayWidget */
  y?: number;

  /** Coordinates of this overlay in [lng, lat] (and optional z). */
  coordinates: number[];
  children?: ReactNode;
  className?: string;
};

const ITEM_STYLE = {
  userSelect: 'none',
} as const satisfies Partial<CSSStyleDeclaration>;

/**
 * Wrapper component for content rendered at a geographic position on the map.
 *
 * Place inside the `items` prop of {@link useHtmlOverlay} or
 * {@link HtmlOverlayWidget}. The widget projects the `coordinates` to screen
 * pixels and wraps each item in a positioned `<div>` using CSS transforms for
 * smooth zoom behaviour.
 *
 * @param props - Overlay item props including geographic coordinates.
 * @param props.coordinates - Geographic position as `[lng, lat]` with optional altitude.
 * @param props.x - Screen x pixel (injected by the widget after projection).
 * @param props.y - Screen y pixel (injected by the widget after projection).
 * @param props.children - Content to render at this position.
 * @param props.className - CSS class for the wrapper div.
 *
 * @example
 * ```tsx
 * <HtmlOverlayItem coordinates={[-122.45, 37.78]}>
 *   <div className="tooltip">San Francisco</div>
 * </HtmlOverlayItem>
 * ```
 */
export function HtmlOverlayItem({
  x = 0,
  y = 0,
  coordinates,
  children,
  className,
  ...props
}: Readonly<HtmlOverlayItemProps>) {
  return (
    // Using transform translate to position overlay items will result in a smooth zooming
    // effect, whereas using the top/left css properties will cause overlay items to
    // jiggle when zooming
    <div style={ITEM_STYLE} className={className} {...props}>
      {children}
    </div>
  );
}
