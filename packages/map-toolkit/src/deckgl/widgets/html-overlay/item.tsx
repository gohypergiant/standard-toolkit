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
