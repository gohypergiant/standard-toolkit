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

import { Icon } from '@/components/icon';
import { ToggleIconButton } from '@/components/toggle-icon-button';
import type {
  ContentRenderProps,
  TreeItemContentProps,
  TreeItemProps,
} from '@/components/tree/types';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, Hide, Show } from '@accelint/icons';
import { type VariantProps, cva } from 'cva';
import { forwardRef } from 'react';
import {
  Tree as AriaTree,
  TreeItem as AriaTreeItem,
  TreeItemContent as AriaTreeItemContent,
  type TreeProps as AriaTreeProps,
  CheckboxContext,
  type CheckboxProps,
  Collection,
  useContextProps,
} from 'react-aria-components';
import { IconButton } from '../icon-button';

const treeStyles = cva(
  cn(['fg-default-light flex flex-col gap-xs overflow-auto outline-hidden']),
  {
    variants: {
      size: {
        cozy: 'text-body-m',
        compact: 'text-body-s',
      },
    },
    defaultVariants: {
      size: 'cozy',
    },
  },
);

const selectionStyles = cva('', {
  variants: {
    isDisabled: {
      // NOTE: I wasn't a massive fan of having to specify the "not-ai-*" styles here but there was
      // no other way for the generic tailwind classnames to override due to specificity
      true: 'not-ai-selected:bg-transparent not-ai-selected:hover:bg-interactive-transparent',
      false: '',
    },
  },
});

const SelectionAction = forwardRef((props: CheckboxProps, ref) => {
  [props, ref] = useContextProps(props, ref, CheckboxContext);

  const { id, isSelected, isDisabled, onChange } = props;

  return (
    <ToggleIconButton
      id={id}
      aria-label={props['aria-label']}
      aria-labelledby={props['aria-labelledby']}
      size='small'
      variant={isSelected ? 'primary' : 'secondary'}
      isDisabled={isDisabled}
      className={selectionStyles}
      onChange={onChange}
    >
      <Icon>{isSelected ? <Show /> : <Hide />}</Icon>
    </ToggleIconButton>
  );
});

interface TreeProps<T extends object>
  extends AriaTreeProps<T>,
    VariantProps<typeof treeStyles> {}

export function Tree<T extends object>(props: TreeProps<T>) {
  const {
    children,
    className,
    disabledBehavior = 'selection',
    selectionMode = 'multiple',
    size,
    ...rest
  } = props;

  return (
    <AriaTree
      selectionMode={selectionMode}
      disabledBehavior={disabledBehavior}
      aria-label='Test'
      className={cn(treeStyles({ size, className }))}
      {...rest}
    >
      {children}
    </AriaTree>
  );
}

export const treeItemStyles = cva(
  cn([
    'group peer',
    'relative flex cursor-default items-center rounded-medium bg-surface-default p-s outline-hidden',
    'hover:bg-interactive-hover-dark',
    'data-[focus-visible=true]:bg-interactive-hover-dark data-[selected=true]:bg-interactive-hover-dark',

    // NOTE: temporary styles just to add clarity to keyboard accessibility sceranios and such. Need to get
    // with Dell and see what the design team things. A good example is if a row is selected and a user hovers
    // or keyboard tabs to it, there is no way to tell based purely on the Figma design.
    'border-l-3 border-l-transparent',
    'hover:border-l-interactive-hover',
    'data-[focus-visible=true]:border-l-interactive-hover',
  ]),
  {
    variants: {
      isDisabled: {
        true: 'fg-default-dark',
        false: '',
      },
    },
  },
);

function Content(props: TreeItemContentProps) {
  return (
    <AriaTreeItemContent>
      {(renderProps: ContentRenderProps) => {
        const { hasChildItems, isExpanded, isDisabled } = renderProps;

        return (
          <div className='flex flex-grow-1 flex-row items-center gap-xs'>
            <div className='flex flex-row items-center gap-xs'>
              <SelectionAction slot='selection' />
              {hasChildItems && (
                <div>
                  <IconButton
                    size='small'
                    slot='chevron'
                    className={cn([
                      IconButton.as({ isDisabled, size: 'small' }),
                      // NOTE: overrides cursor style when `isDisabled` is true per the note above
                      'cursor-pointer',
                    ])}
                  >
                    <Icon>
                      {isExpanded ? <ChevronDown /> : <ChevronRight />}
                    </Icon>
                  </IconButton>
                </div>
              )}
              {props.children}
              <div className='flex flex-row items-center gap-xs'>
                {props.actionComponent}
              </div>
            </div>
          </div>
        );
      }}
    </AriaTreeItemContent>
  );
}

function Item(props: TreeItemProps) {
  const { label, isDisabled, ...rest } = props;
  return (
    <AriaTreeItem
      {...rest}
      textValue={label}
      className={treeItemStyles({ isDisabled })}
    >
      <Content {...props} actionComponent={props.actionComponent}>
        {props.label}
      </Content>
      {props.children}
    </AriaTreeItem>
  );
}

function Node(props: TreeItemProps) {
  return (
    <Item {...props}>
      <Collection items={props.value?.children}>
        {(item) => {
          return <Node label={item.label} textValue={item.label} />;
        }}
      </Collection>
    </Item>
  );
}

Tree.Item = Item;
Tree.Node = Node;
