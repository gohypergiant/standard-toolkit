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

import { ChevronDown, ChevronUp, DragVert, Hide, Show } from '@accelint/icons';
import { Cache } from '@/hooks/use-tree/actions/cache';
import type { Key, Selection } from '@react-types/shared';
import 'client-only';
import {
  createContext,
  memo,
  type PropsWithChildren,
  useContext,
  useMemo,
} from 'react';
import {
  Tree as AriaTree,
  TreeItem as AriaTreeItem,
  TreeItemContent as AriaTreeItemContent,
  composeRenderProps,
  DropIndicator,
  type DropTarget,
  Text,
  type TextProps,
  useDragAndDrop,
} from 'react-aria-components';
import { Button } from '../button';
import { Checkbox } from '../checkbox';
import { Icon } from '../icon';
import { Lines } from '../lines';
import { TreeStyles, TreeStylesDefaults } from './styles';
import type { IconProps } from '../icon/types';
import type {
  TreeContextValue,
  TreeItemContentProps,
  TreeItemContextValue,
  TreeItemProps,
  TreeProps,
} from './types';

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
  expansion,
  visibility,
} = TreeStyles();

export const TreeContext = createContext<TreeContextValue>({
  visibilityComputedKeys: new Set(),
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
}: {
  level: number;
  isLastOfSet: boolean;
}) {
  const { showRuleLines, variant } = useContext(TreeContext);

  return Array.from({ length: level }).map((_, i) => {
    const type = i === level - 1 ? 'branch' : 'vert';
    const line = isLastOfSet && i > 0 ? 'last' : type;
    const size = variant === 'crammed' ? 'medium' : 'large';

    return (
      <Lines
        // biome-ignore lint/suspicious/noArrayIndexKey: index should be the key, only count matters
        key={i}
        variant={line}
        size={size}
        isVisible={showRuleLines}
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
  onSelectionChange,
  ...rest
}: TreeProps<T>) {
  /**
   * A static collection is hard-coded. Dynamic is data-driven from an external source.
   * https://react-spectrum.adobe.com/react-aria/Tree.html#content
   *
   * Controlled state should only be used on a static tree.
   */
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

  /**
   * A static tree won't support the node iterator pattern.
   */
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
  const {
    disabledKeys,
    expandedKeys,
    selectedKeys,
    visibleKeys,
    visibilityComputedKeys,
  } = useMemo(() => {
    const acc = {
      disabledKeys: nodes ? new Set<Key>() : disabledKeysProp,
      expandedKeys: nodes ? new Set<Key>() : expandedKeysProp,
      selectedKeys: nodes ? new Set<Key>() : selectedKeysProp,
      visibleKeys: nodes ? new Set<Key>() : visibleKeysProp,
      visibilityComputedKeys: new Set<Key>(),
    };

    if (!nodes) {
      return acc;
    }

    return nodes.reduce(
      (
        acc,
        {
          key,
          isDisabled,
          isExpanded,
          isSelected,
          isVisible,
          isVisibleComputed,
        },
      ) => {
        if (isDisabled) {
          acc.disabledKeys?.add(key);
        }
        if (isExpanded) {
          acc.expandedKeys?.add(key);
        }
        if (isSelected) {
          acc.selectedKeys?.add(key);
        }
        if (isVisible) {
          acc.visibleKeys?.add(key);
        }
        if (isVisibleComputed) {
          acc.visibilityComputedKeys.add(key);
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

  const handleSelectionChange = selectedKeys
    ? (selection: Selection) => {
        if (selection !== 'all') {
          onSelectionChange?.(selection);
        }
      }
    : undefined;

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
        visibilityComputedKeys,
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
        onSelectionChange={handleSelectionChange}
        selectionMode={selectionMode}
      >
        {children}
      </AriaTree>
    </TreeContext.Provider>
  );
}
Tree.displayName = 'Tree';

export const TreeItemContext = createContext<TreeItemContextValue>({
  isVisible: true,
  isViewable: true,
  ancestors: [],
});

export function TreeItem({ className, id, ...rest }: TreeItemProps) {
  const { visibilityComputedKeys, visibleKeys, isStatic } =
    useContext(TreeContext);
  const { ancestors } = useContext(TreeItemContext);
  const isViewable =
    visibilityComputedKeys?.has(id) ||
    (isStatic && ancestors.every((key) => visibleKeys?.has(key)));
  const isVisible = visibleKeys?.has(id);

  return (
    <TreeItemContext.Provider
      value={{
        isVisible,
        isViewable,
        ancestors: [...ancestors, id],
      }}
    >
      <AriaTreeItem
        {...rest}
        id={id}
        className={composeRenderProps(className, (className) =>
          item({ className }),
        )}
        data-viewable={isViewable || null}
        data-visible={isVisible || null}
      />
    </TreeItemContext.Provider>
  );
}
TreeItem.displayName = 'Tree.Item';

function ItemContent({ children }: TreeItemContentProps) {
  const { showVisibility, variant, visibleKeys, onVisibilityChange } =
    useContext(TreeContext);
  const { isVisible, isViewable } = useContext(TreeItemContext);
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
        const shouldShowSelection =
          selectionBehavior === 'toggle' && selectionMode !== 'none';

        const handlePress = () => {
          const keys = new Set<Key>(visibleKeys);
          visibleKeys?.has(id) ? keys.delete(id) : keys.add(id);
          onVisibilityChange?.(keys);
        };

        return (
          <Icon.Provider size={size}>
            <div
              className={content({ variant })}
              data-last-of-set={isLastOfSet}
            >
              {showVisibility && (
                <Button
                  variant='icon'
                  color='mono-bold'
                  size={size}
                  onPress={handlePress}
                  isDisabled={isDisabled}
                  className={visibility()}
                >
                  <Icon>{isVisible ? <Show /> : <Hide />}</Icon>
                </Button>
              )}
              {level > 1 && (
                <TreeLines level={level} isLastOfSet={isLastOfSet} />
              )}
              {hasChildItems ? (
                <Button
                  slot='chevron'
                  variant='icon'
                  size={size}
                  className={expansion()}
                >
                  <Icon>{isExpanded ? <ChevronDown /> : <ChevronUp />}</Icon>
                </Button>
              ) : (
                <div className={spacing({ variant })} />
              )}
              <div className={display({ variant })}>
                {typeof children === 'function'
                  ? children({
                      ...renderProps,
                      variant,
                      isVisible,
                      isViewable: isViewable,
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
  return <Text className={label({ className })}>{children}</Text>;
}
ItemLabel.displayName = 'Tree.Item.Label';

function ItemDescription({ children, className }: TextProps) {
  const { variant } = useContext(TreeContext);

  return variant !== 'crammed' ? (
    <Text
      data-slot='description'
      className={description({ className, variant })}
    >
      {children}
    </Text>
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
