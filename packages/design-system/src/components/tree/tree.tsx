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

import { noop } from '@accelint/core';
import { usePress } from '@react-aria/interactions';
import type { Key } from '@react-types/shared';
import { createContext, useCallback, useContext, useMemo } from 'react';
import {
  type ContextValue,
  DEFAULT_SLOT,
  DropIndicator,
  type DropTarget,
  GridList,
  GridListItem,
  type GridListItemRenderProps,
  type GridListRenderProps,
  Provider,
  ButtonContext as RACButtonContext,
  type ButtonProps as RACButtonProps,
  type TextProps,
  useDragAndDrop,
} from 'react-aria-components';
import { useDefaultProps, useTheme, useTree } from '../../hooks';
import { bodies } from '../../styles';
import { callRenderProps, inlineVars, mergeClassNames } from '../../utils';
import { AriaTextContext } from '../aria';
import {
  Button,
  ButtonContext,
  type ButtonProps,
  ToggleButtonContext,
  type ToggleButtonProps,
} from '../button';
import { CheckboxContext, type CheckboxProps } from '../checkbox';
import { GroupContext, type GroupProps } from '../group';
import { Icon } from '../icon';
import { MergeProvider } from '../merge-provider';
import {
  treeClassNames,
  treeGroupStateVars,
  treeIndicatorStateVars,
  treeItemStateVars,
  treeStateVars,
} from './tree.css';
import type {
  TreeGroupProps,
  TreeIndicatorRenderProps,
  TreeItemProps,
  TreeMapping,
  TreeProps,
  TreeStateContextValue,
} from './types';
import { createDragAndDropHandlers } from './utils';

const emptyTree = {
  key: '',
  parentKey: '',
  children: [],
  value: { id: '', label: '' },
};

const defaultMapping: TreeMapping = {
  actions: {
    sm: {},
    lg: {},
  },
  button: {
    sm: { size: 'sm', variant: 'icon' },
    lg: { size: 'md', variant: 'icon' },
  },
  description: {
    sm: bodies.sm,
    lg: bodies.md,
  },
  drag: {
    sm: {},
    lg: {},
  },
  expansion: {
    sm: {},
    lg: {},
  },
  visibility: {
    sm: {},
    lg: {},
  },
};

const defaultSize = 'lg';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TreeStateContext = createContext<TreeStateContextValue<any>>({
  allowsDragging: true,
  allowsExpansion: true,
  allowsVisibility: false,
  lookup: {},
  selectedKeys: new Set(),
  selectionMode: 'none',
  tree: emptyTree,
  actions: {
    append: noop,
    getItem: () => emptyTree,
    insert: noop,
    insertAfter: noop,
    insertBefore: noop,
    move: noop,
    prepend: noop,
    remove: noop,
    removeSelectedItems: noop,
    revertIsExpanded: noop,
    setSelectedKeys: noop,
    toggleIsExpanded: noop,
    toggleIsSelected: noop,
    toggleIsViewable: noop,
    update: noop,
  },
});

function defaultRenderEmptyState({ isDropTarget }: GridListRenderProps) {
  return isDropTarget ? 'Add to this group' : 'Nothing to see here';
}

/**
 * By default Tree only works as an uncontrolled input. However, if you need to use the Tree
 * as a controlled input (passing state changes to the "nodes" props), you will need to add a
 * "key" prop that is a hash of the "nodes" prop to trigger a rerender of the component and
 * abandon it's previous state. Unfortunately, the underlying hooks don't provide a good way
 * to update the internal state of the Tree onces it's been initialized.
 */
export function Tree<T>(props: TreeProps<T>) {
  props = useDefaultProps(props as TreeProps<unknown>, 'Tree') as TreeProps<T>;

  const {
    children: childrenProp,
    allowsDragging = false,
    allowsExpansion = true,
    allowsVisibility = false,
    classNames: classNamesProps,
    disabledBehavior = 'all',
    keyboardNavigationBehavior = 'arrow',
    mapping: mappingProp,
    nodes,
    provider,
    renderDragPreview,
    renderEmptyState: renderEmptyStateProp = defaultRenderEmptyState,
    selectionBehavior = 'replace',
    selectionMode = 'none',
    showTreeLines = true,
    size = defaultSize,
    onAction,
    onScroll,
    onSelectionChange,
    onUpdate,
    ...rest
  } = props;

  const state = useTree({
    allowsExpansion,
    allowsVisibility,
    nodes,
    selectionMode,
    onSelectionChange,
    onUpdate,
  });

  const theme = useTheme();

  const mapping = useMemo(
    () => ({
      ...defaultMapping,
      ...mappingProp,
    }),
    [mappingProp],
  );

  const classNames = useMemo(
    () =>
      mergeClassNames(treeClassNames, theme.Tree, classNamesProps, {
        item: {
          description: mapping.description[size],
        },
      }) ?? {},
    [theme.Tree, classNamesProps, mapping, size],
  );

  const renderEmptyState = useCallback(
    (renderProps: GridListRenderProps) => (
      <div className={classNames?.empty}>
        {renderEmptyStateProp(renderProps)}
      </div>
    ),
    [classNames?.empty, renderEmptyStateProp],
  );

  const context = useMemo<
    [[typeof TreeStateContext, TreeStateContextValue<T>]]
  >(
    () => [
      [
        TreeStateContext,
        {
          ...state,
          allowsDragging,
          classNames,
          disabledBehavior,
          keyboardNavigationBehavior,
          renderDragPreview,
          renderEmptyState,
          selectionBehavior,
          selectionMode,
          showTreeLines,
          size,
          onAction,
          onScroll,
        },
      ],
    ],
    [
      state,
      allowsDragging,
      classNames,
      disabledBehavior,
      keyboardNavigationBehavior,
      renderDragPreview,
      renderEmptyState,
      selectionBehavior,
      selectionMode,
      showTreeLines,
      size,
      onAction,
      onScroll,
    ],
  );

  const style = useMemo(
    () =>
      inlineVars(treeStateVars, {
        allowsDragging,
        allowsExpansion: state.allowsExpansion,
        allowsVisibility: state.allowsVisibility,
        showTreeLines,
        size,
      }),
    [
      allowsDragging,
      state.allowsExpansion,
      state.allowsVisibility,
      showTreeLines,
      size,
    ],
  );

  const children = useMemo(() => {
    const treeGroupProps = {
      ...rest,
      id: state.tree.key,
      nodes: state.tree.children,
    };

    return provider ? (
      callRenderProps(childrenProp, { ...state, treeGroupProps })
    ) : (
      <TreeGroup {...treeGroupProps}>{childrenProp}</TreeGroup>
    );
  }, [rest, provider, childrenProp, state]);

  return (
    <Provider values={context}>
      <div className={classNames?.tree?.container} style={style}>
        <div className={classNames?.tree?.tree}>{children}</div>
      </div>
    </Provider>
  );
}

export function TreeGroup<T>({
  id,
  children,
  nodes,
  types = ['all'],
  ...rest
}: TreeGroupProps<T>) {
  const {
    actions,
    allowsDragging,
    classNames,
    disabledBehavior,
    keyboardNavigationBehavior,
    lookup,
    renderDragPreview,
    renderEmptyState,
    selectedKeys,
    selectionBehavior,
    selectionMode,
    onAction,
    onScroll,
  } = useContext(TreeStateContext);

  const acceptedDragTypes = useMemo(
    () => types.map((type) => `tree-${type}`),
    [types],
  );

  // This function cannot be treated as a component and will throw errors if implemented as one (with hooks)
  const renderDropIndicator = useCallback(
    (target: DropTarget) => (
      <DropIndicator
        className={classNames?.indicator?.container}
        // eslint-disable-next-line react-perf/jsx-no-new-function-as-prop, react/jsx-no-bind
        style={(renderProps: TreeIndicatorRenderProps) =>
          inlineVars(treeIndicatorStateVars, {
            ...renderProps,
            dropPosition:
              'dropPosition' in target ? target.dropPosition : 'root',
          })
        }
        target={target}
      >
        <div className={classNames?.indicator?.indicator} />
      </DropIndicator>
    ),
    [classNames?.indicator?.container, classNames?.indicator?.indicator],
  );

  const { dragAndDropHooks } = useDragAndDrop({
    isDisabled: !allowsDragging,
    renderDragPreview,
    renderDropIndicator,
    ...createDragAndDropHandlers(id, acceptedDragTypes, lookup, actions),
  });

  const style = useCallback(
    (renderProps: GridListRenderProps) =>
      inlineVars(treeGroupStateVars, { ...renderProps, count: nodes.length }),
    [nodes.length],
  );

  const indices = useMemo(
    () =>
      nodes.reduce<Record<Key, number>>((acc, node, index) => {
        acc[node.key] = index;

        return acc;
      }, {}),
    [nodes],
  );

  return (
    <GridList
      {...rest}
      className={classNames?.group}
      disabledBehavior={disabledBehavior}
      dragAndDropHooks={dragAndDropHooks}
      items={nodes}
      keyboardNavigationBehavior={keyboardNavigationBehavior}
      renderEmptyState={renderEmptyState}
      selectedKeys={selectedKeys}
      selectionBehavior={selectionBehavior}
      selectionMode={selectionMode}
      style={style}
      onAction={onAction}
      onScroll={onScroll}
    >
      {(item) => (
        <TreeItem
          index={indices[item.key] ?? -1}
          node={item}
          isFirstChild={indices[item.key] === 0}
          isLastChild={indices[item.key] === nodes.length - 1}
        >
          {children}
        </TreeItem>
      )}
    </GridList>
  );
}

type TreeItemContexts = [
  [
    typeof ToggleButtonContext,
    ContextValue<ToggleButtonProps, HTMLButtonElement>,
  ],
  [typeof AriaTextContext, ContextValue<TextProps, HTMLSpanElement>],
  [
    typeof GroupContext,
    ContextValue<GroupProps<ButtonProps, HTMLButtonElement>, HTMLDivElement>,
  ],
  [typeof CheckboxContext, ContextValue<CheckboxProps, HTMLLabelElement>],
  [typeof ButtonContext, ContextValue<ButtonProps, HTMLButtonElement>],
  [typeof RACButtonContext, ContextValue<RACButtonProps, HTMLButtonElement>],
];

const contextBlocker: TreeItemContexts = [
  [ToggleButtonContext, null],
  [AriaTextContext, null],
  [GroupContext, null],
  [CheckboxContext, null],
  [ButtonContext, null],
  [RACButtonContext, null],
];

export function TreeItem<T>({
  children: childrenProp,
  index,
  mapping: mappingProp,
  node,
  isFirstChild,
  isLastChild,
  ...rest
}: TreeItemProps<T>) {
  const {
    actions,
    allowsExpansion,
    classNames,
    size: sizeProp,
  } = useContext(TreeStateContext);

  const mapping = useMemo(
    () => ({
      ...defaultMapping,
      ...mappingProp,
    }),
    [mappingProp],
  );

  const selection = useMemo(() => new Set([node.key]), [node.key]);

  const handleToggleExpansion = useCallback(
    () => actions.toggleIsExpanded(selection),
    [actions, selection],
  );

  const handleToggleSelection = useCallback(
    () => actions.toggleIsSelected(selection),
    [actions, selection],
  );

  const handleToggleVisibility = useCallback(
    () => actions.toggleIsViewable(selection),
    [actions, selection],
  );

  const { pressProps } = usePress({
    onPress: handleToggleExpansion,
  });

  const style = useCallback(
    (renderProps: GridListItemRenderProps) =>
      inlineVars(treeItemStateVars, {
        ...renderProps,
        count: node.children.length,
        index,
        isExpanded: 'nodes' in node.value ? !!node.value.isExpanded : false,
        isFirstChild,
        isGroup: 'nodes' in node.value,
        isLastChild,
        isViewable: !!node.value.isViewable,
        isVisible: !!node.value.isVisible,
      }),
    [node.children.length, node.value, index, isFirstChild, isLastChild],
  );

  const context = useMemo<TreeItemContexts>(() => {
    const size = sizeProp ?? defaultSize;
    const buttonProps = mapping.button[size] ?? {};

    return [
      [
        ToggleButtonContext,
        {
          slots: {
            [DEFAULT_SLOT]: buttonProps,
            expansion: {
              ...buttonProps,
              ...mapping.expansion[size],
              classNames: classNames?.item?.expansion,
              isSelected:
                'nodes' in node.value ? !!node.value.isExpanded : undefined,
              onPress: handleToggleExpansion,
            },
            visibility: {
              ...buttonProps,
              ...mapping.visibility[size],
              classNames: classNames?.item?.visibility,
              isSelected: !!node.value.isViewable,
              onPress: handleToggleVisibility,
            },
          },
        },
      ],
      [
        AriaTextContext,
        {
          slots: {
            [DEFAULT_SLOT]: {},
            description: {
              ...('nodes' in node.value ? pressProps : {}),
              className: classNames?.item?.description,
              children: node.value.label,
            },
          },
        },
      ],
      [
        GroupContext,
        {
          slots: {
            [DEFAULT_SLOT]: {},
            actions: {
              classNames: classNames?.item?.actions,
              context: ButtonContext,
              values: buttonProps,
            },
          },
        },
      ],
      [
        CheckboxContext,
        {
          slots: {
            [DEFAULT_SLOT]: {},
            selection: {
              classNames: classNames?.item?.selection,
              onChange: handleToggleSelection,
            },
          },
        },
      ],
      [
        ButtonContext,
        {
          slots: {
            [DEFAULT_SLOT]: buttonProps,
            drag: {
              ...buttonProps,
              ...mapping.drag[size],
              classNames: classNames?.item?.drag,
            },
            // We use a non-interactive Button for the lines to try and simplify the
            // consistent use of space when rendered in alignment with other Buttons
            lines: {
              ...buttonProps,
              classNames: classNames?.item?.lines,
              isDisabled: true,
            },
          },
        },
      ],
      // Need to expand the RAC ButtonContext to allow for additional slots
      [RACButtonContext, { slots: { [DEFAULT_SLOT]: {}, lines: {} } }],
    ];
  }, [
    classNames?.item?.lines,
    classNames?.item?.expansion,
    classNames?.item?.visibility,
    classNames?.item?.description,
    classNames?.item?.actions,
    classNames?.item?.selection,
    classNames?.item?.drag,
    mapping,
    node,
    pressProps,
    sizeProp,
    handleToggleExpansion,
    handleToggleSelection,
    handleToggleVisibility,
  ]);

  /**
   * We need to block the above contexts from being passed into the TreeGroup
   * so that each TreeItem has a distinct context. We only use MergeProvider
   * for the above contexts because the GridListItem provides contexts that
   * we need to merge with
   */
  const children = useCallback(
    (renderProps: GridListItemRenderProps) => (
      <MergeProvider values={context}>
        <div className={classNames?.item?.item}>
          {node.parentKey && (
            <Button slot='lines'>
              <Icon />
            </Button>
          )}
          <div className={classNames?.item?.bar}>
            {callRenderProps(childrenProp, {
              ...renderProps,
              node,
            })}
          </div>
          {'nodes' in node.value &&
            (!allowsExpansion || node.value.isExpanded) && (
              <Provider values={contextBlocker}>
                <TreeGroup
                  id={node.key}
                  nodes={node.children}
                  types={node.value.types}
                  aria-label={node.value.label}
                >
                  {childrenProp}
                </TreeGroup>
              </Provider>
            )}
        </div>
      </MergeProvider>
    ),
    [
      context,
      classNames?.item?.item,
      classNames?.item?.bar,
      node,
      childrenProp,
      allowsExpansion,
    ],
  );

  return (
    <GridListItem
      {...rest}
      className={classNames?.item?.container}
      style={style}
      textValue={node.value.label}
    >
      {children}
    </GridListItem>
  );
}
