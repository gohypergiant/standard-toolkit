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
import { useStyles } from '../styles/use-styles';
import type { JSX } from 'solid-js';

/**
 * Bordered bubble below the anchor. Inline-flex wrapper drops into flex
 * rows without changing layout. The wrapper only mirrors hover/focus of its
 * interactive CHILD (bubbled events); it is not itself operable.
 */
export function Tooltip(props: { label: string; children: JSX.Element }) {
  const styles = useStyles();
  const [visible, setVisible] = createSignal(false);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: the wrapper only mirrors hover/focus of its interactive CHILD (bubbled events); it is not itself operable
    <span
      onFocusIn={() => setVisible(true)}
      onFocusOut={() => setVisible(false)}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      class={styles().tooltipWrapper}
    >
      {props.children}
      <Show when={visible()}>
        {/* query-devtools `statusTooltip`, rebuilt with real elements — the
            arrow layers are spans rather than ::before/::after */}
        <span role='tooltip' class={styles().tooltipBubble}>
          <span aria-hidden='true' class={styles().tooltipArrowBorder} />
          <span aria-hidden='true' class={styles().tooltipArrowFill} />
          {props.label}
        </span>
      </Show>
    </span>
  );
}
