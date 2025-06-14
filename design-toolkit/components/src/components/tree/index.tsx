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

import { ChevronDown, ChevronUp, DragVert } from '@accelint/icons';
import { type VariantProps, cva } from 'cva';
import {
  type ReactNode,
  createContext,
  memo,
  useContext,
  useMemo,
} from 'react';
import {
  Collection,
  Tree as RACTree,
  TreeItem as RACTreeItem,
  TreeItemContent as RACTreeItemContent,
  type TreeItemProps as RACTreeItemProps,
  type TreeProps as RACTreeProps,
  type TreeItemContentRenderProps,
} from 'react-aria-components';
import { Icon } from '../icon';
import { IconButton } from '../icon-button';
import './tree.css';
import { cn } from '@/lib/utils';
import type { Key } from '@react-types/shared';
import { SelectionToggle } from './selection-toggle';

const DEFAULT_VARIANT = 'cozy';

export type TreeSelectionType = 'visibility' | 'checkbox' | 'none';

export type TreeItem<T extends object> = {
  id: Key;
  parentId: Key | null;
  label: string;
  isExpanded?: boolean;
  isSelected?: boolean;
  children?: TreeItem<T>[];
  value: T;
};

export type TreeItemMeta<T extends object = object> = Record<
  Key,
  {
    item: TreeItem<T>;
    setCount: number;
    postInSet: number;
  }
>;

interface TreeProps<T extends object>
  extends RACTreeProps<TreeItem<T>>,
    VariantProps<typeof treeStyles> {
  allowsDragging?: boolean;
  selectionType?: TreeSelectionType;
  showRuleLines?: boolean;
}

interface TreeItemProps
  extends Omit<RACTreeItemProps, 'textValue' | 'children'> {
  id: Key;
  label: string;
  iconPrefix?: ReactNode;
  description?: string;
  actions?: ReactNode;
  children?: ReactNode;
}

interface TreeContextValues extends VariantProps<typeof treeStyles> {
  selectionType: TreeSelectionType;
  lookup: TreeItemMeta;
}

export const TreeContext = createContext<TreeContextValues>({
  selectionType: 'visibility',
  variant: DEFAULT_VARIANT,
  lookup: {},
});

/**
 * TODO: readOnly
 * TODO: isVisible vs. isViewable thing
 * TODO: size variants
 * TODO: make ruleLines optional
 */
export function Tree<T extends object>({
  children,
  items,
  variant,
  selectionType = 'visibility',
  ...props
}: TreeProps<T>) {
  /**
   * Building meta values for items
   */
  const lookup = useMemo(() => {
    const map: TreeItemMeta<T> = {};

    if (!(items && Array.isArray(items))) {
      return;
    }

    function walkTree(items: TreeItem<T>[]) {
      for (const [idx, item] of items.entries()) {
        map[item.id] = {
          item,
          setCount: items.length,
          postInSet: idx,
        };
        if (item.children) {
          walkTree(item.children);
        }
      }
    }
    walkTree(items);
    return map;
  }, [items]);

  return (
    <TreeContext.Provider value={{ selectionType, variant, lookup }}>
      <RACTree
        items={items}
        style={{ height: '300px' }}
        selectionMode='multiple'
        {...props}
      >
        {children}
      </RACTree>
    </TreeContext.Provider>
  );
}

const spacer = (
  <span className='group-data-[variant=compact]:w-[15px] group-data-[variant=cozy]:w-[20px] group-data-[variant=tight]:w-[10px]' />
);

const Lines = memo(function Lines({ level }: { level: number }) {
  return Array.from({ length: level }).map((_, i) => (
    <div
      key={i}
      className={cn(
        'relative',
        'self-stretch group-data-[variant=compact]:w-[15px] group-data-[variant=cozy]:w-[20px] group-data-[variant=tight]:w-[10px]',
        i !== level - 1 ? 'vert-line' : 'tree-line',
      )}
    />
  ));
});

const treeStyles = cva('flex items-center hover:bg-interactive-hover-dark', {
  variants: {
    variant: {
      cozy: 'icon-size-xl gap-s text-header-m',
      compact: 'icon-size-l gap-s text-header-s',
      tight: 'icon-size-l gap-xxs text-header-s',
    },
    isSelected: {
      false: 'fg-default-dark',
    },
    isReadOnly: {
      true: 'fg-default-dark',
    },
    isDragTarget: {
      true: 'bg-interactive-hover-dark',
    },
  },
  defaultVariants: {
    variant: DEFAULT_VARIANT,
  },
});

export const TreeItem = (props: TreeItemProps) => {
  const { selectionType, variant, lookup } = useContext(TreeContext);

  const { id, label, description, children, iconPrefix, actions } = props;

  return (
    <RACTreeItem {...props}>
      <RACTreeItemContent>
        {({
          hasChildItems,
          selectionBehavior,
          selectionMode,
          allowsDragging,
          isExpanded,
          isSelected,
          isDisabled,
          level,
        }: TreeItemContentRenderProps) => {
          const shouldShowSelection =
            selectionBehavior === 'toggle' && selectionMode !== 'none';
          const isNotRoot = level > 1;
          const meta = lookup[id];

          const isLastOfSet = meta?.postInSet === meta?.setCount - 1;

          const folder = hasChildItems ? (
            <IconButton slot='chevron'>
              <Icon>{isExpanded ? <ChevronUp /> : <ChevronDown />}</Icon>
            </IconButton>
          ) : (
            spacer
          );

          return (
            <div
              className={cn(
                'fg-default-light overflow-x group flex w-full items-center outline-hidden hover:bg-interactive-hover-dark',
                treeStyles({ variant }),
              )}
              data-variant={variant}
              data-last-of-set={isLastOfSet}
            >
              {shouldShowSelection && (
                <SelectionToggle
                  isSelected={isSelected}
                  isDisabled={isDisabled}
                  selectionType={selectionType}
                  slot='selection'
                />
              )}
              {isNotRoot && <Lines level={level} />}
              {folder}
              {iconPrefix && <Icon>{iconPrefix}</Icon>}
              <div
                className={cn(
                  'flex-1 items-center text-start',
                  'group-data-[variant=compact]:py-xs group-data-[variant=cozy]:py-s group-data-[variant=tight]:py-xxs',
                )}
              >
                {label}
                {description && (
                  <div className='fg-default-dark text-body-s'>
                    {description}
                  </div>
                )}
              </div>
              <div className='justify-self-end'>
                {actions}
                {allowsDragging && (
                  <IconButton slot='drag'>
                    <Icon>
                      <DragVert />
                    </Icon>
                  </IconButton>
                )}
              </div>
            </div>
          );
        }}
      </RACTreeItemContent>
      {children}
    </RACTreeItem>
  );
};

Tree.Item = TreeItem;
Tree.Collection = Collection;
