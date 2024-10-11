import type { AsType } from '@/types';
import { type AriaLabelingProps } from '@react-types/shared';
import { type ReactNode } from 'react';
import {
  type DragAndDropOptions,
  type DropPosition,
  type GridListItemProps,
  type GridListItemRenderProps,
  type GridListProps,
  type GridListRenderProps,
  type Key,
  type SlotProps,
} from 'react-aria-components';
import { type PartialDeep } from 'type-fest';
import {
  type OmitProtectedProps,
  type RenderPropsChildren,
  type TreeGroupNode,
  type TreeNode,
  type UseTreeOptions,
  type UseTreeResult,
} from '../../types';
import { type ButtonClassNames, type ButtonProps } from '../button/types';
import { type CheckboxClassNames } from '../checkbox/types';
import { type GroupClassNames } from '../group/types';

export type TreeClassNames = PartialDeep<{
  tree: {
    container: string;
    tree: string;
  };
  empty: string;
  group: string;
  indicator: {
    container: string;
    indicator: string;
  };
  item: {
    container: string;
    item: string;
    bar: string;
    lines: ButtonClassNames;
    visibility: ButtonClassNames;
    expansion: ButtonClassNames;
    description: string;
    actions: GroupClassNames;
    selection: CheckboxClassNames;
    drag: ButtonClassNames;
  };
}>;

export type TreeSizes = 'sm' | 'lg';

export type TreeMapping = {
  actions: Partial<Record<TreeSizes, OmitProtectedProps<ButtonProps>>>;
  button: Partial<Record<TreeSizes, OmitProtectedProps<ButtonProps>>>;
  description: Partial<Record<TreeSizes, string>>;
  drag: Partial<Record<TreeSizes, OmitProtectedProps<ButtonProps>>>;
  expansion: Partial<Record<TreeSizes, OmitProtectedProps<ButtonProps>>>;
  visibility: Partial<Record<TreeSizes, OmitProtectedProps<ButtonProps>>>;
};

export type TreeRenderProps<T> = UseTreeResult<T> & {
  treeGroupProps: Omit<TreeGroupProps<T>, 'children'>;
};

export type TreeGroupRenderProps = Omit<GridListRenderProps, 'state'>;

export type TreeIndicatorRenderProps = {
  /**
   * Whether the drop indicator is currently the active drop target.
   * @selector [data-drop-target]
   */
  isDropTarget: boolean;
};

export type TreeItemRenderProps<T> = AsType<GridListItemRenderProps> & {
  node: TreeNode<T>;
};

type BaseProps<T> = {
  children: RenderPropsChildren<TreeItemRenderProps<T>>;
  mapping?: TreeMapping;
  classNames?: TreeClassNames;
};

type BaseTreeProps<T> = Pick<
  DragAndDropOptions,
  'renderDragPreview' | 'renderDropIndicator'
> &
  (
    | {
        /**
         * Tree defaults to automatically rendering the base TreeGroup, pass true
         * to switch rendering modes to enable renderProps children that provides
         * access to the internal state context and allows for customization of
         * layout, but requires that a TreeGroup be manually implemented
         */
        provider?: false;
        children: RenderPropsChildren<TreeItemRenderProps<T>>;
      }
    | {
        provider: true;
        children: Exclude<RenderPropsChildren<TreeRenderProps<T>>, ReactNode>;
      }
  ) & {
    allowsDragging?: boolean;
    classNames?: TreeClassNames;
    mapping?: TreeMapping;
    showTreeLines?: boolean;
    size?: TreeSizes;
  };

type BaseTreeGroupProps<T> = {
  id: Key;
  nodes: TreeNode<T>[];
};

type BaseTreeItemProps<T> = {
  index: number;
  node: TreeNode<T>;
  isFirstChild: boolean;
  isLastChild: boolean;
};

export type TreeState = Required<
  Pick<TreeRenderProps<unknown>, 'allowsExpansion' | 'allowsVisibility'>
> &
  Required<
    Pick<BaseTreeProps<unknown>, 'allowsDragging' | 'showTreeLines' | 'size'>
  >;

export type TreeGroupState = TreeGroupRenderProps & {
  /**
   * The number of items in group
   */
  count: number;
};

export type TreeIndicatorState = TreeIndicatorRenderProps & {
  dropPosition: DropPosition | 'root';
};

export type TreeItemState = Omit<TreeItemRenderProps<unknown>, 'node'> &
  Required<
    Pick<TreeGroupNode<unknown>, 'isExpanded' | 'isViewable' | 'isVisible'>
  > &
  Omit<BaseTreeItemProps<unknown>, 'node'> & {
    /**
     * The number of children
     */
    count: number;
    /**
     * If item has children
     */
    isGroup: boolean;
  };

export type TreeStateContextValue<T> = UseTreeResult<T> &
  Pick<
    TreeProps<T>,
    | 'allowsDragging'
    | 'classNames'
    | 'disabledBehavior'
    | 'keyboardNavigationBehavior'
    | 'renderDragPreview'
    | 'renderEmptyState'
    | 'selectionBehavior'
    | 'selectionMode'
    | 'showTreeLines'
    | 'size'
    | 'onAction'
    | 'onScroll'
  >;

export type TreeProps<T> = AriaLabelingProps &
  Omit<
    GridListProps<T>,
    | 'id'
    | 'children'
    | 'className'
    | 'dependencies'
    | 'disallowEmptySelection'
    | 'items'
    | 'renderDropIndicator'
    | 'style'
  > &
  UseTreeOptions<T> &
  BaseTreeProps<T>;

export type TreeGroupProps<T> = Omit<
  GridListProps<T>,
  'id' | 'children' | 'className' | 'dependencies' | 'items' | 'style'
> &
  Pick<TreeGroupNode<T>, 'types'> &
  BaseTreeGroupProps<T> &
  BaseProps<T>;

export type TreeItemProps<T> = SlotProps &
  Omit<GridListItemProps, 'children' | 'className' | 'style'> &
  BaseTreeItemProps<T> &
  BaseProps<T>;
