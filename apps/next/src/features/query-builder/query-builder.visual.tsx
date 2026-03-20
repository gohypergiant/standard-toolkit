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
import {
  createVisualTestScenarios,
  type VisualTestScenario,
} from '~/visual-regression/vitest';
import type { QueryBuilderProps } from '@accelint/design-toolkit/components/query-builder/types';

const noop = () => {
  return null;
};

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

const emptyQuery: QueryBuilderProps['query'] = {
  combinator: 'AND',
  rules: [{ field: '', operator: '', value: '' }],
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

const validationFields: QueryBuilderProps['fields'] = [
  {
    name: 'name',
    label: 'Name',
    type: 'str',
    inputType: 'text',
    operators: [
      { name: '=', value: '=', label: '=' },
      { name: 'contains', value: 'contains', label: 'contains' },
    ],
    validator: () => ({
      valid: false,
      reasons: ['Name is required'],
    }),
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
    validator: () => ({
      valid: false,
      reasons: ['Must be a positive number'],
    }),
  },
];

const validationQuery: QueryBuilderProps['query'] = {
  combinator: 'AND',
  rules: [
    { field: 'name', operator: 'contains', value: '' },
    { field: 'altitude', operator: '>', value: '-100' },
  ],
};

const nullOperatorFields: QueryBuilderProps['fields'] = [
  {
    name: 'name',
    label: 'Name',
    type: 'str',
    inputType: 'text',
    operators: [
      { name: '=', value: '=', label: '=' },
      { name: 'null', value: 'null', label: 'is null' },
      { name: 'notNull', value: 'notNull', label: 'is not null' },
    ],
  },
  {
    name: 'altitude',
    label: 'Altitude',
    type: 'i32',
    inputType: 'number',
    operators: [
      { name: '>', value: '>', label: '>' },
      { name: '=', value: '=', label: '=' },
    ],
  },
];

const nullOperatorQuery: QueryBuilderProps['query'] = {
  combinator: 'AND',
  rules: [
    { field: 'name', operator: 'null', value: '' },
    { field: 'altitude', operator: '>', value: '5000' },
  ],
};

const selectValidationFields: QueryBuilderProps['fields'] = [
  {
    name: 'region',
    label: 'Region',
    type: 'str',
    valueEditorType: 'select',
    values: [
      { name: 'north', value: 'north', label: 'North' },
      { name: 'south', value: 'south', label: 'South' },
    ],
    operators: [{ name: '=', value: '=', label: '=' }],
    validator: () => ({
      valid: false,
      reasons: ['Region selection is required'],
    }),
  },
];

const selectValidationQuery: QueryBuilderProps['query'] = {
  combinator: 'AND',
  rules: [{ field: 'region', operator: '=', value: '' }],
};

const betweenFields: QueryBuilderProps['fields'] = [
  {
    name: 'altitude',
    label: 'Altitude',
    type: 'i32',
    inputType: 'number',
    operators: [
      { name: 'between', value: 'between', label: 'between' },
      { name: '=', value: '=', label: '=' },
    ],
  },
];

const betweenQuery: QueryBuilderProps['query'] = {
  combinator: 'AND',
  rules: [{ field: 'altitude', operator: 'between', value: ['1000', '5000'] }],
};

const textareaFields: QueryBuilderProps['fields'] = [
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
];

const textareaQuery: QueryBuilderProps['query'] = {
  combinator: 'AND',
  rules: [
    {
      field: 'notes',
      operator: 'contains',
      value: 'Multi-line content\nfor testing textarea rendering',
    },
  ],
};

const editorFields: QueryBuilderProps['fields'] = [
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
];

const editorQuery: QueryBuilderProps['query'] = {
  combinator: 'AND',
  rules: [
    { field: 'confirmed', operator: '=', value: true },
    { field: 'priority', operator: '=', value: 'high' },
  ],
};

const scenarios: VisualTestScenario[] = [
  {
    name: 'horizontal (default)',
    render: () => (
      <QueryBuilder
        fields={fields}
        query={query}
        onQueryChange={noop}
        orientation='horizontal'
        showRuleLines={true}
      />
    ),
    screenshotName: 'query-builder-horizontal.png',
    className: 'p-s',
  },
  {
    name: 'vertical',
    render: () => (
      <QueryBuilder
        fields={fields}
        query={query}
        onQueryChange={noop}
        orientation='vertical'
        showRuleLines={true}
      />
    ),
    screenshotName: 'query-builder-vertical.png',
    className: 'p-s',
  },
  {
    name: 'no rule lines',
    render: () => (
      <QueryBuilder
        fields={fields}
        query={query}
        onQueryChange={noop}
        orientation='horizontal'
        showRuleLines={false}
      />
    ),
    screenshotName: 'query-builder-no-rule-lines.png',
    className: 'p-s',
  },
  {
    name: 'disabled',
    render: () => (
      <QueryBuilder
        fields={fields}
        query={query}
        onQueryChange={noop}
        disabled={true}
      />
    ),
    screenshotName: 'query-builder-disabled.png',
    className: 'p-s',
  },
  {
    name: 'with clone buttons',
    render: () => (
      <QueryBuilder
        fields={fields}
        query={query}
        onQueryChange={noop}
        showCloneButtons={true}
      />
    ),
    screenshotName: 'query-builder-clone-buttons.png',
    className: 'p-s',
  },
  {
    name: 'with lock buttons',
    render: () => (
      <QueryBuilder
        fields={fields}
        query={query}
        onQueryChange={noop}
        showLockButtons={true}
      />
    ),
    screenshotName: 'query-builder-lock-buttons.png',
    className: 'p-s',
  },
  {
    name: 'empty query',
    render: () => (
      <QueryBuilder fields={fields} query={emptyQuery} onQueryChange={noop} />
    ),
    screenshotName: 'query-builder-empty.png',
    className: 'p-s',
  },
  {
    name: 'nested groups',
    render: () => (
      <QueryBuilder
        fields={fields}
        query={nestedQuery}
        onQueryChange={noop}
        showCloneButtons={true}
        showRuleLines={true}
      />
    ),
    screenshotName: 'query-builder-nested-groups.png',
    className: 'p-s',
  },
  {
    name: 'vertical nested groups',
    render: () => (
      <QueryBuilder
        fields={fields}
        query={nestedQuery}
        onQueryChange={noop}
        orientation='vertical'
        showCloneButtons={true}
        showRuleLines={true}
      />
    ),
    screenshotName: 'query-builder-vertical-nested-groups.png',
    className: 'p-s',
  },
  {
    name: 'validation errors',
    render: () => (
      <QueryBuilder
        fields={validationFields}
        query={validationQuery}
        onQueryChange={noop}
      />
    ),
    screenshotName: 'query-builder-validation-errors.png',
    className: 'p-s',
  },
  {
    name: 'between operator',
    render: () => (
      <QueryBuilder
        fields={betweenFields}
        query={betweenQuery}
        onQueryChange={noop}
      />
    ),
    screenshotName: 'query-builder-between-operator.png',
    className: 'p-s',
  },
  {
    name: 'textarea editor',
    render: () => (
      <QueryBuilder
        fields={textareaFields}
        query={textareaQuery}
        onQueryChange={noop}
      />
    ),
    screenshotName: 'query-builder-textarea-editor.png',
    className: 'p-s',
  },
  {
    name: 'checkbox and radio editors',
    render: () => (
      <QueryBuilder
        fields={editorFields}
        query={editorQuery}
        onQueryChange={noop}
      />
    ),
    screenshotName: 'query-builder-checkbox-radio-editors.png',
    className: 'p-s',
  },
  {
    name: 'null operator (no value editor)',
    render: () => (
      <QueryBuilder
        fields={nullOperatorFields}
        query={nullOperatorQuery}
        onQueryChange={noop}
      />
    ),
    screenshotName: 'query-builder-null-operator.png',
    className: 'p-s',
  },
  {
    name: 'select validation error',
    render: () => (
      <QueryBuilder
        fields={selectValidationFields}
        query={selectValidationQuery}
        onQueryChange={noop}
      />
    ),
    screenshotName: 'query-builder-select-validation.png',
    className: 'p-s',
  },
  {
    name: 'clone and lock buttons with nested groups',
    render: () => (
      <QueryBuilder
        fields={fields}
        query={nestedQuery}
        onQueryChange={noop}
        showCloneButtons={true}
        showLockButtons={true}
        showRuleLines={true}
      />
    ),
    screenshotName: 'query-builder-clone-lock-nested.png',
    className: 'p-s',
  },
  {
    name: 'no rule lines with nested groups',
    render: () => (
      <QueryBuilder
        fields={fields}
        query={nestedQuery}
        onQueryChange={noop}
        showRuleLines={false}
      />
    ),
    screenshotName: 'query-builder-no-rule-lines-nested.png',
    className: 'p-s',
  },
];

createVisualTestScenarios('QueryBuilder', scenarios);
