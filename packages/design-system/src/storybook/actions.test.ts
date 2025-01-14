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

import { action } from '@ladle/react';
import { describe, expect, it, vi } from 'vitest';
import { actions } from './actions';

vi.mock('@ladle/react', () => ({
  action: vi.fn(() => () => {
    return undefined;
  }),
}));

describe('actions', () => {
  it('should return action handler props', () => {
    const props = actions<{ onChange: () => void }>('onChange');

    expect(props).toEqual({
      onChange: expect.any(Function),
    });

    props.onChange?.();

    expect(action).toHaveBeenCalledWith('onChange');
  });
});
