---
title: Table
description: Configurable data table with sorting, selection, pagination, and row actions
source: packages/design-toolkit/src/components/table/index.tsx
source_sha: 64cbc01cd2b212f8139249ca03762baa8c48ef73
doc_sha: pending
deprecated: false
updated: 2026-05-28
---

# Table

Configurable data table component with sorting, selection, pagination, and row actions. Built on TanStack Table for powerful data management.

## Usage

```tsx
import { Table } from '@accelint/design-toolkit';

const columns = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: 'Email',
  },
];

const data = [
  { id: '1', name: 'Alice', email: 'alice@example.com' },
  { id: '2', name: 'Bob', email: 'bob@example.com' },
];

export function MyComponent() {
  return <Table columns={columns} data={data} />;
}
```

## Reference

```typescript
interface TableProps<T extends { id: Key }> {
  columns: ColumnDef<T>[];
  data: T[];
  showCheckbox?: boolean;
  enableSorting?: boolean;
  enableColumnReordering?: boolean;
  enableRowActions?: boolean;
  kebabPosition?: 'left' | 'right';
  persistRowKebabMenu?: boolean;
  persistHeaderKebabMenu?: boolean;
  persistNumerals?: boolean;
  manualSorting?: boolean;
  fullWidth?: boolean;
  pageSize?: number;
  page?: number;
  defaultPage?: number;
  rowSelection?: RowSelectionState;
  onSortChange?: (columnId: string, sortDirection: 'asc' | 'desc' | null) => void;
  onColumnReorderChange?: (index: number) => void;
  onRowSelectionChange?: (selection: RowSelectionState | ((old: RowSelectionState) => RowSelectionState)) => void;
  onPageChange?: (page: number) => void;
}
```

### Props

| Prop | Type | Default | Required |
|------|------|---------|----------|
| `columns` | `ColumnDef<T>[]` | - | Yes |
| `data` | `T[]` | - | Yes |
| `showCheckbox` | `boolean` | `false` | No |
| `enableSorting` | `boolean` | `true` | No |
| `enableColumnReordering` | `boolean` | `true` | No |
| `enableRowActions` | `boolean` | `true` | No |
| `kebabPosition` | `'left' \| 'right'` | `'right'` | No |
| `persistRowKebabMenu` | `boolean` | `true` | No |
| `persistHeaderKebabMenu` | `boolean` | `true` | No |
| `persistNumerals` | `boolean` | `false` | No |
| `manualSorting` | `boolean` | `false` | No |
| `fullWidth` | `boolean` | `false` | No |
| `pageSize` | `number` | - | No |
| `page` | `number` | - | No |
| `defaultPage` | `number` | `1` | No |
| `rowSelection` | `RowSelectionState` | `{}` | No |

#### `columns`

Array of column definitions following TanStack Table's `ColumnDef` format. Each column must have an `id` and typically an `accessorKey` or `accessorFn`.

#### `data`

Array of data objects. Each object must have a unique `id` property.

#### `showCheckbox`

Adds a selection checkbox column. Works with `rowSelection` and `onRowSelectionChange` for controlled selection.

#### `enableSorting`

Enables click-to-sort on column headers. Use with `manualSorting` for server-side sorting.

#### `enableColumnReordering`

Allows columns to be reordered via drag-and-drop. Fires `onColumnReorderChange` callback.

#### `enableRowActions`

Shows row action menu (kebab menu) with options to pin, move up/down rows.

#### `kebabPosition`

Position of the row action menu column:
- `'left'` - Menu appears as first column
- `'right'` - Menu appears as last column

#### `persistRowKebabMenu` / `persistHeaderKebabMenu`

Controls visibility of action menus:
- `true` - Always visible
- `false` - Visible only on row/header hover

#### `manualSorting`

When `true`, table assumes data is pre-sorted (for server-side sorting). Use with `onSortChange` callback.

#### `pageSize`

Enables built-in pagination with specified rows per page. Use with `page`/`onPageChange` for controlled pagination.

#### `fullWidth`

When `true`, table takes full container width and uses fixed table layout.

### Callbacks

#### `onSortChange(columnId, sortDirection)`

Called when column sort changes. `sortDirection` is `'asc'`, `'desc'`, or `null`.

#### `onColumnReorderChange(index)`

Called when column is reordered via drag-and-drop.

#### `onRowSelectionChange(selection)`

Called when row selection changes. Receives TanStack Table's updater function or direct value.

#### `onPageChange(page)`

Called when pagination page changes (1-indexed).

### Inherited Props

Table extends all standard HTML table attributes, including `className`, `role`, etc.

## Examples

### Example: Basic data table

```tsx
import { Table } from '@accelint/design-toolkit';

const columns = [
  { id: 'name', accessorKey: 'name', header: 'Name' },
  { id: 'role', accessorKey: 'role', header: 'Role' },
];

const data = [
  { id: '1', name: 'Alice', role: 'Engineer' },
  { id: '2', name: 'Bob', role: 'Designer' },
];

<Table columns={columns} data={data} enableSorting />
```

### Example: Table with row selection

```tsx
import { Table } from '@accelint/design-toolkit';
import { useState } from 'react';

function SelectableTable() {
  const [selection, setSelection] = useState({});
  
  return (
    <Table 
      columns={columns}
      data={data}
      showCheckbox
      rowSelection={selection}
      onRowSelectionChange={setSelection}
    />
  );
}
```

### Example: Server-side sorting

```tsx
import { Table } from '@accelint/design-toolkit';
import { useState } from 'react';

function ServerSortedTable() {
  const [sortBy, setSortBy] = useState(null);
  const [sortDir, setSortDir] = useState(null);
  
  const handleSortChange = (columnId, direction) => {
    setSortBy(columnId);
    setSortDir(direction);
    // Fetch sorted data from server
    fetchData({ sortBy: columnId, sortDir: direction });
  };
  
  return (
    <Table 
      columns={columns}
      data={data}
      manualSorting
      onSortChange={handleSortChange}
    />
  );
}
```

### Example: Paginated table

```tsx
import { Table, Pagination } from '@accelint/design-toolkit';
import { useState } from 'react';

function PaginatedTable() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  
  return (
    <>
      <Table 
        columns={columns}
        data={data}
        pageSize={pageSize}
        page={page}
        onPageChange={setPage}
      />
      <Pagination 
        page={page}
        pageSize={pageSize}
        total={data.length}
        onChange={setPage}
      />
    </>
  );
}
```

### Example: Custom column rendering

```tsx
import { Table } from '@accelint/design-toolkit';
import { Badge } from '@accelint/design-toolkit';

const columns = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'User',
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue();
      return (
        <Badge color={status === 'active' ? 'normal' : 'critical'}>
          {status}
        </Badge>
      );
    },
  },
];

<Table columns={columns} data={users} />
```

### Example: Full-width table

```tsx
import { Table } from '@accelint/design-toolkit';

<Table 
  columns={columns}
  data={data}
  fullWidth
/>
```

> **Good to know:** The `fullWidth` prop applies `table-fixed` layout, which distributes column widths evenly unless explicit `size` is set in column definitions.

## Related

- [TableBody](./body.md) - Table body component for custom tables
- [TableHeader](./header.md) - Table header component
- [TableRow](./row.md) - Table row component
- [TableCell](./cell.md) - Table cell component
- [Pagination](../pagination/index.md) - Pagination controls
- [Checkbox](../checkbox/index.md) - Used for row selection
