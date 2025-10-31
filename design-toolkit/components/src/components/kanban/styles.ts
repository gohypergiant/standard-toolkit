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
    colContainer: 'flex h-full w-full flex-row gap-xs overflow-x-auto p-m',
    colHeader:
      'fg-primary-bold flex w-full items-center justify-between gap-m bg-surface-default p-s text-header-m',
    colHeaderActions: 'fg-primary-muted flex flex-row items-center gap-s',
    colHeaderActionsCount: 'w-[24px] text-center text-sm',
    colHeaderTitle:
      'fg-primary-bold flex flex-row items-center gap-s font-medium text-sm',
    colContent:
      'relative my-s flex h-full min-h-[200px] w-full flex-1 flex-grow flex-col flex-nowrap gap-s overflow-y-auto px-[1px]',
    colContentActions:
      'fg-primary-bold box-shadow w-full items-center justify-start gap-2 bg-surface-default py-3 font-medium text-sm hover:cursor-pointer',
    cardContainerOuter: 'flex w-full flex-col',
    cardHeader:
      'flex flex-row items-center justify-between gap-s p-0 text-header-m',
    cardBody: 'fg-primary-muted text-body-m',
    cardTitle: 'fg-primary-bold font-medium',
    cardActions: 'flex flex-row items-center',
    divider: 'mb-s h-xxs bg-accent-primary-bold',
  },
});

export const ColumnStyles = tv({
  base: 'flex h-full min-w-[210px] flex-1 flex-col items-center overflow-y-auto overflow-x-hidden p-xs outline outline-transparent',
  variants: {
    isHighlighted: {
      true: 'rounded-large outline outline-interactive-hover',
    },
    isActive: {
      true: 'rounded-large outline outline-accent-primary-bold',
    },
  },
});

export const CardInnerStyles = tv({
  base: 'flex w-full flex-col text-wrap rounded-large bg-surface-raised p-s pb-m outline outline-transparent transition-all hover:outline-interactive-hover',
  variants: {
    isActive: {
      true: 'bg-accent-primary-bold outline-accent-primary-pressed',
    },
    dragging: {
      true: 'hidden',
    },
  },
});
