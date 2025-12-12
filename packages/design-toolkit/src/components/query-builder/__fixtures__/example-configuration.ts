// __private-exports
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

import { z } from 'zod';
import type { Field } from 'react-querybuilder';

/**
 * Represents sample field types and data for building a query.
 * These fields and their validators are for demonstration of capability and are not required for implementation.
 *
 */
export const fields: Field[] = [
  {
    name: 'AK_HIGH',
    label: 'AK High',
    type: 'i32',
    inputType: 'number', // as in HTML input type <input type="number">
    operators: [
      { name: '=', value: '=', label: 'is' } as const,
      { name: '<', value: '<', label: 'less than' } as const,
      { name: '>', value: '>', label: 'greater than' } as const,
      { name: '<=', value: '<=', label: 'less than equal' } as const,
      { name: '>=', value: '>=', label: 'greater than equal' } as const,
      { name: 'between', value: 'between', label: 'between' } as const,
      { name: 'in', value: 'in', label: 'in' } as const,
    ],
    validator: (rule) => ({
      valid: z
        .union([
          z.coerce.number().int().gte(-2_147_483_648).lte(2_147_483_647),
          z.tuple([
            z.coerce.number().int().gte(-2_147_483_648).lte(2_147_483_647),
            z.coerce.number().int().gte(-2_147_483_648).lte(2_147_483_647),
          ]),
        ])
        .safeParse(rule.value).success,
      reasons: ['Number must be in range.'],
    }),
  },
  {
    name: 'AK_LOW',
    label: 'AK Low',
    type: 'i32',
    inputType: 'number', // as in HTML input type <input type="number">
    operators: [
      { name: '=', value: '=', label: 'is' } as const,
      { name: '<', value: '<', label: 'less than' } as const,
      { name: '>', value: '>', label: 'greater than' } as const,
      { name: '<=', value: '<=', label: 'less than equal' } as const,
      { name: '>=', value: '>=', label: 'greater than equal' } as const,
      { name: 'between', value: 'between', label: 'between' } as const,
      { name: 'in', value: 'in', label: 'in' } as const,
    ],
    validator: (rule) => ({
      valid: z
        .union([
          z.coerce.number().int().gte(-2_147_483_648).lte(2_147_483_647),
          z.tuple([
            z.coerce.number().int().gte(-2_147_483_648).lte(2_147_483_647),
            z.coerce.number().int().gte(-2_147_483_648).lte(2_147_483_647),
          ]),
        ])
        .safeParse(rule.value).success,
      reasons: ['Number must be in range.'],
    }),
  },
  {
    name: 'COUNTRY',
    label: 'Country',
    type: 'str',
    operators: [
      { name: '=', value: '=', label: 'is' } as const,
      { name: 'like', value: 'like', label: 'like' } as const,
      { name: 'in', value: 'in', label: 'in' } as const,
    ],
    inputType: 'text',
    validator: (rule) => ({
      valid: z.string().min(1).safeParse(rule.value).success,
      reasons: ['At least one character is required.'],
    }),
  },
  {
    name: 'NOTES',
    label: 'Operator Notes',
    type: 'str',
    valueEditorType: 'textarea',
  },
  {
    name: 'OPERSTATUS',
    label: 'Is Operational',
    type: 'bool',
    defaultValue: false,
    operators: [{ name: '=', value: '=', label: 'is' } as const],
    valueEditorType: 'checkbox',
  },
  {
    name: 'DONUTS',
    label: 'Has Donuts',
    type: 'bool',
    operators: [{ name: '=', value: '=', label: 'is' } as const],
    valueEditorType: 'switch',
  },
  {
    name: 'SERVCITY',
    label: 'Service City',
    valueEditorType: 'select',
    values: [
      { name: 'Anchorage', label: 'Anchorage', value: 'Anchorage' },
      { name: 'Juneau', label: 'Juneau', value: 'Juneau' },
      {
        name: 'Fairbanks',
        label: 'Fairbanks',
        value: 'Fairbanks',
      },
      { name: 'Sitka', label: 'Sitka', value: 'Sitka' },
      { name: 'Montgomery', label: 'Montgomery', value: 'Montgomery' },
      { name: 'Birmingham', label: 'Birmingham', value: 'Birmingham' },
      {
        name: 'Huntsville',
        label: 'Huntsville',
        value: 'Huntsville',
      },
      { name: 'Mobile', label: 'Mobile', value: 'Mobile' },
    ],
    type: 'str',
    operators: [
      { name: '=', value: '=', label: 'is' } as const,
      { name: 'like', value: 'like', label: 'like' } as const,
      { name: 'in', value: 'in', label: 'in' } as const,
      { name: 'between', value: 'between', label: 'between' } as const,
    ],
  },
  {
    name: 'TYPE_CODE',
    label: 'Type Code',
    type: 'str',
    operators: [{ name: '=', value: '=', label: 'is' } as const],
    valueEditorType: 'radio',
    values: [
      { name: 'Heliport', label: 'Heliport', value: 'Heliport' },
      { name: 'Aerodrome', label: 'Aerodrome', value: 'Aerodrome' },
      { name: 'Unknown', label: 'Unknown', value: 'Unknown' },
    ],
    defaultValue: 'Aerodrome',
  },
  {
    name: 'ESTABLISHED',
    label: 'Established',
    type: 'date',
    operators: [
      { name: 'equals', value: 'tequals', label: 'is' } as const,
      { name: 'during', value: 'during', label: 'occurs between' } as const,
      { name: 'before', value: 'before', label: 'ends before' } as const,
      { name: 'after', value: 'after', label: 'starts after' } as const,
      {
        name: 'overlapped',
        value: 'overlappedby',
        label: 'starts during',
      } as const,
      { name: 'overlaps', value: 'toverlaps', label: 'ends during' } as const,
    ],
    inputType: 'date',
    validator: (rule) => ({
      valid: z
        .union([
          z.string().min(1),
          z.tuple([z.string().min(1), z.string().min(1)]),
        ])
        .safeParse(rule.value).success,
      reasons: ['At least one character is required.'],
    }),
  },
  {
    name: 'MAINTENANCE',
    label: 'Maintenance',
    type: 'datetime',
    operators: [
      { name: 'equals', value: 'tequals', label: 'is' } as const,
      { name: 'during', value: 'during', label: 'occurs between' } as const,
      { name: 'before', value: 'before', label: 'ends before' } as const,
      { name: 'after', value: 'after', label: 'starts after' } as const,
      {
        name: 'overlapped',
        value: 'overlappedby',
        label: 'starts during',
      } as const,
      { name: 'overlaps', value: 'toverlaps', label: 'ends during' } as const,
    ],
    inputType: 'datetime-local', // mm/dd/yyyy hh:mm a
    validator: (rule) => ({
      valid: z
        .union([
          z.string().min(1),
          z.tuple([z.string().min(1), z.string().min(1)]),
        ])
        .safeParse(rule.value).success,
      reasons: ['At least one character is required.'],
    }),
  },
  {
    name: 'PEAK_TRAFFIC',
    label: 'Peak Traffic',
    type: 'time',
    operators: [
      { name: 'equals', value: 'tequals', label: 'is' } as const,
      { name: 'during', value: 'during', label: 'occurs between' } as const,
      { name: 'before', value: 'before', label: 'ends before' } as const,
      { name: 'after', value: 'after', label: 'starts after' } as const,
      {
        name: 'overlapped',
        value: 'overlappedby',
        label: 'starts during',
      } as const,
      { name: 'overlaps', value: 'toverlaps', label: 'ends during' } as const,
    ],
    inputType: 'time', // hh:mm a
    validator: (rule) => ({
      valid: z
        .union([
          z.string().min(1),
          z.tuple([z.string().min(1), z.string().min(1)]),
        ])
        .safeParse(rule.value).success,
      reasons: ['At least one character is required.'],
    }),
  },
] satisfies Field[];

/**
 * Represents an initial query to populate the rulesets
 * to illustrate examples.
 */
export const defaultQuery = {
  combinator: 'AND',
  rules: [
    { field: 'AK_HIGH', operator: '>', value: '10000' }, // i32
    { field: 'AK_LOW', operator: 'between', value: ['1000', '5000'] }, // between
    { field: 'COUNTRY', operator: 'like', value: 'Canada' }, //text
    { field: 'NOTES', operator: 'contains', value: 'Clear skies...' }, // textarea
    { field: 'SERVCITY', operator: 'like', value: 'Anchorage' }, // options with headers
    { field: 'OPERSTATUS', operator: '=', value: false }, // bool
    { field: 'DONUTS', operator: '=', value: true }, // switch
    { field: 'TYPE_CODE', operator: '=', value: 'Aerodrome' }, // radio
    {
      field: 'ESTABLISHED',
      operator: 'during',
      value: ['2024-10-01', '2024-11-01'],
    }, // date
    {
      field: 'PEAK_TRAFFIC',
      operator: 'overlaps',
      value: ['18:22:54', '19:22:54'],
    }, // time
    {
      field: 'MAINTENANCE',
      operator: 'overlapped',
      value: ['2024-10-01T18:22:54', '2024-11-01T18:22:54'],
    }, // datetime
  ],
};
