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

import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { Table } from '.';
import type { TableProps } from './types';

function setup(
  props: Partial<TableProps<{ id: string; number: number }>> = {},
) {
  return {
    ...render(<table {...props} />),
  };
}

describe('Table', () => {
  it('should render', async () => {
    setup({
      children: (
        <>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Header 1</Table.HeaderCell>
              <Table.HeaderCell>Header 2</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Cell 1</Table.Cell>
              <Table.Cell>Cell 2</Table.Cell>
            </Table.Row>
          </Table.Body>
        </>
      ),
    });
  });
});
