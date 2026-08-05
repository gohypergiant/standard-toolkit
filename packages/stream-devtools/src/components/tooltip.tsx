// __private-exports

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

import { createSignal, Show } from 'solid-js';
import { FONT_SANS, PALETTE } from './tokens';
import type { JSX } from 'solid-js';

// query-devtools `statusTooltip`, rebuilt with real elements — inline
// styles can't do the ::before/::after arrow layers
const WRAPPER_STYLE = 'display:inline-flex;flex-shrink:0;position:relative;';

const BUBBLE_STYLE = [
  `background:${PALETTE.tooltipBg}`,
  `border:1px solid ${PALETTE.tooltipBorder}`,
  'border-radius:4px',
  `color:${PALETTE.text}`,
  `font-family:${FONT_SANS}`,
  'font-size:11px',
  'font-weight:400',
  'left:50%',
  'padding:2px 8px',
  'position:absolute',
  'text-transform:none',
  'top:100%',
  'transform:translate(-50%, 8px)',
  'white-space:nowrap',
  'z-index:1',
].join(';');

const ARROW_COMMON = [
  'border-color:transparent',
  'border-style:solid',
  'border-width:7px',
  'height:0',
  'left:50%',
  'position:absolute',
  'top:0',
  'width:0',
].join(';');

const ARROW_BORDER_STYLE = `${ARROW_COMMON};border-bottom-color:${PALETTE.tooltipBorder};transform:translate(-50%, -100%);`;

const ARROW_FILL_STYLE = `${ARROW_COMMON};border-bottom-color:${PALETTE.tooltipBg};transform:translate(-50%, calc(-100% + 2px));`;

/**
 * Bordered bubble below the anchor. Inline-flex wrapper drops into flex
 * rows without changing layout. The wrapper only mirrors hover/focus of its
 * interactive CHILD (bubbled events); it is not itself operable.
 */
export function Tooltip(props: { label: string; children: JSX.Element }) {
  const [visible, setVisible] = createSignal(false);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: the wrapper only mirrors hover/focus of its interactive CHILD (bubbled events); it is not itself operable
    <span
      onFocusIn={() => setVisible(true)}
      onFocusOut={() => setVisible(false)}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      style={WRAPPER_STYLE}
    >
      {props.children}
      <Show when={visible()}>
        <span role='tooltip' style={BUBBLE_STYLE}>
          <span aria-hidden='true' style={ARROW_BORDER_STYLE} />
          <span aria-hidden='true' style={ARROW_FILL_STYLE} />
          {props.label}
        </span>
      </Show>
    </span>
  );
}
