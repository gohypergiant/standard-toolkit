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

import { tv } from 'tailwind-variants';

export const LinkStyles = tv({
  base: [
    'inline-flex gap-xs px-xs items-center leading-none',
    'enabled:fg-accent-primary-bold',
    'enabled:hover:bg-interactive-bold-hover enabled:hover:fg-accent-primary-hover',
    'enabled:focus-visible:bg-interactive-bold-hover enabled:focus-visible:fg-accent-primary-hover',
    'enabled:pressed:bg-interactive-bold-pressed enabled:pressed:fg-accent-primary-pressed',
    'enabled:cursor-pointer',
    'disabled:fg-disabled',
    'disabled:cursor-not-allowed',
  ],
});
