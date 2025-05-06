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

import { CancelFill } from '@/icons';
import { cn } from '@/lib/utils';
import { type VariantProps, cva } from 'cva';
import type React from 'react';
import { createContext, useContext } from 'react';
import {
  Tag as AriaTag,
  TagGroup as AriaTagGroup,
  type TagGroupProps as AriaTagGroupProps,
  TagList as AriaTagList,
  type TagListProps as AriaTagListProps,
  type TagProps as AriaTagProps,
  Button,
} from 'react-aria-components';

const chipStyles = cva(
  cn([
    'fg-default-light inline-flex w-content items-center justify-center rounded-full border outline-none',
  ]),
  {
    variants: {
      variant: {
        advisory: 'border-advisory-bold bg-advisory-subtle',
        critical: 'border-critical bg-critical-subtle',
        serious: 'border-serious bg-serious-subtle',
        normal: 'border-normal bg-normal-subtle',
        info: 'border-info-bold bg-info-subtle',
      },
      size: {
        medium: 'px-s py-xs text-body-s',
        small: 'px-s py-xs text-body-xs',
      },
    },
    defaultVariants: {
      size: 'medium',
      variant: 'info',
    },
  },
);

export interface ChipProps
  extends VariantProps<typeof chipStyles>,
    Omit<React.HTMLProps<HTMLSpanElement>, 'children' | 'size'> {
  className?: string;
  /** Used to add text to the badge, such as the number of unread notifications. */
  children?: string;
}

const Coordinator = createContext(false);

export const Chip = ({
  className,
  size = 'medium',
  variant = 'info',
  ...props
}: ChipProps) => {
  const context = useContext(Coordinator);
  const Component = context ? AriaTag : 'span';

  return (
    <Component
      className={cn(
        chipStyles({
          size,
          variant,
          className,
        }),
      )}
      {...props}
    />
  );
};
Chip.displayName = 'Chip';
Chip.as = (
  props: VariantProps<typeof chipStyles>,
  className?: string | string[],
) => cn(chipStyles({ ...props, className }));

export interface ChipListProps<T>
  extends Omit<AriaTagGroupProps, 'children'>,
    Pick<AriaTagListProps<T>, 'items' | 'children' | 'renderEmptyState'> {}

function ChipList<T extends object>({
  children,
  className,
  items,
  renderEmptyState,
  ...props
}: ChipListProps<T>) {
  return (
    <Coordinator.Provider value={true}>
      <AriaTagGroup {...props}>
        <AriaTagList<T>
          items={items}
          renderEmptyState={renderEmptyState}
          className={cn('flex flex-wrap gap-xs', className)}
        >
          {children}
        </AriaTagList>
      </AriaTagGroup>
    </Coordinator.Provider>
  );
}
ChipList.displayName = 'Chip.List';
Chip.List = ChipList;

const selectableChipStyles = cva(
  cn([
    'fg-default-light inline-flex w-content items-center justify-center rounded-full border border-interactive outline-none hover:border-interactive-hover focus:border-interactive-hover',
    'ai-selected:border-highlight ai-selected:bg-highlight-subtle',
  ]),
  {
    variants: {
      isDisabled: {
        true: 'fg-disabled ai-selected:border-interactive-disabled border-interactive-disabled ai-selected:bg-transparent hover:border-interactive-disabled focus:border-interactive-disabled',
        false: 'cursor-pointer',
      },
      size: {
        medium: 'px-s py-xs text-body-s',
        small: 'px-s py-xs text-body-xs',
      },
    },
    defaultVariants: {
      isDisabled: false,
      size: 'medium',
    },
  },
);

interface SelectableChipProps
  extends VariantProps<typeof selectableChipStyles>,
    Omit<AriaTagProps, 'isDisabled'> {}

export const SelectableChip = ({
  className,
  isDisabled = false,
  size = 'medium',
  ...props
}: SelectableChipProps) => (
  <AriaTag
    className={cn(
      selectableChipStyles({
        isDisabled,
        size,
        className,
      }),
    )}
    {...props}
  />
);
SelectableChip.displayName = 'Chip.Selectable';
Chip.Selectable = SelectableChip;

const deletableChipStyles = cva(
  cn([
    'fg-default-light group inline-flex w-content items-center justify-center gap-xs rounded-full border border-interactive outline-none hover:border-interactive-hover focus:border-interactive-hover',
  ]),
  {
    variants: {
      isDisabled: {
        true: 'fg-disabled border-interactive-disabled hover:border-interactive-disabled',
        false: '',
      },
      size: {
        medium: 'p-xs pl-m text-body-s',
        small: 'p-xs pl-s text-body-xs',
      },
    },
    defaultVariants: {
      isDisabled: false,
      size: 'medium',
    },
  },
);

interface DeletableChipProps
  extends VariantProps<typeof deletableChipStyles>,
    Omit<AriaTagProps, 'isDisabled'> {}

export const DeletableChip = ({
  children,
  className,
  isDisabled = false,
  size = 'medium',
  textValue,
  ...props
}: DeletableChipProps) => {
  const internalTextValue =
    textValue ?? (typeof children === 'string' ? children : undefined);

  return (
    <AriaTag
      className={cn(
        deletableChipStyles({
          isDisabled,
          size,
          className,
        }),
      )}
      textValue={internalTextValue}
      {...props}
    >
      {({ allowsRemoving, ...props }) => {
        if (!allowsRemoving) {
          throw new Error(
            'You have a <Chip.Deletable> in a <Chip.List> does not specify an onRemove handler.',
          );
        }

        return (
          <>
            {typeof children === 'function'
              ? children({ allowsRemoving, ...props })
              : children}
            <Button
              slot='remove'
              className={cn([
                'icon-size-[15px] icon-default-dark group-hover:icon-default-light group-focus:icon-default-light cursor-pointer',
                isDisabled &&
                  'icon-disabled group-hover:icon-disabled cursor-not-allowed',
              ])}
            >
              <CancelFill />
            </Button>
          </>
        );
      }}
    </AriaTag>
  );
};
DeletableChip.displayName = 'Chip.Deletable';
Chip.Deletable = DeletableChip;
