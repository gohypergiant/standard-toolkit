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

/**
 * Fix Virtualizer item widths in test environments.
 * React Aria's Virtualizer uses `contain: size layout style` on wrappers
 * but doesn't set explicit widths, causing 0-width items in headless browsers.
 */
export function fixVirtualizerItemWidths(listbox: Element): void {
  const wrappers = listbox.querySelectorAll<HTMLElement>('[style*="contain"]');
  for (const wrapper of wrappers) {
    const parent = wrapper.parentElement;
    if (parent) {
      wrapper.style.width = `${parent.getBoundingClientRect().width}px`;
    }
  }
}
