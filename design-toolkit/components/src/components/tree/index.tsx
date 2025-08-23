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

import { treeCache } from '@/hooks/use-tree/actions/cache';
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
  DropIndicator,
  type DropTarget,
  type TextProps,
  composeRenderProps,
  useDragAndDrop,
} from 'react-aria-components';
import { Button } from '../button';
import { Checkbox } from '../checkbox';
import { Icon } from '../icon';
import { Lines } from '../lines';
import { ExpandToggle } from './expand-toggle';
import { TreeStyles, TreeStylesDefaults } from './styles';
import type {
  TreeContextValue,
  TreeItemContentProps,
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

export const TreeContext = createContext<TreeContextValue>({
  disabledKeys: new Set(),
  expandedKeys: new Set(),
  selectedKeys: new Set(),
  viewableKeys: new Set(),
  visibleKeys: new Set(),
  showRuleLines: true,
  showVisibility: false,
  variant: TreeStylesDefaults.variant,
  isStatic: true,
  onVisibilityChange: () => undefined,
});

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
    const size = variant === 'crammed' ? 'medium' : 'large';

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

export function Tree<T>({
  children,
  className,
  dragAndDropConfig,
  items,
  showRuleLines = true,
  showVisibility = true,
  selectionMode = 'multiple',
  variant = TreeStylesDefaults.variant,
  onVisibilityChange,
  ...rest
}: TreeProps<T>) {
  const { dragAndDropHooks } = useDragAndDrop({
    renderDropIndicator: defaultRenderDropIndicator,
    getAllowedDropOperations: () => ['move'],
    getDropOperation: () => 'move',
    ...dragAndDropConfig,
  });
  const nodes = useMemo(
    () => treeCache([...(items ?? [])]).getAllNodes(),
    [items],
  );
  const {
    disabledKeys,
    expandedKeys,
    selectedKeys,
    viewableKeys,
    visibleKeys,
  } = useMemo(
    () =>
      nodes.reduce(
        (
          acc,
          { key, isDisabled, isExpanded, isSelected, isViewable, isVisible },
        ) => {
          if (isDisabled) {
            acc.disabledKeys.add(key);
          }
          if (isExpanded) {
            acc.expandedKeys.add(key);
          }
          if (isSelected) {
            acc.selectedKeys.add(key);
          }
          if (isViewable) {
            acc.viewableKeys.add(key);
          }
          if (isVisible) {
            acc.visibleKeys.add(key);
          }

          return acc;
        },
        {
          disabledKeys: new Set<Key>(),
          expandedKeys: new Set<Key>(),
          selectedKeys: new Set<Key>(),
          viewableKeys: new Set<Key>(),
          visibleKeys: new Set<Key>(),
        },
      ),
    [nodes],
  );

  return (
    <TreeContext.Provider
      value={{
        disabledKeys,
        expandedKeys,
        showRuleLines,
        showVisibility,
        variant,
        viewableKeys,
        visibleKeys,
        isStatic: !items,
        onVisibilityChange,
      }}
    >
      <AriaTree
        {...rest}
        className={composeRenderProps(className, (className) =>
          tree({ className, variant }),
        )}
        disabledKeys={disabledKeys}
        dragAndDropHooks={dragAndDropHooks}
        expandedKeys={expandedKeys}
        items={items}
        selectedKeys={selectedKeys}
        selectionMode={selectionMode}
      >
        {children}
      </AriaTree>
    </TreeContext.Provider>
  );
}
Tree.displayName = 'Tree';

export function TreeItem({ className, ...rest }: TreeItemProps) {
  return (
    <AriaTreeItem
      {...rest}
      className={composeRenderProps(className, (className) =>
        item({ className }),
      )}
    />
  );
}
TreeItem.displayName = 'Tree.Item';

function ItemContent({ children }: TreeItemContentProps) {
  const context = useContext(TreeContext);
  const variant =
    (isSlottedContextValue(context) ? undefined : context?.variant) ??
    TreeStylesDefaults.variant;

  const showVisibility = isSlottedContextValue(context)
    ? true
    : context?.showVisibility;

  const onVisibilityChange = isSlottedContextValue(context)
    ? undefined
    : context?.onVisibilityChange;

  const size = variant === 'cozy' ? 'medium' : 'small';

  return (
    <AriaTreeItemContent>
      {(renderProps) => {
        const {
          id,
          allowsDragging,
          hasChildItems,
          level,
          selectionBehavior,
          selectionMode,
          state,
          isDisabled,
          isExpanded,
          isSelected,
        } = renderProps;

        const isLastOfSet = !(
          state.collection.getItem(id)?.nextKey || hasChildItems
        );
        console.log(state.collection.getItem(id));
        const shouldShowSelection =
          selectionBehavior === 'toggle' && selectionMode !== 'none';

        const isViewable = true;
        const isVisible = true;

        return (
          <Icon.Provider size={size}>
            <div
              className={content({ variant })}
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
              {level > 1 && (
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
                <Checkbox
                  slot='selection'
                  isSelected={isSelected}
                  isDisabled={isDisabled}
                />
              )}
              {allowsDragging && (
                <Button
                  slot='drag'
                  variant='icon'
                  size={size}
                  isDisabled={isDisabled}
                  className={drag({})}
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

function ItemLabel({ children, className }: TextProps) {
  return <AriaText className={label({ className })}>{children}</AriaText>;
}
ItemLabel.displayName = 'Tree.Item.Label';

function ItemDescription({ children, className }: TextProps) {
  const context = useContext(TreeContext);

  const variant =
    (isSlottedContextValue(context) ? undefined : context?.variant) ??
    TreeStylesDefaults.variant;

  return variant !== 'crammed' ? (
    <AriaText
      // data-slot='description'
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
