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

export const KanbanStyles = tv({
  slots: {
    container: 'h-full w-full',
    header: 'flex flex-row justify-between p-m',
    headerTitle: 'flex flex-row justify-between py-3',
    headerActions: 'flex flex-row items-center',
    colContainer:
      'col-container flex h-full w-full flex-row gap-s overflow-x-scroll p-m',
    colHeader:
      'fg-default-light flex w-full items-center justify-between gap-m bg-surface-default p-s text-header-m shadow-elevation-raised',
    colHeaderActions: 'flex flex-row items-center gap-s',
    colHeaderTitle: 'flex flex-row items-center gap-s font-medium text-sm',
    colContent:
      'col relative my-s flex h-full w-full flex-grow flex-col flex-nowrap gap-s overflow-y-scroll px-s',
    colContentActions:
      'fg-default-light box-shadow w-full items-center justify-start gap-2 bg-surface-default py-3 font-medium text-sm hover:cursor-pointer',
    colIsActive: 'z-10 rounded-large outline outline-highlight',
    colIsHighlighted: 'rounded-large outline outline-default-light',
    cardContainerOuter: 'flex w-full flex-col',
    cardHeader: 'flex flex-row justify-between gap-s p-0',
    cardBody: 'fg-default-dark',
    cardTitle: 'font-medium text-default-light',
    cardActions: 'flex flex-row items-center',
  },
});

export const ColumnStyles = tv({
  base: 'col mx-s my-s flex h-full w-[210px] flex-col items-center overflow-auto outline outline-transparent',
  variants: {
    isHighlighted: {
      true: 'rounded-large outline outline-default-light',
    },
    isActive: {
      true: 'rounded-large outline-b outline-highlight',
    },
  },
});

export const CardInnerStyles = tv({
  base: 'flex w-full flex-col text-wrap rounded bg-surface-raised p-s outline outline-transparent transition-all hover:outline-default-light',
  variants: {
    isActive: {
      true: 'w-[210px] bg-highlight-subtle outline outline-highlight',
    },
    dragging: {
      true: 'hidden',
    },
  },
});

export const CardPositionIndicatorStyles = tv({
  base: 'mx-s flex h-xxs flex-col items-center justify-center bg-highlight',
  variants: {
    position: {
      top: 'mb-m',
      bottom: 'mt-m',
    },
  },
});
