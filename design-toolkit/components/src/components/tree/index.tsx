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

import { ChevronDown, Hide, Show } from '@/icons';
import { cn } from '@/lib/utils';
import { cva } from 'cva';
import { forwardRef } from 'react';
import {
  Tree as AriaTree,
  TreeItem as AriaTreeItem,
  TreeItemContent as AriaTreeItemContent,
  CheckboxContext,
  type CheckboxProps,
  useContextProps,
} from 'react-aria-components';
import { IconButton } from '../icon-button';

const treeStyles = cva(
  cn(['fg-default-light flex flex-col overflow-auto outline-hidden gap-xs']),
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

function TreeInternal(props) {
  const { children, size, className, ...etc } = props;

  return (
    <AriaTree
      // NOTE: hardcoding some of this but the idea is that most if not all props will just spread
      // NOTE: the goal is to NOT implicitly manage any state for this component and instead allow
      // the user to control it externally in userland code.
      selectionMode='multiple'
      disabledBehavior='selection'
      aria-label='Test'
      className={cn(treeStyles({ size, className }))}
      {...etc}
    >
      {children}
    </AriaTree>
  );
}

export const Tree = TreeInternal;

const chevronGhostStyles = cn([
  IconButton.as({ size: 'small', isDisabled: true }),
  'cursor-default',
]);

function ChevronAction(props) {
  const { hasChildren, isDisabled } = props;

  if (hasChildren) {
    return (
      <IconButton
        // NOTE: we want the visual appearance of a disabled button but we don't want to
        // actually supply the `isDisabled` prop to `IconButton` as we still need the ability
        // to toggle the dropdown to see children that may not be disabled.
        className={cn([
          IconButton.as({ isDisabled, size: 'small' }),
          // NOTE: overrides cursor style when `isDisabled` is true per the note above
          'cursor-pointer',
        ])}
      >
        <ChevronDown className='group-data-[expanded=true]:rotate-270' />
      </IconButton>
    );
  }

  return <div className={chevronGhostStyles} />;
}

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
    <IconButton
      id={id}
      aria-label={props['aria-label']}
      aria-labelledby={props['aria-labelledby']}
      size='small'
      variant={isSelected ? 'primary' : 'secondary'}
      isDisabled={isDisabled}
      className={selectionStyles}
      // FIXME: this technically works? What sins are we committing by doing this?
      onPress={onChange}
    >
      {isSelected ? <Show /> : <Hide />}
    </IconButton>
  );
});

const treeItemStyles = cva(
  cn([
    'group peer',
    'relative p-s outline-hidden cursor-default flex items-center bg-surface-default rounded-medium',
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

// NOTE: placeholder until <Icon /> component comes online
const entityIconStyles = cn([
  IconButton.as({ size: 'small' }),
  'cursor-default',
]);

function TreeItemInternal(props) {
  const { children, label, isDisabled, ...etc } = props;

  return (
    <AriaTreeItem
      textValue={label}
      className={treeItemStyles({ isDisabled })}
      isDisabled={isDisabled}
      {...etc}
    >
      <AriaTreeItemContent>
        {(innerProps) => {
          const { hasChildItems, isSelected, level } = innerProps;

          return (
            <div className='flex flex-row flex-grow-1 items-center gap-xs'>
              <div className='flex flex-row items-center gap-xs'>
                <SelectionAction
                  isSelected={isSelected}
                  isDisabled={isDisabled}
                  slot='selection'
                />
                {/* NOTE: could swap this with a css grid implementation or something but this
                    is incredibly straightforward so I went with this approach.
                */}
                <div
                  className={cn([
                    chevronGhostStyles,
                    'w-[calc(calc(var(--tree-item-level)_-_1)_*_20px)]',
                    level === 1 && 'hidden',
                  ])}
                />
                <ChevronAction
                  slot='chevron'
                  hasChildren={hasChildItems}
                  isSelected={isSelected}
                  isDisabled={isDisabled}
                />
              </div>
              <div className='flex flex-row flex-grow-1 justify-between items-center'>
                <div className='flex flex-row items-center gap-xs'>
                  {props.iconComponent && (
                    <div className={entityIconStyles}>
                      {props.iconComponent}
                    </div>
                  )}

                  {label}
                </div>
                <div className='flex flex-row items-center gap-xs'>
                  {/* TODO: support function as well as ReactNode, spread `innerProps` */}
                  {props.actionComponent}

                  {/* TODO: drag component? */}
                </div>
              </div>
            </div>
          );
        }}
      </AriaTreeItemContent>
      {/* NOTE: for some reason shifting children inside of <AriaTreeItemContent /> completely
          bricks RAC? Not sure the root cause but it does limit what we can do a bit with regards
          to certain DX patterns for consumers.
      */}
      {children}
    </AriaTreeItem>
  );
}

Tree.Item = TreeItemInternal;
