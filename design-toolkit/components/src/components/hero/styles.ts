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

export const HeroStyles = tv({
  slots: {
    hero: 'group/hero relative flex flex-col layout-stack:rounded-large layout-stack:bg-transparent-light layout-stack:px-l layout-stack:py-xl layout-grid:pl-xxl',
    icon: 'fg-default-dark -order-3 group-layout-grid/hero:absolute group-layout-grid/hero:top-xxs group-layout-grid/hero:left-xs group-layout-stack/hero:mb-l group-layout-stack/hero:size-[48px]',
    title: 'fg-default-light -order-2 mb-xs text-header-xl',
    subtitle: 'fg-default-dark -order-1 block text-header-l',
  },
});
