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

import { createColumnHelper } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Table, type TableProps } from './index';

type Person = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
};

const defaultData: Person[] = [
  {
    id: 'tanner',
    firstName: 'tanner',
    lastName: 'linsley',
    age: 24,
    visits: 100,
    status: 'In Relationship',
    progress: 50,
  },
  {
    id: 'tandy',
    firstName: 'tandy',
    lastName: 'miller',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80,
  },
  {
    id: 'joe',
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
  },
];

const columnHelper = createColumnHelper<Person>();

const defaultColumns = [
  columnHelper.accessor('firstName', {
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>Last Name</span>,
  }),
  columnHelper.accessor('age', {
    header: () => 'Age',
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor('visits', {
    header: () => <span>Visits</span>,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
  }),
];

function setup<T extends { id: string | number }>(props: TableProps<T>) {
  render(<Table {...props} />);
}

describe('Table', () => {
  it('should render', () => {
    setup({
      columns: defaultColumns,
      data: defaultData,
    });

    expect(screen.getByText('tanner')).toBeInTheDocument();
  });

  it('should render with checkboxes', () => {
    setup({
      columns: defaultColumns,
      data: defaultData,
      showCheckbox: true,
    });
    /**
    expect(screen.getAllByRole('checkbox')).toHaveLength(
      defaultData.length + 1,
    ); // +1 for the header checkbox
    */
  });

  it('should show kebab on hover', () => {
    setup({
      columns: defaultColumns,
      data: defaultData,
      persistKebab: false,
    });

    const kebabButton = screen.getAllByRole('button', {
      name: /row actions/i,
    })[1];
  });
});
