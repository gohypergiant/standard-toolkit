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

import { type ForwardedRef, forwardRef } from 'react';
import { CheckboxContext, useContextProps } from 'react-aria-components';
import { Checkbox } from '../checkbox';
import type { CheckboxProps } from '../checkbox/types';

type SelectionToggleProps = Partial<CheckboxProps> & {
  isParentVisible?: boolean;
};

export const SelectionToggle = forwardRef(
  (props: SelectionToggleProps, ref: ForwardedRef<HTMLLabelElement>) => {
    [props] = useContextProps(props, ref, CheckboxContext);

    const { classNames, isSelected, isDisabled, ...rest } = props;

    return (
      <Checkbox
        {...rest}
        classNames={classNames}
        isSelected={isSelected}
        isDisabled={isDisabled}
      />
    );
  },
);
