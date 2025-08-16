// __private-exports
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

import { TreeStyles, TreeStylesDefaults } from '@/components/tree/styles';
import { isSlottedContextValue } from '@/lib/utils';
import ChevronDown from '@accelint/icons/chevron-down';
import ChevronUp from '@accelint/icons/chevron-up';
import { type ForwardedRef, forwardRef, useContext, useMemo } from 'react';
import { ButtonContext, useContextProps } from 'react-aria-components';
import { Button } from '../button';
import type { ButtonProps } from '../button/types';
import { Icon } from '../icon';
import { TreeContext } from './';

const { spacing, expansion } = TreeStyles();

type ExpandToggleProps = ButtonProps & {
  isExpanded: boolean;
  isVisible: boolean;
  isViewable: boolean;
  hasChildItems: boolean;
};

export const ExpandToggle = forwardRef(
  (props: ExpandToggleProps, ref: ForwardedRef<HTMLButtonElement>) => {
    [props] = useContextProps(props, ref, ButtonContext);
    const {
      hasChildItems,
      isDisabled,
      isExpanded,
      isViewable,
      isVisible,
      size,
    } = props;

    const context = useContext(TreeContext);

    const variant =
      (isSlottedContextValue(context) ? undefined : context?.variant) ??
      TreeStylesDefaults.variant;

    const spacer = useMemo(
      () => <div className={spacing({ variant })} />,
      [variant],
    );

    return hasChildItems ? (
      <Button
        slot='chevron'
        variant='icon'
        size={size}
        className={expansion({ isViewable, isVisible, isDisabled })}
      >
        <Icon>{isExpanded ? <ChevronDown /> : <ChevronUp />}</Icon>
      </Button>
    ) : (
      spacer
    );
  },
);
