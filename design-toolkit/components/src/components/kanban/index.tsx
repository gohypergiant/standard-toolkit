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
'use client';
import 'client-only';

import { Add, DragVert } from '@accelint/icons';
import {
  type CollisionDetection,
  closestCenter,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { createContext, useContext, useState } from 'react';
import { Heading } from 'react-aria-components';
import { parseDropTarget, useKanban } from '@/components/kanban/context';
import { useCardInteractions, useColumnInteractions } from '@/hooks/kanban';
import { Button } from '../button';
import { Divider } from '../divider';
import { Icon } from '../icon';
import { SearchField } from '../search-field';
import { CardInnerStyles, ColumnStyles, KanbanStyles } from './styles';
import type {
  KanbanCardProps,
  KanbanColContentActionProps,
  KanbanColContentProps,
  KanbanColProps,
  KanbanComponentProps,
  KanbanMenuProps,
  KanbanProps,
  KanbanSearchProps,
} from './types';

const {
  container,
  header,
  headerTitle,
  headerActions,
  colContainer,
  colHeader,
  colHeaderActions,
  colHeaderTitle,
  colContent,
  cardContainerOuter,
  cardHeader,
  cardTitle,
  cardBody,
  cardActions,
} = KanbanStyles();

// Context for sharing active drag state
const DragContext = createContext<{ activeId: string | null }>({
  activeId: null,
});

const useDragContext = () => useContext(DragContext);

export function Kanban({ children, className, ...rest }: KanbanProps) {
  const { moveCard, columns } = useKanban();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const collisionDetectionStrategy: CollisionDetection = (args) => {
    // First, try pointer within for direct pointer detection
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) {
      return pointerCollisions;
    }

    // Then try rectangle intersection for better coverage
    const rectCollisions = rectIntersection(args);
    if (rectCollisions.length > 0) {
      return rectCollisions;
    }

    // Fall back to closest center
    return closestCenter(args);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);

    if (!moveCard) {
      return;
    }

    const dropTarget = parseDropTarget(event);
    if (!dropTarget) {
      return;
    }

    moveCard(
      event.active.id as string,
      dropTarget.columnId,
      dropTarget.position,
      dropTarget.edge,
    );
  };

  // Find the active card for the drag overlay
  const activeCard = activeId
    ? columns.flatMap((col) => col.cards).find((card) => card.id === activeId)
    : null;

  return (
    <DragContext.Provider value={{ activeId }}>
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetectionStrategy}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className={container({ className })} {...rest}>
          {children}
        </div>
        <DragOverlay>
          {activeCard ? (
            <div className={CardInnerStyles({ isActive: true })}>
              <div className={cardHeader()}>
                <span className={cardTitle()}>{activeCard.title}</span>
              </div>
              <div className={cardBody()}>{activeCard.body}</div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </DragContext.Provider>
  );
}
Kanban.displayName = 'Kanban.Container';

const Header = ({ children, className, ...rest }: KanbanComponentProps) => {
  return (
    <div className={header({ className })} {...rest}>
      {children}
    </div>
  );
};
Header.displayName = 'Kanban.Header';

const HeaderTitle = ({
  children,
  className,
  ...rest
}: KanbanComponentProps) => {
  return (
    <Heading className={headerTitle({ className })} {...rest}>
      {children}
    </Heading>
  );
};

const HeaderActions = ({
  children,
  className,
  ...rest
}: KanbanComponentProps) => (
  <div className={headerActions({ className })} {...rest}>
    {children}
  </div>
);
HeaderActions.displayName = 'Kanban.Header.Actions';

const HeaderSearch = ({ classNames, ...rest }: KanbanSearchProps) => (
  <SearchField
    variant='outlined'
    classNames={classNames}
    aria-label='Search'
    {...rest}
  />
);
HeaderSearch.displayName = 'Kanban.Header.Search';

const HeaderMenu = ({ children }: KanbanMenuProps) => ({ children });
HeaderMenu.displayName = 'Kanban.Header.Menu';

const ColContainer = ({
  children,
  className,
  ...rest
}: KanbanComponentProps) => {
  return (
    <div className={colContainer({ className })} {...rest}>
      {children}
    </div>
  );
};
ColContainer.displayName = 'Kanban.Column.Container';

const Col = ({ children, className, column, ...rest }: KanbanColProps) => {
  const { ref, isActive, isHighlighted } = useColumnInteractions(column);

  return (
    <div
      className={ColumnStyles({ isHighlighted, isActive, className })}
      ref={ref}
      {...rest}
    >
      {children}
    </div>
  );
};
Col.displayName = 'Kanban.Column';

const ColHeader = ({ children, className, ...rest }: KanbanComponentProps) => {
  return (
    <div className={colHeader({ className })} {...rest}>
      {children}
    </div>
  );
};
ColHeader.displayName = 'Kanban.Column.Header';

const ColDragHandle = () => (
  <Icon size='small'>
    <DragVert />
  </Icon>
);
ColDragHandle.displayName = 'Kanban.Column.Header.DragHandle';

const ColHeaderTitle = ({
  children,
  className,
  ...rest
}: KanbanComponentProps) => {
  return (
    <span className={colHeaderTitle({ className })} {...rest}>
      {children}
    </span>
  );
};
ColHeaderTitle.displayName = 'Kanban.Column.Header.Title';

const ColHeaderActions = ({
  className,
  cardCount,
  children,
  ...rest
}: KanbanMenuProps) => {
  return (
    <div className={colHeaderActions({ className })} {...rest}>
      <div className='text-sm'>{cardCount ?? 0}</div>
      {children}
    </div>
  );
};
ColHeaderActions.displayName = 'Kanban.Column.Header.Actions';

const ColContent = ({
  children,
  className,
  column,
  ...rest
}: KanbanColContentProps) => {
  const cardIds = column?.cards?.map((card) => card.id) || [];

  // Make the content area droppable when empty to ensure it can receive drops
  const { setNodeRef: setDroppableRef } = useDroppable({
    id: `${column?.id}-content`,
    data: column,
  });

  return (
    <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
      <div
        ref={setDroppableRef}
        className={colContent({ className })}
        {...rest}
      >
        {children}
      </div>
    </SortableContext>
  );
};
ColContent.displayName = 'Kanban.Column.Content';

const ColActions = ({
  className,
  onAddCard,
  ...rest
}: KanbanColContentActionProps) => {
  return (
    <div className={colHeader({ className })} {...rest}>
      <Button variant='flat' onPress={onAddCard} {...rest}>
        <Icon>
          <Add />
        </Icon>
        Add Card
      </Button>
    </div>
  );
};
ColActions.displayName = 'Kanban.Column.Content.Actions';

// Kanban Card
function KanbanCard({
  className,
  children,
  card,
  isActive,
  ...rest
}: KanbanCardProps) {
  const { isDragging, closestEdge, ref, style, attributes, listeners } =
    useCardInteractions(card);
  const { activeId } = useDragContext();

  // Check if we should show the drop placeholder
  const showPlaceholder = activeId && activeId !== card.id && closestEdge;

  return (
    <div className={cardContainerOuter()} ref={ref} style={style}>
      {showPlaceholder && closestEdge === 'top' && (
        <Divider className='mb-s h-xxs bg-accent-primary-bold' />
      )}

      <div
        className={CardInnerStyles({
          className,
          isActive,
          dragging: isDragging,
        })}
        data-dragging={isDragging}
        {...attributes}
        {...listeners}
        {...rest}
      >
        {children}
      </div>

      {showPlaceholder && closestEdge === 'bottom' && (
        <Divider className='mt-s h-xxs bg-accent-primary-bold' />
      )}
    </div>
  );
}

const CardHeader = ({ className, children, ...rest }: KanbanComponentProps) => {
  return (
    <Header className={cardHeader({ className })} {...rest}>
      {children}
    </Header>
  );
};
CardHeader.displayname = 'Kanban.Card.Header';

const CardTitle = ({ className, children, ...rest }: KanbanComponentProps) => {
  return (
    <span className={cardTitle({ className })} {...rest}>
      {children}
    </span>
  );
};
CardTitle.displayName = 'Kanban.Card.Header.Title';

const CardActions = ({
  children,
  className,
  ...rest
}: KanbanComponentProps) => {
  return (
    <div className={cardActions({ className })} {...rest}>
      {children}
    </div>
  );
};
CardActions.displayName = 'Kanban.Card.Header.Actions';

const CardBody = ({ children, className, ...rest }: KanbanComponentProps) => {
  return (
    <div className={cardBody({ className })} {...rest}>
      {children}
    </div>
  );
};
CardBody.displayname = 'Kanban.Card.Body';

// Kanban Composition
CardHeader.Title = CardTitle;
CardHeader.Actions = CardActions;

KanbanCard.Header = CardHeader;
KanbanCard.Body = CardBody;

Header.Title = HeaderTitle;
Header.Actions = HeaderActions;
Header.Search = HeaderSearch;
Header.Menu = HeaderMenu;

ColHeader.Title = ColHeaderTitle;
ColHeader.Actions = ColHeaderActions;

ColHeader.Title = ColHeaderTitle;
ColHeader.Actions = ColHeaderActions;

ColContent.Actions = ColActions;

Col.Content = ColContent;
Col.Container = ColContainer;
Col.Header = ColHeader;
Col.DragHandle = ColDragHandle;
Col.Actions = ColActions;

Kanban.Card = KanbanCard;

Kanban.Header = Header;
Kanban.Column = Col;
