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

import { ThemeProvider } from '@accelint/design-toolkit';
import { Table } from '@accelint/design-toolkit/components/table';
import { createColumnHelper } from '@tanstack/react-table';
import { dash } from 'radashi';
import { describe, expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import {
  createVisualTestScenarios,
  insertModeInFilename,
  THEME_MODES,
} from '~/visual-regression/vitest';
import { DATA, type Person, PROP_COMBOS, type TableScenario } from './variants';

const columnHelper = createColumnHelper<Person>();

const columns = [
  columnHelper.accessor('firstName', {
    id: 'firstName',
    cell: (info) => info.getValue(),
    header: () => <span>First Name</span>,
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>Last Name</span>,
  }),
  columnHelper.accessor('age', {
    id: 'age',
    cell: (info) => info.renderValue(),
    header: () => 'Age',
    size: 42,
  }),
  columnHelper.accessor('visits', {
    id: 'visits',
    header: () => <span>Visits</span>,
    size: 42,
  }),
  columnHelper.accessor('status', {
    id: 'status',
    header: 'Status',
  }),
  columnHelper.accessor('progress', {
    id: 'progress',
    header: 'Profile Progress',
  }),
];

function renderScenario(scenario: TableScenario) {
  const data = scenario.emptyData ? [] : DATA;

  return (
    <Table
      columns={columns}
      data={data}
      showCheckbox={scenario.showCheckbox}
      kebabPosition={scenario.kebabPosition}
      persistHeaderKebabMenu={scenario.persistHeaderKebabMenu}
      persistRowKebabMenu={scenario.persistRowKebabMenu}
      persistNumerals={scenario.persistNumerals}
      enableSorting={scenario.enableSorting}
      enableColumnReordering={scenario.enableColumnReordering}
      enableRowActions={scenario.enableRowActions}
      fullWidth={scenario.fullWidth}
      rowSelection={scenario.rowSelection}
    />
  );
}

// Declarative scenarios (no interaction needed)
createVisualTestScenarios(
  'Table',
  PROP_COMBOS.filter((s) => !s.isSorted).map((scenario) => ({
    name: scenario.name,
    className: scenario.className,
    screenshotName: scenario.screenshotName,
    render: () => renderScenario(scenario),
  })),
);

// Interactive scenarios: sorting requires clicking the kebab menu with trusted events
const sortedScenarios = PROP_COMBOS.filter((s) => s.isSorted);

describe('Table Sorted Visual Regression', () => {
  for (const scenario of sortedScenarios) {
    for (const mode of THEME_MODES) {
      const filename = insertModeInFilename(scenario.screenshotName, mode);

      test(`${scenario.name} (${mode} mode)`, async () => {
        const testIdValue = `vrt-scenario-${dash(scenario.name)}`;

        render(
          <ThemeProvider defaultMode={mode}>
            <div data-testid={testIdValue} className={scenario.className}>
              <Table
                columns={columns}
                data={DATA}
                persistNumerals={scenario.persistNumerals}
                enableSorting={scenario.enableSorting}
                enableColumnReordering={scenario.enableColumnReordering}
                enableRowActions={scenario.enableRowActions}
              />
            </div>
          </ThemeProvider>,
        );

        // Click the first data column's header kebab to open the sort menu
        const kebabButton = page
          .getByTestId(testIdValue)
          .getByRole('button', { name: 'Menu' })
          .first();

        await userEvent.click(kebabButton);

        // Wait for the menu portal to mount and animate in
        await new Promise((resolve) => setTimeout(resolve, 200));

        // Click the sort menu item (rendered in a portal outside the wrapper)
        const menuItemText =
          scenario.isSorted === 'asc' ? 'Sort Ascending' : 'Sort Descending';
        const menuItem = page.getByText(menuItemText, { exact: true });

        await userEvent.click(menuItem);

        // Wait for sort to apply and menu to close
        await new Promise((resolve) => setTimeout(resolve, 300));

        const target = page.getByTestId(testIdValue);
        await expect.element(target).toMatchScreenshot(filename);
      });
    }
  }
});
