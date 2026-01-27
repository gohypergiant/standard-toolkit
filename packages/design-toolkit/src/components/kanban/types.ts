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

/**
 * Data structure for a Kanban column.
 */
export type KanbanColumnData = {
  /** Display title of the column. */
  title: string;
  /** Unique identifier for the column. */
  id: string;
  /** Cards contained in this column. */
  cards: KanbanCardData[];
  /** Whether cards can be dropped into this column. */
  canDrop?: boolean;
};

/**
 * Base props for Kanban components.
 */
export interface KanbanComponentProps extends PropsWithChildren {
  /** Optional CSS class name. */
  className?: string;
}

/**
 * Props for KanbanColumn component.
 */
export interface KanbanColProps extends KanbanComponentProps {
  /** Column data including cards. */
  column: KanbanColumnData;
}

/**
 * Props for the root Kanban component.
 */
export interface KanbanProps extends KanbanComponentProps {
  /** Column elements to render. */
  columns?: ReactNode[];
}

/**
 * Props for Kanban menu components.
 */
export interface KanbanMenuProps extends KanbanComponentProps {
  /** Number of cards to display in badge. */
  cardCount?: number;
}

/**
 * Props for KanbanHeaderSearch component.
 */
export interface KanbanSearchProps extends SearchFieldProps {
  /** Handler for input events. */
  onInput?: (e: FormEvent<HTMLInputElement>) => void;
}

/**
 * Props for KanbanColumnActions component.
 */
export interface KanbanColContentActionProps extends KanbanComponentProps {
  /** Callback when add card button is pressed. */
  onAddCard?: () => void;
}

/**
 * Props for KanbanColumnContent component.
 */
export interface KanbanColContentProps {
  /** Card elements to render. */
  children?: ReactNode | ReactNode[];
  /** Optional CSS class name. */
  className?: string;
  /** Column data for sortable context. */
  column: KanbanColumnData;
}

/**
 * Data structure for a Kanban card.
 */
export type KanbanCardData = {
  /** Card body content. */
  body: ReactNode | string;
  /** Card title. */
  title: string;
  /** Whether this card is currently active/selected. */
  isActive?: boolean;
  /** Unique identifier for the card. */
  id: string;
  /** ID of the column containing this card. */
  columnId: string;
  /** Position index within the column. */
  position: number;
};

/**
 * Props for KanbanCard component.
 */
export interface KanbanCardProps extends KanbanComponentProps {
  /** Whether this card is currently active/selected. */
  isActive?: boolean;
  /** Card data. */
  card: KanbanCardData;
}
