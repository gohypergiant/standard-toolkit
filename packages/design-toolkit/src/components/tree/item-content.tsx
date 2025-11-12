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

import { ChevronDown, ChevronUp, DragVert, Hide, Show } from '@accelint/icons';
import { useContext } from 'react';
import { TreeItemContent as AriaTreeItemContent } from 'react-aria-components';
import { Button } from '../button';
import { Checkbox } from '../checkbox';
import { Icon } from '../icon';
import { IconProvider } from '../icon/context';
import { TreeContext, TreeItemContext } from './context';
import { TreeLines } from './lines';
import { TreeStyles } from './styles';
import type { Key } from '@react-types/shared';
import type { TreeItemContentProps } from './types';

const { content, display, spacing, drag, expansion, visibility } = TreeStyles();

/**
 * ItemContent - Content of a tree item
 *
 * Renders the content of a tree item with proper styling
 */
export function TreeItemContent({ children }: TreeItemContentProps) {
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
          <IconProvider size={size}>
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
          </IconProvider>
        );
      }}
    </AriaTreeItemContent>
  );
}
