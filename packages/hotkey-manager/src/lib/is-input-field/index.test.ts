/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { describe, expect, it } from 'vitest';
import { isInputField } from '@/lib/is-input-field';

describe('isInputField', () => {
  it('should return false if no target', () => {
    const event = new KeyboardEvent('keydown');

    expect(isInputField(event)).toBe(false);
  });

  it('should return false if target is not an input', () => {
    const target = document.createElement('div');
    const event = new KeyboardEvent('keydown');

    expect(
      isInputField({
        ...event,
        target,
      }),
    ).toBe(false);
  });

  it('should return true if target is an input', () => {
    const target = document.createElement('input');
    const event = new KeyboardEvent('keydown');

    expect(
      isInputField({
        ...event,
        target,
      }),
    ).toBe(true);
  });

  it('should return true if target is a text area', () => {
    const target = document.createElement('textarea');
    const event = new KeyboardEvent('keydown');

    expect(
      isInputField({
        ...event,
        target,
      }),
    ).toBe(true);
  });

  it('should return true if target is content editable', () => {
    const target = document.createElement('div');
    document.body.appendChild(target);
    target.contentEditable = 'true';
    const event = new KeyboardEvent('keydown');

    expect(
      isInputField({
        ...event,
        target,
      }),
    ).toBe(true);
  });
});
