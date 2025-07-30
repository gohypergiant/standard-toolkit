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
import type { VariantProps } from 'tailwind-variants';

export const LinesStyles = tv({
  variants: {
    size: {
      small: 'min-h-l w-m ',
      medium: 'min-h-xl w-l',
      large: 'h-xxl w-xl',
    },
    variant: {
      branch: [
        'bg-position-[center,center_right] [background-repeat:repeat-y,no-repeat] [background-size:1px_4px,50%_1px]',
        'bg-[repeating-linear-gradient(to_bottom,var(--colors-neutral-04)_0%,var(--colors-neutral-04)_1px,transparent_1px,transparent_4px),repeating-linear-gradient(to_right,var(--colors-neutral-04)_0%,var(--colors-neutral-04)_1px,transparent_1px,transparent_4px)]',
      ],
      vert: [
        'bg-center bg-size-[1px_4px] bg-repeat-y',
        'bg-[repeating-linear-gradient(to_bottom,var(--colors-neutral-04)_0%,var(--colors-neutral-04)_1px,transparent_1px,transparent_4px)]',
      ],
      last: [
        'bg-position-[center_top,center_right] [background-repeat:no-repeat] [background-size:1px_50%,50%_1px]',
        'bg-[repeating-linear-gradient(to_bottom,var(--colors-neutral-04)_0%,var(--colors-neutral-04)_1px,transparent_1px,transparent_4px),repeating-linear-gradient(to_right,var(--colors-neutral-04)_0%,var(--colors-neutral-04)_1px,transparent_1px,transparent_4px)]',
      ],
    },
    showLines: {
      false: 'bg-none',
    },
  },
});

export type LinesStylesVariants = VariantProps<typeof LinesStyles>;
