import { tv } from 'tailwind-variants';

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

export const SliderStyles = tv({
  slots: {
    slider: [
      'group/slider flex gap-s',
      'layout-grid:grid',
      'layout-stack:flex',
      'orientation-vertical:h-full orientation-vertical:w-fit',
      'orientation-vertical:layout-grid:grid-cols-[auto_auto_auto] orientation-vertical:layout-grid:grid-rows-[auto_auto_1fr_auto]',
      'orientation-vertical:layout-stack:flex-col',
      'orientation-horizontal:h-xl',
      'orientation-horizontal:layout-grid:grid-cols-[auto_1fr_auto] orientation-horizontal:layout-grid:grid-rows-[auto_auto_auto]',
      'orientation-horizontal:layout-stack:w-full orientation-horizontal:layout-stack:items-center',
    ],
    label: [
      'fg-primary-bold order-1',
      'group-layout-grid/slider:col-start-1',
      'group-orientation-vertical/slider:group-layout-grid/slider:col-span-2',
    ],
    inputs: [
      'order-5 flex gap-s',
      'group-layout-grid/slider:col-start-3 group-layout-grid/slider:row-start-1',
      'group-orientation-horizontal/slider:flex-row',
      'group-orientation-vertical/slider:flex-col-reverse',
      'group-orientation-vertical/slider:group-layout-grid/slider:row-start-4',
    ],
    input:
      'fg-primary-bold w-[50px] rounded-medium px-s py-xs font-display text-body-m outline outline-interactive',
    track: [
      'relative order-3 h-full',
      'group-orientation-horizontal/slider:h-[20px] group-orientation-horizontal/slider:w-full',
      'group-orientation-horizontal/slider:group-layout-grid/slider:col-span-3 group-orientation-horizontal/slider:group-layout-grid/slider:row-start-2',
      'group-orientation-vertical/slider:h-full group-orientation-vertical/slider:w-[20px]',
      'group-orientation-vertical/slider:group-layout-grid/slider:col-start-2 group-orientation-vertical/slider:group-layout-grid/slider:row-span-3 group-orientation-vertical/slider:group-layout-grid/slider:row-start-2',
    ],
    trackBackground: [
      'absolute rounded-full bg-surface-muted',
      'group-orientation-horizontal/slider:-translate-y-1/2 group-orientation-horizontal/slider:top-1/2 group-orientation-horizontal/slider:h-xxs group-orientation-horizontal/slider:w-full',
      'group-orientation-vertical/slider:-translate-x-1/2 group-orientation-vertical/slider:left-1/2 group-orientation-vertical/slider:h-full group-orientation-vertical/slider:w-xxs',
    ],
    trackValue: [
      'absolute rounded-full bg-accent-primary-bold',
      'group-orientation-horizontal/slider:-translate-y-1/2 group-orientation-horizontal/slider:top-1/2 group-orientation-horizontal/slider:right-[calc(100%-attr(data-end_%)*100)] group-orientation-horizontal/slider:left-[calc(attr(data-start_%)*100)] group-orientation-horizontal/slider:h-xxs',
      'group-orientation-vertical/slider:-translate-x-1/2 group-orientation-vertical/slider:top-[calc(100%-attr(data-end_%)*100)] group-orientation-vertical/slider:bottom-[calc(attr(data-start_%)*100)] group-orientation-vertical/slider:left-1/2 group-orientation-vertical/slider:w-xxs',
    ],
    thumb: [
      'h-m w-m rounded-full bg-accent-primary-bold outline-accent-primary-bold/40',
      'focus-visible:outline-4',
      'hover:outline-4',
      'group-orientation-horizontal/slider:top-1/2',
      'group-orientation-vertical/slider:left-1/2',
    ],
    minValue: [
      'fg-primary-muted flex items-center font-display text-body-m',
      'group-orientation-vertical/slider:col-start-1 group-orientation-vertical/slider:row-start-4',
      'group-orientation-horizontal/slider:group-layout-grid/slider:col-start-1',
      'group-orientation-horizontal/slider:group-layout-grid/slider:row-start-3',
      'group-orientation-horizontal/slider:order-2',
      'group-orientation-vertical/slider:group-layout-grid/slider:self-end',
      'group-orientation-vertical/slider:group-layout-grid/slider:justify-self-end',
      'group-orientation-vertical/slider:order-4',
    ],
    maxValue: [
      'fg-primary-muted order-4 flex items-center font-display text-body-m',
      'group-orientation-vertical/slider:order-2',
      'group-orientation-vertical/slider:group-layout-grid/slider:col-start-1 group-orientation-vertical/slider:group-layout-grid/slider:row-start-2',
      'group-orientation-vertical/slider:group-layout-grid/slider:justify-self-end',
      'group-orientation-horizontal/slider:group-layout-grid/slider:col-start-3',
      'group-orientation-horizontal/slider:group-layout-grid/slider:row-start-3',
      'group-orientation-horizontal/slider:group-layout-grid/slider:justify-self-end',
    ],
  },
});
