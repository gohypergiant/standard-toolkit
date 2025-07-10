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

import { TreeContext } from '@/components/tree/index';
import { TreeStyles, TreeStylesDefaults } from '@/components/tree/styles';
import { isSlottedContextValue } from '@/lib/utils';
import {
  CheckboxSelected,
  CheckboxUnselected,
  Hide,
  Show,
} from '@accelint/icons';
import { type ForwardedRef, forwardRef, useContext } from 'react';
import {
  CheckboxContext,
  composeRenderProps,
  useContextProps,
} from 'react-aria-components';
import type { CheckboxProps } from '../checkbox';
import { Icon } from '../icon';
import { ToggleIconButton } from '../toggle-icon-button';

const { selection } = TreeStyles();

type SelectionToggleProps = Partial<CheckboxProps> & {
  isParentVisible?: boolean;
};

export const SelectionToggle = forwardRef(
  (props: SelectionToggleProps, ref: ForwardedRef<HTMLLabelElement>) => {
    [props] = useContextProps(props, ref, CheckboxContext);
    const context = useContext(TreeContext);

    const variant =
      (isSlottedContextValue(context) ? undefined : context?.variant) ??
      TreeStylesDefaults.variant;

    const selectionType =
      (isSlottedContextValue(context) ? undefined : context?.selectionType) ??
      TreeStylesDefaults.selectionType;

    const size = variant === 'cozy' ? 'medium' : 'small';

    const {
      className,
      isSelected,
      isDisabled,
      isParentVisible = true,
      ...rest
    } = props;

    if (selectionType === 'none') {
      return null;
    }

    //TODO - checkbox and toggleIcon hate each other
    return (
      <ToggleIconButton
        aria-label={props['aria-label']}
        aria-labelledby={props['aria-labelledby']}
        variant='minimal'
        size={size}
        isDisabled={isDisabled}
        className={composeRenderProps(className, (className) =>
          selection({ className, isDisabled, isParentVisible }),
        )}
        {...rest}
      >
        {selectionType === 'visibility' ? (
          <Icon>{isSelected ? <Show /> : <Hide />}</Icon>
        ) : (
          <Icon>
            {isSelected ? <CheckboxSelected /> : <CheckboxUnselected />}
          </Icon>
        )}
      </ToggleIconButton>
    );
  },
);
