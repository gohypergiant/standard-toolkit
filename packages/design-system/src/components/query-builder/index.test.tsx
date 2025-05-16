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

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { QueryBuilder } from './';
import { fields } from './dataset-sample';
import type { QueryBuilderProps } from './types';

function setup(props: Partial<QueryBuilderProps> = {}) {
  render(<QueryBuilder {...props} />);

  return props;
}

describe('QueryBuilder', () => {
  it('should render empty without rules', () => {
    setup();

    expect(screen.getByRole('form')).toBeInTheDocument();
  });

  it('should render with rules', () => {
    const props = {
      query: {
        combinator: 'and',
        rules: [
          { field: 'AK_HIGH', operator: '>', value: '10000' }, // i32
          { field: 'AK_LOW', operator: 'between', value: '1000,5000' }, // between
          { field: 'PRIVATEUSE', operator: 'in', value: ['Mixed', 'Private'] }, // options
          { field: 'SERVCITY', operator: 'like', value: 'Anchorage' }, // options with headers
          { field: 'OPERSTATUS', operator: '=', value: true }, // bool
          { field: 'DONUTS', operator: '=', value: true }, // switch
          { field: 'TYPE_CODE', operator: '=', value: 'Aerodrome' }, // radio
          { field: 'NOTES', operator: 'contains', value: 'Clear skies...' }, // textarea
          { field: 'NICKNAME', operator: 'like', value: 'Old Bumpy' }, // text
        ],
      },
      fields,
    };

    setup(props);
    expect(screen.getByRole('form')).toBeInTheDocument();
  });
});
