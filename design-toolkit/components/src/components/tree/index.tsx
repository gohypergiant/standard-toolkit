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
import type { TreeNode } from '@/hooks/types';
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

const {
  tree,
  item,
  content,
  display,
  icon,
  label,
  actions,
  spacing,
  description,
  drag,
} = TreeStyles();

export const TreeContext =
  createContext<
    ContextValue<TreeProps<unknown> & { isStatic?: boolean }, HTMLDivElement>
  >(null);

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
      <Lines
        key={i}
        variant={line}
        size={size}
        showLines={showRuleLines}
        className={spacing({ variant })}
      />
    );
  });
});

function reducer<T, I>(
  nodes: TreeNode<T>[],
  callback: (acc: I, node: TreeNode<T>) => I,
  initial: I,
): I {
  return nodes.reduce(
    (acc, node) => reducer(node.children ?? [], callback, callback(acc, node)),
    initial,
  );
}

export function Tree<T>(props: TreeProps<T>) {
  const {
    children,
    className,
    variant = TreeStylesDefaults.variant,
    selectionMode = 'multiple',
    visibleKeys,
    onVisibilityChange,
    showRuleLines = true,
    showVisibility = true,
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
    getAllowedDropOperations: () => ['move'],
    getDropOperation: () => 'move',
    onInsert: dragAndDropConfig?.onInsert,
    onItemDrop: dragAndDropConfig?.onItemDrop,
  });

  const viewableKeys = useMemo(
    () =>
      reducer(
        Array.from(items ?? []),
        (acc, node) => {
          return node.isViewable ? acc.add(node.key) : acc;
        },
        new Set<Key>(),
      ),
    [items],
  );

  return (
    <TreeContext.Provider
      value={{
        showRuleLines,
        showVisibility,
        visibleKeys,
        viewableKeys,
        onVisibilityChange,
        variant,
        isStatic: !items,
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
  const { id, children, className, label, isDisabled, ...rest } = props;

  return (
    <AriaTreeItem
      id={id}
      className={composeRenderProps(className, (className) =>
        item({ className, isDisabled }),
      )}
      textValue={label}
      {...rest}
    >
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

  const showVisibility = isSlottedContextValue(context)
    ? true
    : context?.showVisibility;
  const isStatic = isSlottedContextValue(context) ? false : context?.isStatic;

  const visibleKeys = isSlottedContextValue(context)
    ? new Set()
    : context?.visibleKeys;

  const viewableKeys = isSlottedContextValue(context)
    ? new Set()
    : context?.viewableKeys;

  const onVisibilityChange = isSlottedContextValue(context)
    ? undefined
    : context?.onVisibilityChange;

  const size = variant === 'cozy' ? 'medium' : 'small';

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

        const isLastOfSet = !(
          state.collection.getItem(id)?.nextKey || hasChildItems
        );

        const shouldShowSelection =
          selectionBehavior === 'toggle' && selectionMode !== 'none';
        const isNotRoot = level > 1;
        const isVisible = Array.from(visibleKeys ?? []).includes(id);
        const isViewable = isStatic ? true : (viewableKeys?.has(id) ?? false);

        return (
          <Icon.Provider size={size}>
            <div
              className={content({
                variant,
                isViewable,
                isVisible,
                isDisabled,
              })}
              data-variant={variant}
              data-last-of-set={isLastOfSet}
            >
              {showVisibility && (
                <VisibilityToggle
                  id={id}
                  isVisible={isVisible}
                  isViewable={isViewable}
                  isDisabled={isDisabled}
                  size={size}
                  onChange={onVisibilityChange}
                />
              )}
              {isNotRoot && (
                <TreeLines level={level} isLastOfSet={isLastOfSet} />
              )}
              <ExpandToggle
                hasChildItems={hasChildItems}
                isVisible={isVisible}
                isViewable={isViewable}
                isExpanded={isExpanded}
                size={size}
                isDisabled={isDisabled}
              />
              <div className={display({ variant })}>
                {typeof children === 'function'
                  ? children({
                      ...renderProps,
                      variant,
                      isVisible,
                      isViewable,
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
                  size={size}
                  isDisabled={isDisabled}
                  className={drag({ isVisible, isViewable })}
                >
                  <Icon>
                    <DragVert />
                  </Icon>
                </Button>
              )}
            </div>
          </Icon.Provider>
        );
      }}
    </AriaTreeItemContent>
  );
}
ItemContent.displayName = 'Tree.Item.Content';

function ItemLabel({ children, className }: ItemTextProps) {
  return <AriaText className={label({ className })}>{children}</AriaText>;
}
ItemLabel.displayName = 'Tree.Item.Label';

function ItemDescription({ children, className }: ItemTextProps) {
  const context = useContext(TreeContext);

  const variant =
    (isSlottedContextValue(context) ? undefined : context?.variant) ??
    TreeStylesDefaults.variant;

  return variant !== 'crammed' ? (
    <AriaText
      data-slot='description'
      className={description({ className, variant })}
    >
      {children}
    </AriaText>
  ) : null;
}
ItemDescription.displayName = 'Tree.Item.Description';

function ItemIcon({ children, className }: ItemTextProps) {
  return <Icon className={icon({ className })}>{children}</Icon>;
}
ItemIcon.displayName = 'Tree.Item.PrefixIcon';

function ItemActions({
  children,
  className,
}: PropsWithChildren & { className?: string }) {
  return <div className={actions({ className })}>{children}</div>;
}
ItemActions.displayName = 'Tree.Icon.Actions';

Tree.Item = TreeItem;
TreeItem.Content = ItemContent;
TreeItem.Label = ItemLabel;
TreeItem.Description = ItemDescription;
TreeItem.PrefixIcon = ItemIcon;
TreeItem.Actions = ItemActions;
