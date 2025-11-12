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
/** biome-ignore-all lint/correctness/useUniqueElementIds: ids are unique for these tests */

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Tree } from './index';
import { TreeItem } from './item';
import { TreeItemContent } from './item-content';

describe('Tree', () => {
  it('should render', () => {
    render(
      <Tree aria-label='Static example'>
        <TreeItem id='fruit' textValue='fruit'>
          <TreeItemContent>Fruit</TreeItemContent>
          <TreeItem id='apples' textValue='apples'>
            <TreeItemContent>Apples</TreeItemContent>
            <TreeItem id='green' textValue='green-apple'>
              <TreeItemContent>Green Apple</TreeItemContent>
            </TreeItem>
          </TreeItem>
        </TreeItem>
        <TreeItem id='vegetables' textValue='vegetables'>
          <TreeItemContent>Vegetables</TreeItemContent>
          <TreeItem id='carrot' textValue='carrot'>
            <TreeItemContent>Carrot</TreeItemContent>
          </TreeItem>
        </TreeItem>
      </Tree>,
    );

    expect(screen.getByRole('treegrid')).toBeInTheDocument();
  });
});
