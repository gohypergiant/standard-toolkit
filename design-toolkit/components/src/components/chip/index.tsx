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
import type {
  BaseChipProps,
  ChipListProps,
  ChipProps,
  ChipProviderProps,
  DeletableChipProps,
  SelectableChipProps,
} from './types';

export const ChipContext =
  createContext<ContextValue<BaseChipProps, HTMLSpanElement>>(null);

function ChipProvider({ children, ...props }: ChipProviderProps) {
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
    size = ChipStylesDefaults.size,
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

  const { className, size, ...rest } = props;

  return (
    <AriaTag
      {...rest}
      ref={ref}
      className={composeRenderProps(
        className,
        (className, { isDisabled, isSelected }) =>
          selectableChip({ className, size, isDisabled, isSelected }),
      )}
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
    size,
    textValue = typeof children === 'string' ? children : undefined,
    ...rest
  } = props;

  return (
    <AriaTag
      {...rest}
      ref={ref}
      className={composeRenderProps(
        classNames?.chip,
        (className, { isDisabled }) =>
          deletableChip({ className, size, isDisabled }),
      )}
      textValue={textValue}
    >
      {composeRenderProps(
        children,
        (children, { allowsRemoving, isDisabled }) => {
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
                  remove({ className, isDisabled }),
                )}
              >
                <Icon size='small'>
                  <CancelFill />
                </Icon>
              </Button>
            </>
          );
        },
      )}
    </AriaTag>
  );
}
DeletableChip.displayName = 'Chip.Deletable';

const { list, chip } = ChipStyles();

export function Chip({ ref, ...props }: ChipProps) {
  [props, ref] = useContextProps(props, ref ?? null, ChipContext);

  const context = useContext(ChipListRenderingContext);
  const Component = context ? AriaTag : 'span';
  const {
    className,
    size = ChipStylesDefaults.size,
    variant = ChipStylesDefaults.variant,
    ...rest
  } = props;

  return (
    <Icon.Provider size={size === 'medium' ? 'small' : 'xsmall'}>
      <Component
        {...rest}
        ref={ref}
        className={chip({ size, variant, className })}
      />
    </Icon.Provider>
  );
}
Chip.displayName = 'Chip';
Chip.Deletable = DeletableChip;
Chip.List = ChipList;
Chip.Selectable = SelectableChip;
Chip.Provider = ChipProvider;
