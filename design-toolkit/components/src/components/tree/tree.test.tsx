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
import { Tree } from './index';

describe('Tree', () => {
  it('should render', () => {
    render(
      <Tree aria-label='Static example'>
        <Tree.Item id='fruit' textValue='fruit'>
          <Tree.Item.Content>Fruit</Tree.Item.Content>
          <Tree.Item id='apples' textValue='apples'>
            <Tree.Item.Content>Apples</Tree.Item.Content>
            <Tree.Item id='green' textValue='green-apple'>
              <Tree.Item.Content>Green Apple</Tree.Item.Content>
            </Tree.Item>
          </Tree.Item>
        </Tree.Item>
        <Tree.Item id='vegetables' textValue='vegetables'>
          <Tree.Item.Content>Vegetables</Tree.Item.Content>
          <Tree.Item id='carrot' textValue='carrot'>
            <Tree.Item.Content>Carrot</Tree.Item.Content>
          </Tree.Item>
        </Tree.Item>
      </Tree>,
    );

    expect(screen.getByRole('treegrid')).toBeInTheDocument();
  });
});
