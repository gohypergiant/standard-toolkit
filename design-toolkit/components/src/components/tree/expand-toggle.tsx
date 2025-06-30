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

import ChevronDown from '@accelint/icons/chevron-down';
import ChevronUp from '@accelint/icons/chevron-up';
import { cva } from 'cva';
import { type ForwardedRef, forwardRef } from 'react';
import { ButtonContext, useContextProps } from 'react-aria-components';
import { cn } from '../../lib/utils';
import { Icon } from '../icon';
import { IconButton, type IconButtonProps } from '../icon-button';

type ExpandToggleProps = IconButtonProps & {
  isExpanded: boolean;
  hasChildItems: boolean;
};

const expandToggleStyles = cva(
  'fg-default-light focus:bg-transparent cursor-pointer',
  {
    variants: {
      isDisabled: {
        true: 'fg-default-dark',
      },
    },
  },
);

const spacer = (
  <div className='group-data-[variant=compact]:w-l group-data-[variant=cozy]:w-xl group-data-[variant=tight]:w-l' />
);

export const ExpandToggle = forwardRef(
  (props: ExpandToggleProps, ref: ForwardedRef<HTMLButtonElement>) => {
    [props] = useContextProps(props, ref, ButtonContext);
    const { hasChildItems, isDisabled, isExpanded, size } = props;

    return hasChildItems ? (
      <IconButton
        slot='chevron'
        size={size}
        className={expandToggleStyles({ isDisabled })}
      >
        <Icon>{isExpanded ? <ChevronDown /> : <ChevronUp />}</Icon>
      </IconButton>
    ) : (
      spacer
    );
  },
);
