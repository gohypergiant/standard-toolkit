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

import { createColumnHelper } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Table } from './index';

type Person = {
  id: string;
  firstName: string;
  lastName: string;
};

const columnHelper = createColumnHelper<Person>();

const columns = [
  columnHelper.accessor('firstName', {
    id: 'firstName',
    cell: (info) => info.getValue(),
    header: () => <span>First Name</span>,
  }),
  columnHelper.accessor('lastName', {
    id: 'lastName',
    cell: (info) => info.getValue(),
    header: () => <span>Last Name</span>,
  }),
];

const PAGE_SIZE = 10;

const allData: Person[] = Array.from({ length: 25 }, (_, i) => ({
  id: `person-${i + 1}`,
  firstName: `first-${i + 1}`,
  lastName: `last-${i + 1}`,
}));

describe('Table with built-in pagination', () => {
  it('should render correct number of rows on first page', () => {
    render(<Table columns={columns} data={allData} pageSize={PAGE_SIZE} />);

    const rows = screen.getAllByRole('row');
    // 1 header row + 10 data rows
    expect(rows).toHaveLength(11);
    expect(screen.getByText('first-1')).toBeInTheDocument();
    expect(screen.getByText('first-10')).toBeInTheDocument();
  });

  it('should show next page data after clicking next', async () => {
    render(<Table columns={columns} data={allData} pageSize={PAGE_SIZE} />);

    await userEvent.click(screen.getByLabelText('Next page'));

    expect(screen.getByText('first-11')).toBeInTheDocument();
    expect(screen.getByText('first-20')).toBeInTheDocument();
    expect(screen.queryByText('first-1')).not.toBeInTheDocument();
  });

  it('should navigate back to previous page', async () => {
    render(<Table columns={columns} data={allData} pageSize={PAGE_SIZE} />);

    await userEvent.click(screen.getByLabelText('Next page'));
    expect(screen.getByText('first-11')).toBeInTheDocument();

    await userEvent.click(screen.getByLabelText('Previous page'));
    expect(screen.getByText('first-1')).toBeInTheDocument();
    expect(screen.queryByText('first-11')).not.toBeInTheDocument();
  });

  it('should display correct total pages in pagination', () => {
    render(<Table columns={columns} data={allData} pageSize={PAGE_SIZE} />);

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Page 1 of 3');
  });

  it('should not render pagination when pageSize is omitted', () => {
    render(<Table columns={columns} data={allData} />);

    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    // Verify all 25 rows render (no silent truncation)
    const rows = screen.getAllByRole('row');
    // 1 header row + 25 data rows
    expect(rows).toHaveLength(26);
  });

  it('should show correct partial row count on last page', async () => {
    render(<Table columns={columns} data={allData} pageSize={PAGE_SIZE} />);

    // Navigate to page 3 (last page with 5 rows)
    await userEvent.click(screen.getByLabelText('Next page'));
    await userEvent.click(screen.getByLabelText('Next page'));

    const rows = screen.getAllByRole('row');
    // 1 header row + 5 data rows
    expect(rows).toHaveLength(6);
    expect(screen.getByText('first-21')).toBeInTheDocument();
    expect(screen.getByText('first-25')).toBeInTheDocument();
  });
});
