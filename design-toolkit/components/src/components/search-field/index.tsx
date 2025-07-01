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
import {
  CancelFill,
  Loop as LoopIcon,
  Search as SearchIcon,
} from '@accelint/icons';
import { cva } from 'cva';
import {
  SearchField as AriaSearchField,
  Button,
  Input,
} from 'react-aria-components';
import { Icon } from '../icon';

export interface SearchFieldProps {
  className?: string;
  /** Disables the input field. */
  isDisabled?: boolean;
  /** Displays a loading spinner. */
  isLoading?: boolean;
  /** Displays placeholder text. */
  placeholder?: string;
  /** Whether the input has a filled background or outlined. */
  variant?: 'filled' | 'outlined';
}

const textFieldStyles = cva(
  [
    'hide-cancel block w-full rounded-round p-s pr-[30px] pl-[35px] font-display text-body-s outline',
  ],
  {
    variants: {
      isDisabled: {
        true: 'text-disabled outline-interactive-disabled placeholder:text-disabled',
        false:
          'text-default-light placeholder:text-default-dark hover:outline-interactive-hover focus:outline-highlight',
      },
      variant: {
        filled: 'bg-surface-raised outline-static-dark',
        outlined: 'outline-interactive',
      },
    },
  },
);

export const SearchField = ({
  className,
  placeholder = 'Search',
  variant = 'outlined',
  isLoading = false,
  ...rest
}: SearchFieldProps) => {
  return (
    <AriaSearchField className={cn('group relative', className)} {...rest}>
      <Icon className='fg-interactive-hover absolute top-[6px] left-[7px]'>
        <SearchIcon />
      </Icon>
      <Input
        placeholder={placeholder}
        className={({ isDisabled }) =>
          cn(textFieldStyles({ isDisabled, variant }))
        }
      />
      {isLoading ? (
        <Icon className='fg-interactive-hover absolute top-[6px] right-[8px] animate-spin'>
          <LoopIcon className='scale-x-[-1]' />
        </Icon>
      ) : (
        <Button className='fg-default-dark icon-size-l hover:fg-interactive-hover absolute top-[6px] right-[8px] cursor-pointer group-dtk-disabled:hidden group-dtk-empty:hidden'>
          <Icon>
            <CancelFill />
          </Icon>
        </Button>
      )}
    </AriaSearchField>
  );
};

SearchField.displayName = 'SearchField';
