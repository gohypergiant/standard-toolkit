import type { Key } from 'react-aria';
import type { Selection, SelectionMode, TreeData } from 'react-stately';

export type TreeItemNode<T> = {
  id: Key;
  label: string;
  type?: string;
  value?: T;
  isViewable?: boolean; // mutable
  isVisible?: boolean; // computed
};

export type TreeGroupNode<T> = TreeItemNode<T> & {
  nodes: TreeNodes<T>[];
  types?: string[];
  isExpanded?: boolean;
};

export type TreeNodes<T> = TreeGroupNode<T> | TreeItemNode<T>;

export type TreeNode<T, N extends TreeNodes<T> = TreeNodes<T>> = {
  key: Key;
  parentKey: Key;
  value: N;
  children: TreeNode<T, N>[];
};

export type TreeActions<T> = Omit<
  TreeData<TreeNodes<T>>,
  'items' | 'selectedKeys' | 'update'
> & {
  revertIsExpanded: () => void;
  toggleIsExpanded: (
    selection?: Selection,
    isExpanded?: boolean,
    isRevertable?: boolean,
  ) => void;
  toggleIsSelected: (selection?: Selection, isSelected?: boolean) => void;
  toggleIsViewable: (selection?: Selection, isViewable?: boolean) => void;
  update: (key: Key, node: Partial<TreeNodes<T>>) => void;
};

export type UseTreeOptions<T> = {
  allowsExpansion?: boolean;
  allowsVisibility?: boolean;
  nodes: TreeNodes<T>[];
  selectionMode?: SelectionMode;
  onSelectionChange?: (keys: Selection) => void;
  /**
   * Due to being triggered during the render cycle, this event
   * handler should not be tied to any state change updates
   */
  onUpdate?: (nodes: TreeNodes<T>[]) => void;
};

export type UseTreeResult<T> = Required<
  Omit<UseTreeOptions<T>, 'nodes' | 'onSelectionChange' | 'onUpdate'>
> &
  Pick<TreeData<TreeNodes<T>>, 'selectedKeys'> & {
    lookup: Record<Key, TreeNode<T>>;
    tree: TreeNode<T>;
    /**
     * DO NOT DESTRUCTURE THIS PROPERTY
     *
     * The underlying useTreeData hook relies on "this" within certain methods
     * and destructuring the actions will cause errors to be thrown
     */
    actions: TreeActions<T>;
  };
