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

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Drawer } from './';

function setup() {
  render(
    <Drawer.Provider>
      <Drawer.Main>Main</Drawer.Main>
      <Drawer id='settings' placement='left'>
        <Drawer.Title>Title</Drawer.Title>
        <Drawer.Panel>Content</Drawer.Panel>
        <Drawer.Footer>Footer</Drawer.Footer>
      </Drawer>
    </Drawer.Provider>,
  );
}

describe('Drawer', () => {
  it('should render', () => {
    setup();

    expect(screen.getByText('Main')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });
});
