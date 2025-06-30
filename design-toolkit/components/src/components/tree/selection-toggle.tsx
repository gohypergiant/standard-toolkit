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

import {
  CheckboxSelected,
  CheckboxUnselected,
  Hide,
  Show,
} from '@accelint/icons';
import { cva } from 'cva';
import { type ForwardedRef, forwardRef } from 'react';
import { CheckboxContext, useContextProps } from 'react-aria-components';
import { cn } from '../../lib/utils';
import { Checkbox, type CheckboxProps } from '../checkbox';
import { Icon } from '../icon';
import { ToggleIconButton } from '../toggle-icon-button';
import type { TreeSelectionType } from './types';

const selectionStyles = cva(
  'ai-selected:fg-default-light ai-selected:hover:bg-transparent',
  {
    variants: {
      isDisabled: {
        true: 'not-ai-selected:bg-transparent not-ai-selected:hover:bg-interactive-transparent',
      },
      isParentVisible: {
        false:
          'fg-default-dark not-ai-selected:bg-transparent not-ai-selected:hover:bg-interactive-transparent',
      },
    },
  },
);

type SelectionToggleProps = Partial<CheckboxProps> & {
  selectionType: TreeSelectionType;
  size: 'small' | 'medium';
  isParentVisible?: boolean;
};

export const SelectionToggle = forwardRef(
  (props: SelectionToggleProps, ref: ForwardedRef<HTMLLabelElement>) => {
    [props] = useContextProps(props, ref, CheckboxContext);

    const {
      selectionType,
      isSelected,
      isDisabled,
      isParentVisible = true,
      ...rest
    } = props;

    if (selectionType === 'none') {
      return null;
    }

    return (
      <ToggleIconButton
        aria-label={props['aria-label']}
        aria-labelledby={props['aria-labelledby']}
        variant='minimal'
        isDisabled={isDisabled}
        className={selectionStyles({ isDisabled, isParentVisible })}
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
