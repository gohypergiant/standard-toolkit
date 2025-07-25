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

import { MAX_VISIBLE_PAGES } from './constants';

const range = (lo: number, hi: number) =>
  Array.from({ length: hi - lo }, (_, i) => i + lo);

export const pagination = (page: number, total: number) => {
  const start = Math.max(
    1,
    Math.min(
      page - Math.floor((MAX_VISIBLE_PAGES - 3) / 2),
      total - MAX_VISIBLE_PAGES + 2,
    ),
  );
  const end = Math.min(
    total,
    Math.max(
      page + Math.floor((MAX_VISIBLE_PAGES - 2) / 2),
      MAX_VISIBLE_PAGES - 1,
    ),
  );
  return [
    ...(start > 2 ? ([1, 'ellipsis'] as const) : start > 1 ? [1] : []),
    ...range(start, end + 1),
    ...(end < total - 1
      ? (['ellipsis', total] as const)
      : end < total
        ? [total]
        : []),
  ];
};
