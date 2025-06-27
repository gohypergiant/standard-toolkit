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

import { cn } from '@/lib/utils';
import { CancelFill } from '@accelint/icons';
import { type VariantProps, cva } from 'cva';
import type React from 'react';
import { type ReactNode, createContext, useContext } from 'react';
import {
  Tag as AriaTag,
  TagGroup as AriaTagGroup,
  type TagGroupProps as AriaTagGroupProps,
  TagList as AriaTagList,
  type TagListProps as AriaTagListProps,
  type TagProps as AriaTagProps,
  Button,
} from 'react-aria-components';
import { Icon } from '../icon';

const chipStyles = cva(
  cn([
    'fg-default-light inline-flex w-content items-center justify-center gap-xxs rounded-full outline',
  ]),
  {
    variants: {
      variant: {
        advisory: 'bg-advisory-subtle outline-advisory-bold',
        critical: 'bg-critical-subtle outline-critical',
        serious: 'bg-serious-subtle outline-serious',
        normal: 'bg-normal-subtle outline-normal',
        info: 'bg-info-subtle outline-info-bold',
      },
      size: {
        medium: 'icon-size-l px-s py-xs text-body-s',
        small: 'icon-size-m px-s py-xs text-body-xs',
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
  children?: ReactNode;
}

// This coordinator is used as a way for the `<Chip>` component to understand
// whether or not it is being rendered inside of a `<Chip.List>`. This allows
// us to opt-into using an `<AriaTag>` or a `<span>` to ensure standalone
// functionality.
const Coordinator = createContext(false);

export const Chip = ({
  className,
  size = 'medium',
  variant = 'info',
  ...props
}: ChipProps) => {
  const context = useContext(Coordinator);

  // If any context was returned from the `Coordinator` context, then
  // we are being rendered inside of a `Chip.List` and need to render
  // an `<AriaTag>`.
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
    'fg-default-light inline-flex w-content items-center justify-center rounded-full outline outline-interactive hover:outline-interactive-hover focus:outline-interactive-hover',
    'dtk-selected:bg-highlight-subtle dtk-selected:outline-highlight',
  ]),
  {
    variants: {
      isDisabled: {
        true: 'fg-disabled dtk-selected:bg-transparent dtk-selected:outline-interactive-disabled outline-interactive-disabled hover:outline-interactive-disabled focus:outline-interactive-disabled',
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
    'fg-default-light group inline-flex w-content items-center justify-center gap-xs rounded-full outline outline-interactive hover:outline-interactive-hover focus:outline-interactive-hover',
  ]),
  {
    variants: {
      isDisabled: {
        true: 'fg-disabled outline-interactive-disabled hover:outline-interactive-disabled',
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
              <Icon>
                <CancelFill />
              </Icon>
            </Button>
          </>
        );
      }}
    </AriaTag>
  );
};
DeletableChip.displayName = 'Chip.Deletable';
Chip.Deletable = DeletableChip;
