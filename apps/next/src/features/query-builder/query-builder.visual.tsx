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

import { QueryBuilder } from '@accelint/design-toolkit/components/query-builder';
import { dash } from 'radashi';
import {
  createVisualTestScenarios,
  type VisualTestScenario,
} from '~/visual-regression/vitest';
import type { QueryBuilderProps } from '@accelint/design-toolkit/components/query-builder/types';

const noop = () => {
  return null;
};

// ---------------------------------------------------------------------------
// Scenario factory
// ---------------------------------------------------------------------------

type ScenarioProps = Partial<QueryBuilderProps> &
  Pick<QueryBuilderProps, 'fields' | 'query'>;

function scenario(name: string, props: ScenarioProps): VisualTestScenario {
  return {
    name,
    render: () => <QueryBuilder onQueryChange={noop} {...props} />,
    screenshotName: `query-builder-${dash(name)}.png`,
    className: 'p-s',
  };
}

// ---------------------------------------------------------------------------
// Shared data
// ---------------------------------------------------------------------------

const fields: QueryBuilderProps['fields'] = [
  {
    name: 'name',
    label: 'Name',
    type: 'str',
    inputType: 'text',
    operators: [
      { name: '=', value: '=', label: '=' },
      { name: 'contains', value: 'contains', label: 'contains' },
    ],
  },
  {
    name: 'altitude',
    label: 'Altitude',
    type: 'i32',
    inputType: 'number',
    operators: [
      { name: '>', value: '>', label: '>' },
      { name: '<', value: '<', label: '<' },
      { name: '=', value: '=', label: '=' },
    ],
  },
  {
    name: 'active',
    label: 'Active',
    type: 'bool',
    inputType: 'text',
    valueEditorType: 'switch',
    operators: [{ name: '=', value: '=', label: '=' }],
  },
  {
    name: 'region',
    label: 'Region',
    type: 'str',
    inputType: 'text',
    valueEditorType: 'select',
    values: [
      { name: 'north', value: 'north', label: 'North' },
      { name: 'south', value: 'south', label: 'South' },
      { name: 'east', value: 'east', label: 'East' },
      { name: 'west', value: 'west', label: 'West' },
    ],
    operators: [
      { name: '=', value: '=', label: '=' },
      { name: '!=', value: '!=', label: '!=' },
    ],
  },
];

const query: QueryBuilderProps['query'] = {
  combinator: 'AND',
  rules: [
    { field: 'name', operator: 'contains', value: 'Alpha' },
    { field: 'altitude', operator: '>', value: '10000' },
    { field: 'active', operator: '=', value: true },
    { field: 'region', operator: '=', value: 'north' },
  ],
};

const nestedQuery: QueryBuilderProps['query'] = {
  combinator: 'AND',
  rules: [
    { field: 'name', operator: 'contains', value: 'Alpha' },
    {
      combinator: 'OR',
      rules: [
        { field: 'altitude', operator: '>', value: '10000' },
        { field: 'region', operator: '=', value: 'north' },
      ],
    },
    { field: 'active', operator: '=', value: true },
  ],
};

// ---------------------------------------------------------------------------
// Prop-combination scenarios (same base data, different layout/feature props)
// ---------------------------------------------------------------------------

const propScenarios: VisualTestScenario[] = [
  scenario('horizontal (default)', {
    fields,
    query,
    orientation: 'horizontal',
    showRuleLines: true,
  }),
  scenario('vertical', {
    fields,
    query,
    orientation: 'vertical',
    showRuleLines: true,
  }),
  scenario('no rule lines', {
    fields,
    query,
    orientation: 'horizontal',
    showRuleLines: false,
  }),
  scenario('disabled', {
    fields,
    query,
    disabled: true,
  }),
  scenario('with clone buttons', {
    fields,
    query,
    showCloneButtons: true,
  }),
  scenario('with lock buttons', {
    fields,
    query,
    showLockButtons: true,
  }),
  scenario('empty query', {
    fields,
    query: {
      combinator: 'AND',
      rules: [{ field: '', operator: '', value: '' }],
    },
  }),
  scenario('nested groups', {
    fields,
    query: nestedQuery,
    showCloneButtons: true,
    showRuleLines: true,
  }),
  scenario('vertical nested groups', {
    fields,
    query: nestedQuery,
    orientation: 'vertical',
    showCloneButtons: true,
    showRuleLines: true,
  }),
  scenario('clone and lock buttons with nested groups', {
    fields,
    query: nestedQuery,
    showCloneButtons: true,
    showLockButtons: true,
    showRuleLines: true,
  }),
  scenario('no rule lines with nested groups', {
    fields,
    query: nestedQuery,
    showRuleLines: false,
  }),
];

// ---------------------------------------------------------------------------
// Content-variation scenarios (different fields/queries per editor type)
// ---------------------------------------------------------------------------

const contentScenarios: VisualTestScenario[] = [
  scenario('validation errors', {
    fields: [
      {
        ...fields[0],
        validator: () => ({ valid: false, reasons: ['Name is required'] }),
      },
      {
        ...fields[1],
        validator: () => ({
          valid: false,
          reasons: ['Must be a positive number'],
        }),
      },
    ],
    query: {
      combinator: 'AND',
      rules: [
        { field: 'name', operator: 'contains', value: '' },
        { field: 'altitude', operator: '>', value: '-100' },
      ],
    },
  }),

  scenario('select validation error', {
    fields: [
      {
        ...fields[3],
        values: [
          { name: 'north', value: 'north', label: 'North' },
          { name: 'south', value: 'south', label: 'South' },
        ],
        validator: () => ({
          valid: false,
          reasons: ['Region selection is required'],
        }),
      },
    ],
    query: {
      combinator: 'AND',
      rules: [{ field: 'region', operator: '=', value: '' }],
    },
  }),

  scenario('null operator (no value editor)', {
    fields: [
      {
        ...fields[0],
        operators: [
          { name: '=', value: '=', label: '=' },
          { name: 'null', value: 'null', label: 'is null' },
          { name: 'notNull', value: 'notNull', label: 'is not null' },
        ],
      },
      fields[1],
    ],
    query: {
      combinator: 'AND',
      rules: [
        { field: 'name', operator: 'null', value: '' },
        { field: 'altitude', operator: '>', value: '5000' },
      ],
    },
  }),

  scenario('between operator', {
    fields: [
      {
        ...fields[1],
        operators: [
          { name: 'between', value: 'between', label: 'between' },
          { name: '=', value: '=', label: '=' },
        ],
      },
    ],
    query: {
      combinator: 'AND',
      rules: [
        { field: 'altitude', operator: 'between', value: ['1000', '5000'] },
      ],
    },
  }),

  scenario('textarea editor', {
    fields: [
      {
        name: 'notes',
        label: 'Notes',
        type: 'str',
        valueEditorType: 'textarea',
        operators: [
          { name: '=', value: '=', label: '=' },
          { name: 'contains', value: 'contains', label: 'contains' },
        ],
      },
    ],
    query: {
      combinator: 'AND',
      rules: [
        {
          field: 'notes',
          operator: 'contains',
          value: 'Multi-line content\nfor testing textarea rendering',
        },
      ],
    },
  }),

  scenario('checkbox and radio editors', {
    fields: [
      {
        name: 'confirmed',
        label: 'Confirmed',
        type: 'bool',
        valueEditorType: 'checkbox',
        operators: [{ name: '=', value: '=', label: '=' }],
      },
      {
        name: 'priority',
        label: 'Priority',
        type: 'str',
        valueEditorType: 'radio',
        values: [
          { name: 'low', value: 'low', label: 'Low' },
          { name: 'medium', value: 'medium', label: 'Medium' },
          { name: 'high', value: 'high', label: 'High' },
        ],
        operators: [{ name: '=', value: '=', label: '=' }],
      },
    ],
    query: {
      combinator: 'AND',
      rules: [
        { field: 'confirmed', operator: '=', value: true },
        { field: 'priority', operator: '=', value: 'high' },
      ],
    },
  }),
];

// ---------------------------------------------------------------------------
// Register all scenarios
// ---------------------------------------------------------------------------

createVisualTestScenarios('QueryBuilder', [
  ...propScenarios,
  ...contentScenarios,
]);
