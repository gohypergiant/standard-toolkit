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

import { tv } from '@/lib/utils';

export const DividerStyles = tv({
  base: [
    'shrink-0 grow-0 border-0 bg-[var(--outline-static)]',
    'orientation-horizontal:h-px orientation-horizontal:w-full',
    'orientation-vertical:h-full orientation-vertical:w-px',
    // CSS flexbox breaks height: 100%, so we utilize align-self: stretch & height: auto instead. While width isn't broken, for consistency it's implemented the same way
    '[&:where(.flex>&)]:self-stretch',
    '[&:where(.flex>&)]:orientation-horizontal:w-auto',
    '[&:where(.flex>&)]:orientation-vertical:h-auto',
  ],
});
