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

interface ConstrainBodyOptions {
  width: number;
}

interface SavedChildState {
  el: HTMLElement;
  minHeight: string;
  height: string;
}

/**
 * Constrain document.body to tightly wrap its visible content.
 * Use for portal components (combobox, select, tooltip) where the overlay
 * renders outside the React container into document.body.
 * Returns a cleanup function to restore original styles.
 */
export function constrainBodyToContent(
  options: ConstrainBodyOptions,
): () => void {
  const saved = {
    htmlHeight: document.documentElement.style.height,
    htmlMinHeight: document.documentElement.style.minHeight,
    bodyWidth: document.body.style.width,
    bodyHeight: document.body.style.height,
    bodyMinHeight: document.body.style.minHeight,
    bodyOverflow: document.body.style.overflow,
    children: [] as SavedChildState[],
  };

  document.body.style.width = `${options.width}px`;
  document.body.style.overflow = 'visible';

  let maxBottom = 0;
  for (const el of document.body.querySelectorAll('*')) {
    const rect = el.getBoundingClientRect();
    if (rect.height > 0) {
      maxBottom = Math.max(maxBottom, rect.bottom);
    }
  }

  const tightHeight = `${Math.ceil(maxBottom) + 8}px`;
  document.documentElement.style.height = tightHeight;
  document.documentElement.style.minHeight = '0';
  document.body.style.height = tightHeight;
  document.body.style.minHeight = '0';

  for (const child of document.body.children) {
    if (child instanceof HTMLElement) {
      saved.children.push({
        el: child,
        minHeight: child.style.minHeight,
        height: child.style.height,
      });
      child.style.minHeight = '0';
      child.style.height = 'auto';
    }
  }

  return () => {
    document.documentElement.style.height = saved.htmlHeight;
    document.documentElement.style.minHeight = saved.htmlMinHeight;
    document.body.style.width = saved.bodyWidth;
    document.body.style.height = saved.bodyHeight;
    document.body.style.minHeight = saved.bodyMinHeight;
    document.body.style.overflow = saved.bodyOverflow;
    for (const { el, minHeight, height } of saved.children) {
      el.style.minHeight = minHeight;
      el.style.height = height;
    }
  };
}
