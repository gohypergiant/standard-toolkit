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
import type { FormEvent, PropsWithChildren, ReactNode } from 'react';
import type { SearchFieldProps } from '../search-field/types';

export type KanbanColumnData = {
  title: string;
  id: string;
  cards: KanbanCardData[];
  canDrop?: boolean;
};

export interface KanbanComponentProps extends PropsWithChildren {
  className?: string;
}

export interface KanbanColProps extends KanbanComponentProps {
  column: KanbanColumnData;
}

export interface KanbanProps extends KanbanComponentProps {
  columns?: ReactNode[];
}

export interface KanbanMenuProps extends KanbanComponentProps {
  cardCount?: number;
}

export interface KanbanSearchProps extends SearchFieldProps {
  onInput?: (e: FormEvent<HTMLInputElement>) => void;
}

export interface KanbanColContentActionProps extends KanbanComponentProps {
  onAddCard?: () => void;
}

export interface KanbanColContentProps {
  children?: ReactNode | ReactNode[];
  className?: string;
  column: KanbanColumnData;
}

export type KanbanCardData = {
  body: ReactNode | string;
  title: string;
  isActive?: boolean;
  id: string;
  columnId: string;
  position: number;
};

export interface KanbanCardProps extends KanbanComponentProps {
  isActive?: boolean;
  card: KanbanCardData;
}
