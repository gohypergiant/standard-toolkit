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
import { ChevronDown, ChevronUp, DragVert, Hide, Show } from '@accelint/icons';
import { type PropsWithChildren } from 'react';
import {
  TreeItem as AriaTreeItem,
  TreeItemContent as AriaTreeItemContent,
  composeRenderProps,
  Text,
  type TextProps,
} from 'react-aria-components';
import { Button } from '../button';
import { Checkbox } from '../checkbox';
import { Icon } from '../icon';
import { TreeContext, TreeItemContext } from './context';
import { TreeStyles } from './styles';
import { TreeLines } from './tree';
import type { IconProps } from '../icon/types';
import type { TreeItemContentProps, TreeItemProps } from './types';

const {
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

/**
 * TreeItem - Individual node in a tree
 *
 * Represents a single item in the tree structure
 */
export function TreeItem({ className, id, ...rest }: TreeItemProps) {
  const { visibilityComputedKeys, visibleKeys, isStatic } =
    TreeContext.useContext();
  const { ancestors } = TreeItemContext.useContext();
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

/**
 * ItemContent - Content of a tree item
 *
 * Renders the content of a tree item with proper styling
 */
export function ItemContent({ children }: TreeItemContentProps) {
  const { showVisibility, variant, visibleKeys, onVisibilityChange } =
    TreeContext.useContext();
  const { isVisible, isViewable } = TreeItemContext.useContext();
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

/**
 * ItemLabel - Label for a tree item
 *
 * Renders the primary text label for a tree item
 */
export function ItemLabel({ children, className }: TextProps) {
  return <Text className={label({ className })}>{children}</Text>;
}

/**
 * ItemDescription - Description for a tree item
 *
 * Renders secondary descriptive text for a tree item
 */
export function ItemDescription({ children, className }: TextProps) {
  const { variant } = TreeContext.useContext();

  return variant !== 'crammed' ? (
    <Text
      data-slot='description'
      className={description({ className, variant })}
    >
      {children}
    </Text>
  ) : null;
}

/**
 * ItemIcon - Icon for a tree item
 *
 * Renders an icon for a tree item
 */
export function ItemIcon({ children, className }: IconProps) {
  return <Icon className={icon({ className })}>{children}</Icon>;
}

/**
 * ItemActions - Action buttons for a tree item
 *
 * Container for action buttons in a tree item
 */
export function ItemActions({
  children,
  className,
}: PropsWithChildren & { className?: string }) {
  return <div className={actions({ className })}>{children}</div>;
}
