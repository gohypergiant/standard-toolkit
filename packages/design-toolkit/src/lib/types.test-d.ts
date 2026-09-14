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

import { describe, expectTypeOf, it } from 'vitest';
import type { AccordionStyleVariants } from '../components/accordion/types';
import type { ListItemVariant } from '../components/list/types';
import type { MenuProps } from '../components/menu/types';
import type { TableContextValue, TableProps } from '../components/table/types';
import type { TreeStyleVariant } from '../components/tree/types';
import type { DensityVariant } from './types';

type ProvisionalSubset = 'cozy' | 'compact';

describe('DensityVariant', () => {
  it('should have exactly the three density members', () => {
    expectTypeOf<DensityVariant>().toEqualTypeOf<
      'cozy' | 'compact' | 'crammed'
    >();
  });

  it('should be the full union for Tree under its existing name', () => {
    expectTypeOf<TreeStyleVariant>().toEqualTypeOf<DensityVariant>();
  });

  it('should be the provisional two-valued subset for List', () => {
    expectTypeOf<ListItemVariant>().toEqualTypeOf<ProvisionalSubset>();
  });

  it('should be the provisional two-valued subset for Menu', () => {
    expectTypeOf<
      NonNullable<MenuProps<object>['variant']>
    >().toEqualTypeOf<ProvisionalSubset>();
  });

  it('should be the provisional two-valued subset for Accordion', () => {
    expectTypeOf<
      NonNullable<AccordionStyleVariants['variant']>
    >().toEqualTypeOf<ProvisionalSubset>();
  });

  it('should not accept crammed for List', () => {
    expectTypeOf<'crammed'>().not.toExtend<ListItemVariant>();
  });
});

type Track = { id: string };
type DataTableProps = Extract<TableProps<Track>, { children?: never }>;
// the children-mode member is the one without a required `columns`
type ChildrenTableProps = Exclude<TableProps<Track>, { columns: unknown }>;

describe('Table variant', () => {
  it('should accept the full density union in data mode', () => {
    expectTypeOf<
      NonNullable<DataTableProps['variant']>
    >().toEqualTypeOf<DensityVariant>();
  });

  it('should reject an unknown density value', () => {
    expectTypeOf<'dense'>().not.toExtend<DataTableProps['variant']>();
  });

  it('should not accept variant in children mode', () => {
    expectTypeOf<ChildrenTableProps['variant']>().toEqualTypeOf<undefined>();
  });

  it('should require variant in the context value', () => {
    expectTypeOf<
      TableContextValue['variant']
    >().toEqualTypeOf<DensityVariant>();
    expectTypeOf<
      Omit<TableContextValue, 'variant'>
    >().not.toExtend<TableContextValue>();
  });
});
