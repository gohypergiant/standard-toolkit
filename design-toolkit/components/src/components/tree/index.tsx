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

import { Cache } from '@/hooks/use-tree/actions/cache';
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
import type { IconProps } from '../icon/types';
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
  const { showRuleLines, variant } = useContext(TreeContext);

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
  disabledKeys: disabledKeysProp,
  dragAndDropConfig,
  expandedKeys: expandedKeysProp,
  items,
  selectedKeys: selectedKeysProp,
  showRuleLines = true,
  showVisibility = true,
  selectionMode = 'multiple',
  variant = TreeStylesDefaults.variant,
  visibleKeys: visibleKeysProp,
  onVisibilityChange,
  ...rest
}: TreeProps<T>) {
  if (
    items &&
    (disabledKeysProp ||
      expandedKeysProp ||
      selectedKeysProp ||
      visibleKeysProp)
  ) {
    throw new Error(
      'Tree should only be controlled with state from either `items` or keys props, not both',
    );
  }

  if (!!items !== (typeof children === 'function')) {
    throw new Error(
      'Tree `items` and node iterator `children` must be used together',
    );
  }

  const { dragAndDropHooks } = useDragAndDrop({
    renderDropIndicator: defaultRenderDropIndicator,
    getAllowedDropOperations: () => ['move'],
    getDropOperation: () => 'move',
    ...dragAndDropConfig,
  });
  const cache = useMemo(() => (items ? new Cache([...items]) : null), [items]);
  const nodes = useMemo(() => cache?.getAllNodes(), [cache]);
  const { disabledKeys, expandedKeys, selectedKeys, visibleKeys } =
    useMemo(() => {
      const acc = {
        disabledKeys: disabledKeysProp ?? new Set<Key>(),
        expandedKeys: expandedKeysProp ?? new Set<Key>(), // TODO: shouldn't be passed into context if static and no prop provided (want the tree to default to open / expanded=true)
        selectedKeys: selectedKeysProp ?? new Set<Key>(),
        visibleKeys: visibleKeysProp ?? new Set<Key>(), //
      };

      if (!nodes) {
        return acc;
      }

      return nodes.reduce(
        (acc, { key, isDisabled, isExpanded, isSelected, isVisible }) => {
          if (isDisabled) {
            acc.disabledKeys.add(key);
          }
          if (isExpanded) {
            acc.expandedKeys.add(key);
          }
          if (isSelected) {
            acc.selectedKeys.add(key);
          }
          if (isVisible) {
            acc.visibleKeys.add(key);
          }

          return acc;
        },
        acc,
      );
    }, [
      nodes,
      disabledKeysProp,
      expandedKeysProp,
      selectedKeysProp,
      visibleKeysProp,
    ]);

  return (
    <TreeContext.Provider
      value={{
        disabledKeys,
        expandedKeys,
        selectedKeys,
        showRuleLines,
        showVisibility,
        variant,
        visibleKeys,
        isStatic: typeof children !== 'function',
        onVisibilityChange: onVisibilityChange ?? (() => undefined), // TODO: improve
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
  // TODO: Figure out the state of the component here
  // Pull in the TreeContext and do calculations against keys
  // It already does most of them: https://github.com/adobe/react-spectrum/blob/main/packages/react-aria-components/src/Tree.tsx#L660
  // Only need to do the ones that are missing

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
  const {
    showVisibility,
    variant,
    viewableKeys,
    visibleKeys,
    onVisibilityChange,
  } = useContext(TreeContext);
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

        // const me = state.collection.getItem(id);
        // const parent = state.selectionManager.getItem(me?.parentKey) // Will need to be recursive to get all ancestors
        // const isVisible = [me, ...parents].every((key) => viewableKeys.has(key));
        // This calculation is only neceesary when rendered as a static Tree

        const isLastOfSet = !(
          state.collection.getItem(id)?.nextKey || hasChildItems
        );
        const shouldShowSelection =
          selectionBehavior === 'toggle' && selectionMode !== 'none';
        const isViewable = viewableKeys.has(id);
        const isVisible = visibleKeys.has(id);

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

function ItemIcon({ children, className }: IconProps) {
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
