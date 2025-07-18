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

import { TreeStyles, TreeStylesDefaults } from '@/components/tree/styles';
import { isSlottedContextValue } from '@/lib/utils';
import { DragVert } from '@accelint/icons';
import type { Key } from '@react-types/shared';
import {
  type PropsWithChildren,
  createContext,
  memo,
  useContext,
  useMemo,
} from 'react';
import {
  Text as AriaText,
  Tree as AriaTree,
  TreeItem as AriaTreeItem,
  TreeItemContent as AriaTreeItemContent,
  type ContextValue,
  DropIndicator,
  type DropTarget,
  composeRenderProps,
  useDragAndDrop,
} from 'react-aria-components';
import type { TreeNode } from '../../hooks/types';
import { Button } from '../button';
import { Icon } from '../icon';
import { Lines } from '../lines';
import { ExpandToggle } from './expand-toggle';
import { SelectionToggle } from './selection-toggle';
import type {
  ItemContentProps,
  ItemContentRenderProps,
  ItemTextProps,
  TreeItemProps,
  TreeProps,
} from './types';
import { VisibilityToggle } from './visibility-toggle';

const { actions, tree, icon, item, label, description, display } = TreeStyles();

export const TreeContext =
  createContext<ContextValue<TreeProps<unknown>, HTMLDivElement>>(null);

const defaultRenderDropIndicator = (target: DropTarget) => (
  <DropIndicator target={target} className='border border-highlight-hover' />
);

const TreeLines = memo(function TreeLines({
  level,
  isLastOfSet,
}: { level: number; isLastOfSet: boolean }) {
  const context = useContext(TreeContext);
  const showRuleLines =
    (isSlottedContextValue(context) ? undefined : context?.showRuleLines) ??
    TreeStylesDefaults.hasRuleLines;

  const variant =
    (isSlottedContextValue(context) ? undefined : context?.variant) ??
    TreeStylesDefaults.variant;

  return Array.from({ length: level }).map((_, i) => {
    const type = i === level - 1 ? 'branch' : 'vert';
    const line = isLastOfSet && i > 0 ? 'last' : type;
    const size = variant === 'cozy' ? 'large' : 'medium';

    return (
      <Lines key={i} variant={line} size={size} showLines={showRuleLines} />
    );
  });
});

/**
 * TODO: deep equality on tree with nodes passed in to reset
 * TODO: moving multiple with selection
 * TODO: visibility with children/parent/sibling things
 * TODO: accessors?
 * TODO: generics cleanup
 * TODO: manage re-rendering and performance
 * TODO: visual polish
 * TODO: classNames refactor
 */

export function Tree<T extends object>(props: TreeProps<T>) {
  const {
    children,
    className,
    variant = TreeStylesDefaults.variant,
    selectionMode = 'multiple',
    visibleKeys,
    onVisibilityChange,
    showRuleLines = true,
    dragAndDropConfig,
    items,
    ...rest
  } = props;

  const { dragAndDropHooks } = useDragAndDrop({
    getItems: dragAndDropConfig?.getItems,
    onReorder: dragAndDropConfig?.onReorder,
    onRootDrop: dragAndDropConfig?.onRootDrop,
    renderDragPreview: dragAndDropConfig?.renderDragPreview,
    renderDropIndicator:
      dragAndDropConfig?.renderDropIndicator ?? defaultRenderDropIndicator,
    acceptedDragTypes: dragAndDropConfig?.acceptedDragTypes,
    onInsert: dragAndDropConfig?.onInsert,
    onItemDrop: dragAndDropConfig?.onItemDrop,
    onMove: () => dragAndDropConfig?.onMove,
  });

  // Flatten viewable keys data from items
  const viewableKeys = useMemo((): Set<Key> => {
    if (!items) {
      return new Set();
    }
    const viewable = new Set<Key>();

    function traverse(nodes: Iterable<TreeNode<T>>) {
      for (const node of nodes) {
        if (node.isViewable) {
          viewable.add(node.key);
        }
        if (node.children) {
          traverse(node.children);
        }
      }
    }

    traverse(items);
    return viewable;
  }, [items]);

  return (
    <TreeContext.Provider
      value={{
        showRuleLines,
        visibleKeys,
        viewableKeys,
        onVisibilityChange,
        variant,
      }}
    >
      <AriaTree
        selectionMode={selectionMode}
        dragAndDropHooks={dragAndDropHooks}
        className={composeRenderProps(className, (className) =>
          tree({ className, variant }),
        )}
        items={items}
        {...rest}
      >
        {children}
      </AriaTree>
    </TreeContext.Provider>
  );
}
Tree.displayName = 'Tree';

export function TreeItem(props: TreeItemProps) {
  const { id, children, label, ...rest } = props;

  return (
    <AriaTreeItem id={id} className={item()} textValue={label} {...rest}>
      {children}
    </AriaTreeItem>
  );
}
TreeItem.displayName = 'Tree.Item';

export function ItemContent({ children }: ItemContentProps) {
  const context = useContext(TreeContext);
  const variant =
    (isSlottedContextValue(context) ? undefined : context?.variant) ??
    TreeStylesDefaults.variant;

  const visibleKeys = isSlottedContextValue(context)
    ? new Set()
    : context?.visibleKeys;

  const viewableKeys = isSlottedContextValue(context)
    ? new Set()
    : context?.viewableKeys;

  const onVisibilityChange = isSlottedContextValue(context)
    ? undefined
    : context?.onVisibilityChange;

  return (
    <AriaTreeItemContent>
      {(renderProps: ItemContentRenderProps) => {
        const {
          id,
          hasChildItems,
          isExpanded,
          isDisabled,
          selectionBehavior,
          selectionMode,
          allowsDragging,
          isSelected,
          level,
          state,
        } = renderProps;

        const isLastOfSet = !state.collection.getItem(id)?.nextKey;

        const shouldShowSelection =
          selectionBehavior === 'toggle' && selectionMode !== 'none';
        const isNotRoot = level > 1;
        const isVisible = Array.from(visibleKeys ?? []).includes(id);
        const isViewable = Array.from(viewableKeys ?? []).includes(id);

        return (
          <div
            className={item({ variant })}
            data-variant={variant}
            data-last-of-set={isLastOfSet}
          >
            <VisibilityToggle
              id={id}
              isVisible={isVisible}
              isViewable={isViewable}
              onChange={onVisibilityChange}
            />
            {isNotRoot && <TreeLines level={level} isLastOfSet={isLastOfSet} />}
            <ExpandToggle
              hasChildItems={hasChildItems}
              isExpanded={isExpanded}
              size='medium'
              isDisabled={isDisabled}
            />
            <div className={display({ variant })}>
              {typeof children === 'function'
                ? children({
                    ...renderProps,
                    variant,
                    defaultChildren: null,
                  })
                : children}
            </div>
            {shouldShowSelection && (
              <SelectionToggle
                isSelected={isSelected}
                isDisabled={isDisabled}
                slot='selection'
              />
            )}
            {allowsDragging && (
              <Button
                slot='drag'
                variant='icon'
                size={variant === 'cozy' ? 'medium' : 'small'}
              >
                <Icon>
                  <DragVert />
                </Icon>
              </Button>
            )}
          </div>
        );
      }}
    </AriaTreeItemContent>
  );
}
ItemContent.displayName = 'Tree.Item.Content';

function ItemLabel({ children }: ItemTextProps) {
  return <AriaText className={label()}>{children}</AriaText>;
}
ItemLabel.displayName = 'Tree.Item.Label';

function ItemDescription({ children }: ItemTextProps) {
  return <AriaText className={description()}>{children}</AriaText>;
}
ItemDescription.displayName = 'Tree.Item.Description';

function ItemIcon({ children }: ItemTextProps) {
  return (
    <Icon size='medium' className={icon()}>
      {children}
    </Icon>
  );
}
ItemIcon.displayName = 'Tree.Item.Icon';

function ItemActions({ children }: PropsWithChildren) {
  return (
    <div className={actions()}>
      <div className='flex items-center gap-x-xs'>{children}</div>
    </div>
  );
}
ItemActions.displayName = 'Tree.Icon.Actions';

Tree.Item = TreeItem;
TreeItem.Content = ItemContent;
TreeItem.Label = ItemLabel;
TreeItem.Description = ItemDescription;
TreeItem.Icon = ItemIcon;
TreeItem.Actions = ItemActions;
