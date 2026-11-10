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

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DrawerLayout } from './layout';

describe('DrawerLayout', () => {
  it('should serialize supplied placement tracks without forwarding the tracks prop', () => {
    const tracks = {
      top: '72px',
      right: 'minmax(18rem, 30vw)',
      bottom: 'var(--bottom-track)',
      left: 'calc(12rem + 8px)',
    };
    const { container } = render(<DrawerLayout tracks={tracks} />);
    const layout = container.firstElementChild as HTMLElement;

    expect(layout.style.getPropertyValue('--drawer-top-configured-size')).toBe(
      tracks.top,
    );
    expect(
      layout.style.getPropertyValue('--drawer-right-configured-size'),
    ).toBe(tracks.right);
    expect(
      layout.style.getPropertyValue('--drawer-bottom-configured-size'),
    ).toBe(tracks.bottom);
    expect(layout.style.getPropertyValue('--drawer-left-configured-size')).toBe(
      tracks.left,
    );
    expect(layout).not.toHaveAttribute('tracks');
  });

  it('should serialize only the configured placement tracks', () => {
    const { container } = render(
      <DrawerLayout tracks={{ left: 'var(--navigation-width)' }} />,
    );
    const layout = container.firstElementChild as HTMLElement;

    expect(layout.style.getPropertyValue('--drawer-left-configured-size')).toBe(
      'var(--navigation-width)',
    );
    expect(layout.style.getPropertyValue('--drawer-top-configured-size')).toBe(
      '',
    );
    expect(
      layout.style.getPropertyValue('--drawer-right-configured-size'),
    ).toBe('');
    expect(
      layout.style.getPropertyValue('--drawer-bottom-configured-size'),
    ).toBe('');
  });

  it('should preserve caller styles when tracks are omitted', () => {
    const { container } = render(<DrawerLayout style={{ color: 'red' }} />);
    const layout = container.firstElementChild as HTMLElement;

    expect(layout.style.color).toBe('red');
    expect(layout.style.getPropertyValue('--drawer-left-configured-size')).toBe(
      '',
    );
  });
});
