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
import { CancelFill } from '@accelint/icons';
import { createContext, useContext } from 'react';
import {
  Tag as AriaTag,
  TagGroup as AriaTagGroup,
  TagList as AriaTagList,
  Button,
  type ContextValue,
  composeRenderProps,
  useContextProps,
} from 'react-aria-components';
import { Icon } from '../icon';
import {
  ChipStyles,
  ChipStylesDefaults,
  DeletableChipStyles,
  SelectableChipStyles,
} from './styles';
import type { ProviderProps } from '@/lib/types';
import type {
  BaseChipProps,
  ChipListProps,
  ChipProps,
  DeletableChipProps,
  SelectableChipProps,
} from './types';

export const ChipContext =
  createContext<ContextValue<BaseChipProps, HTMLDivElement>>(null);

function ChipProvider({ children, ...props }: ProviderProps<BaseChipProps>) {
  return <ChipContext.Provider value={props}>{children}</ChipContext.Provider>;
}
ChipProvider.displayName = 'Chip.Provider';

const ChipListRenderingContext = createContext(false);

function ChipList<T extends object>({ ref, ...props }: ChipListProps<T>) {
  [props, ref] = useContextProps(props, ref ?? null, ChipContext);

  const {
    children,
    className,
    dependencies,
    items,
    renderEmptyState,
    size = 'medium',
    ...rest
  } = props;

  return (
    <ChipListRenderingContext.Provider value>
      <ChipProvider size={size}>
        <AriaTagGroup {...rest}>
          <AriaTagList<T>
            ref={ref}
            className={composeRenderProps(className, (className) =>
              list({ className }),
            )}
            dependencies={dependencies}
            items={items}
            renderEmptyState={renderEmptyState}
          >
            {children}
          </AriaTagList>
        </AriaTagGroup>
      </ChipProvider>
    </ChipListRenderingContext.Provider>
  );
}
ChipList.displayName = 'Chip.List';

const { chip: selectableChip } = SelectableChipStyles();

function SelectableChip({ ref, ...props }: SelectableChipProps) {
  [props, ref] = useContextProps(props, ref ?? null, ChipContext);

  const { className, size = 'medium', ...rest } = props;

  return (
    <AriaTag
      {...rest}
      ref={ref}
      className={composeRenderProps(className, (className) =>
        selectableChip({ className, size }),
      )}
      data-size={size}
    />
  );
}
SelectableChip.displayName = 'Chip.Selectable';

const { chip: deletableChip, remove } = DeletableChipStyles();

function DeletableChip({ ref, ...props }: DeletableChipProps) {
  [props, ref] = useContextProps(props, ref ?? null, ChipContext);

  const {
    children,
    classNames,
    size = 'medium',
    textValue = typeof children === 'string' ? children : undefined,
    ...rest
  } = props;

  return (
    <AriaTag
      {...rest}
      ref={ref}
      className={composeRenderProps(classNames?.chip, (className) =>
        deletableChip({ className, size }),
      )}
      textValue={textValue}
      data-size={size}
    >
      {composeRenderProps(children, (children, { allowsRemoving }) => {
        if (!allowsRemoving) {
          throw new Error(
            'You have a <Chip.Deletable> in a <Chip.List> that does not specify an onRemove handler.',
          );
        }

        return (
          <>
            {children}
            <Button
              slot='remove'
              className={composeRenderProps(classNames?.remove, (className) =>
                remove({ className }),
              )}
            >
              <Icon size='small'>
                <CancelFill />
              </Icon>
            </Button>
          </>
        );
      })}
    </AriaTag>
  );
}
DeletableChip.displayName = 'Chip.Deletable';

const { list, chip } = ChipStyles();

/**
 * Chip - A compact element for displaying tags, filters, or selectable items
 *
 * Provides flexible chip functionality supporting both individual chips and chip lists.
 * Includes variants for deletable and selectable chips with keyboard navigation and
 * accessibility features. Perfect for tags, filters, or multi-selection interfaces.
 *
 * @example
 * // Basic chip
 * <Chip>JavaScript</Chip>
 *
 * @example
 * // Chip list with multiple items
 * <Chip.List>
 *   <Chip>React</Chip>
 *   <Chip>TypeScript</Chip>
 *   <Chip>Node.js</Chip>
 * </Chip.List>
 *
 * @example
 * // Deletable chips
 * <Chip.List onRemove={() => console.log('removed')}>
 *   <Chip.Deletable>
 *     Removable Tag
 *   </Chip.Deletable>
 * </Chip.List>
 *
 * @example
 * // Selectable chips
 * <Chip.List selectionMode="multiple">
 *   <Chip.Selectable id="option1">Option 1</Chip.Selectable>
 *   <Chip.Selectable id="option2">Option 2</Chip.Selectable>
 * </Chip.List>
 */
export function Chip({ ref, ...props }: ChipProps) {
  [props, ref] = useContextProps(props, ref ?? null, ChipContext);

  const context = useContext(ChipListRenderingContext);
  const Component = context ? AriaTag : 'div';
  const {
    className,
    size = 'medium',
    variant = ChipStylesDefaults.variant,
    ...rest
  } = props;

  return (
    <Icon.Provider size={size === 'medium' ? 'small' : 'xsmall'}>
      <Component
        {...rest}
        ref={ref}
        className={chip({ size, variant, className })}
        data-size={size}
      />
    </Icon.Provider>
  );
}
Chip.displayName = 'Chip';
Chip.Provider = ChipProvider;
Chip.List = ChipList;
Chip.Deletable = DeletableChip;
Chip.Selectable = SelectableChip;
