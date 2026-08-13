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

import { Pagination } from '@accelint/design-toolkit/components/pagination';
import {
  createInteractiveVisualTests,
  createVisualTestScenarios,
  generateVariantMatrix,
} from '~/visual-regression/vitest';
import type { PaginationProps } from '@accelint/design-toolkit/components/pagination/types';

// ---------------------------------------------------------------------------
// Interactive state tests — page toggle button hover/focus/press
// ---------------------------------------------------------------------------

const variants = generateVariantMatrix<
  Pick<PaginationProps, 'total' | 'value'>
>({
  dimensions: {
    total: [4],
  },
  baseProps: {
    value: 2,
  },
});

createInteractiveVisualTests({
  componentName: 'Pagination',
  renderComponent: (props) => <Pagination {...props} />,
  testId: 'test-pagination',
  variants,
  interactionTarget: 'button:nth-of-type(4)',
  states: ['default', 'hover', 'focus', 'pressed'],
  className: 'p-s',
});

// ---------------------------------------------------------------------------
// Scenario tests — configuration variants
// ---------------------------------------------------------------------------

createVisualTestScenarios('Pagination', [
  {
    name: 'first page (prev disabled)',
    render: () => <Pagination total={4} value={1} />,
    screenshotName: 'pagination-first-page.png',
    className: 'inline-block p-s',
  },
  {
    name: 'last page (next disabled)',
    render: () => <Pagination total={4} value={4} />,
    screenshotName: 'pagination-last-page.png',
    className: 'inline-block p-s',
  },
  {
    name: 'many pages (windowed)',
    render: () => <Pagination total={20} value={10} />,
    screenshotName: 'pagination-many-pages.png',
    className: 'inline-block p-s',
  },
  {
    name: 'single page',
    render: () => <Pagination total={1} value={1} />,
    screenshotName: 'pagination-single-page.png',
    className: 'inline-block p-s',
  },
  {
    name: 'loading state',
    render: () => <Pagination total={4} value={1} isLoading />,
    screenshotName: 'pagination-loading.png',
    className: 'inline-block p-s',
  },
]);
