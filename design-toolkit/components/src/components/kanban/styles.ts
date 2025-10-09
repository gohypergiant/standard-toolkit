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
    header: 'flex flex-row items-center justify-between p-m',
    headerTitle: 'fg-primary-bold text-header-l',
    headerActions: 'flex flex-row items-center',
    colContainer:
      'col-container flex h-full w-full flex-row gap-s overflow-x-auto p-m',
    colHeader:
      'fg-primary-bold flex w-full items-center justify-between gap-m bg-surface-default bg-surface-default p-s text-header-m shadow-elevation-raised',
    colHeaderActions: 'flex flex-row items-center gap-s',
    colHeaderTitle:
      'fg-primary-bold flex flex-row items-center gap-s font-medium text-sm',
    colContent:
      'col relative my-s flex h-full w-full flex-1 flex-grow flex-col flex-nowrap gap-s overflow-y-auto px-[1px]',
    colContentActions:
      'fg-primary-bold box-shadow w-full items-center justify-start gap-2 bg-surface-default py-3 font-medium text-sm hover:cursor-pointer',
    cardContainerOuter: 'flex w-full flex-col',
    cardHeader:
      'flex flex-row items-center justify-between gap-s p-0 text-header-m',
    cardBody: 'fg-primary-muted text-body-m',
    cardTitle: 'fg-primary-bold font-medium',
    cardActions: 'flex flex-row items-center',
  },
});

export const ColumnStyles = tv({
  base: 'col mx-s my-s flex min-w-[210px] flex-1 flex-col items-center overflow-y-auto overflow-x-hidden outline outline-transparent',
  variants: {
    isHighlighted: {
      true: 'rounded-large outline outline-interactive-hover',
    },
    isActive: {
      true: 'rounded-large outline outline-accent-primary-hover',
    },
  },
});

export const CardInnerStyles = tv({
  base: 'flex w-full flex-col text-wrap rounded-large bg-surface-raised p-s pb-m outline outline-transparent transition-all hover:outline-interactive-hover',
  variants: {
    isActive: {
      true: 'w-[210px] bg-accent-primary-bold outline outline-highlight',
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
