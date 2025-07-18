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
import type {
  Field,
  Option,
  OptionGroup,
  RuleType,
  ValidationResult,
  ValueEditorType,
} from 'react-querybuilder';

// Example of an options with grouping
export const serviceCityOptions: OptionGroup[] = [
  {
    label: 'Alaska',
    options: [
      { name: 'Anchorage', label: 'Anchorage', value: 'Anchorage' },
      { name: 'Juneau', label: 'Juneau', value: 'Juneau' },
      {
        name: 'Fairbanks',
        label: 'Fairbanks',
        value: 'Fairbanks',
      },
      { name: 'Sitka', label: 'Sitka', value: 'Sitka' },
    ],
  },
  {
    label: 'Alabama',
    options: [
      { name: 'Montgomery', label: 'Montgomery', value: 'Montgomery' },
      { name: 'Birmingham', label: 'Birmingham', value: 'Birmingham' },
      {
        name: 'Huntsville',
        label: 'Huntsville',
        value: 'Huntsville',
      },
      { name: 'Mobile', label: 'Mobile', value: 'Mobile' },
    ],
  },
];

// Example of options
export const airportUseOptions: Option[] = [
  { name: 'Private', label: 'Private', value: 'Private' },
  { name: 'Public', label: 'Public', value: 'Public' },
  { name: 'Mixed', label: 'Mixed', value: 'Mixed' },
  { name: 'Unknown', label: 'Unknown', value: 'Unknown' },
];

// Example of radio options
export const airportTypeOptions: Option[] = [
  { name: 'Heliport', label: 'Heliport', value: 'Heliport' },
  { name: 'Aerodrome', label: 'Aerodrome', value: 'Aerodrome' },
  { name: 'Unknown', label: 'Unknown', value: 'Unknown' },
];

type FieldTypes = 'bool' | 'i32' | 'str' | 'f64' | 'date' | 'datetime' | 'time';
type FieldConfig = Partial<{
  inputType: 'text' | 'number' | 'date' | 'datetime-local' | 'time';
  operators: Option[];
  validator: (rule: RuleType) => ValidationResult;
  valueEditorType: ValueEditorType;
}>;

const typeMap: Record<FieldTypes, FieldConfig> = {
  i32: {
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
  f64: {
    inputType: 'number',
    operators: [
      { name: '=', value: '=', label: 'is' } as const,
      { name: '<', value: '<', label: 'less than' } as const,
      { name: '>', value: '>', label: 'greater than' } as const,
      { name: '<=', value: '<=', label: 'less than equal' } as const,
      { name: '>=', value: '>=', label: 'greater than equal' } as const,
      { name: 'between', value: 'BETWEEN', label: 'between' } as const,
      { name: 'in', value: 'IN', label: 'in' } as const,
    ],
    validator: (rule) => ({
      valid: z.coerce
        .number()
        .int()
        .gte(-9_007_199_254_740_991)
        .lte(9_007_199_254_740_991)
        .safeParse(rule.value).success,
      reasons: ['Number must be in range.'],
    }),
  },
  bool: {
    operators: [{ name: '=', value: '=', label: 'is' } as const],
    validator: (rule) => ({
      valid: z.coerce.boolean().safeParse(rule.value).success,
      reasons: ['Value is required'],
    }),
    valueEditorType: 'checkbox',
  },
  str: {
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
  date: {
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
  datetime: {
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
  time: {
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
};

export const fields = [
  {
    id: 'AK_HIGH',
    name: 'AK_HIGH',
    label: 'AK High',
    type: 'i32',
    ...typeMap.i32,
  },
  {
    id: 'AK_LOW',
    name: 'AK_LOW',
    label: 'AK Low',
    type: 'i32',
    ...typeMap.i32,
  },
  {
    id: 'COUNTRY',
    name: 'COUNTRY',
    label: 'Country',
    type: 'str',
    ...typeMap.str,
  },
  {
    id: 'ELEVATION',
    name: 'ELEVATION',
    label: 'Elevation',
    type: 'f64',
  },
  {
    id: 'OPERSTATUS',
    name: 'OPERSTATUS',
    label: 'Is Operational',
    type: 'str',
    defaultValue: false,
    operators: [{ name: '=', value: '=', label: 'is' } as const],
    ...typeMap.bool,
  },
  {
    id: 'PRIVATEUSE',
    name: 'PRIVATEUSE',
    label: 'Private Use',
    type: 'str',
    valueEditorType: 'multiselect',
    values: airportUseOptions,
    operators: [{ name: 'in', value: 'in', label: 'in' } as const],
  },
  {
    id: 'DONUTS',
    name: 'DONUTS',
    label: 'Has Donuts',
    type: 'bool',
    operators: [{ name: '=', value: '=', label: 'is' } as const],
    valueEditorType: 'switch',
  },
  {
    id: 'SERVCITY',
    name: 'SERVCITY',
    valueEditorType: 'select',
    values: serviceCityOptions,
    label: 'Service City',
    type: 'str',
    operators: [
      { name: '=', value: '=', label: 'is' } as const,
      { name: 'like', value: 'like', label: 'like' } as const,
      { name: 'in', value: 'in', label: 'in' } as const,
      { name: 'between', value: 'between', label: 'between' } as const,
    ],
  },
  {
    id: 'TYPE_CODE',
    name: 'TYPE_CODE',
    label: 'Type Code',
    type: 'str',
    valueEditorType: 'radio',
    values: airportTypeOptions,
    defaultValue: 'Aerodrome',
  },
  {
    id: 'NOTES',
    name: 'NOTES',
    label: 'Operator Notes',
    type: 'str',
    valueEditorType: 'textarea',
  },
  {
    id: 'NICKNAME',
    name: 'NICKNAME',
    label: 'Airport Nickname',
    type: 'str',
    ...typeMap.str,
  },
  {
    id: 'ESTABLISHED',
    name: 'ESTABLISHED',
    label: 'Established',
    type: 'date',
    ...typeMap.date,
  },
  {
    id: 'MAINTENANCE',
    name: 'MAINTENANCE',
    label: 'Maintenance',
    type: 'datetime',
    ...typeMap.datetime,
  },
  {
    id: 'PEAK_TRAFFIC',
    name: 'PEAK_TRAFFIC',
    label: 'Peak Traffic',
    type: 'time',
    ...typeMap.time,
  },
] satisfies Field[];
