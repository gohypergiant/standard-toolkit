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

import { Hide, Show } from '@accelint/icons';
import { cva } from 'cva';
import { type ForwardedRef, forwardRef } from 'react';
import { CheckboxContext, useContextProps } from 'react-aria-components';
import { Checkbox, type CheckboxProps } from '../checkbox';
import { Icon } from '../icon';
import { ToggleIconButton } from '../toggle-icon-button';
import type { TreeSelectionType } from './index';

const selectionStyles = cva('', {
  variants: {
    isDisabled: {
      // NOTE: I wasn't a massive fan of having to specify the "not-ai-*" styles here but there was
      // no other way for the generic tailwind classnames to override due to specificity
      true: 'not-ai-selected:bg-transparent not-ai-selected:hover:bg-interactive-transparent',
      false: '',
    },
  },
});

type SelectionToggleProps = CheckboxProps & {
  selectionType: TreeSelectionType;
};

export const SelectionToggle = forwardRef(
  (props: SelectionToggleProps, ref: ForwardedRef<HTMLLabelElement>) => {
    // Merge the local props and ref with the ones provided via context.
    [props] = useContextProps(props, ref, CheckboxContext);

    const { selectionType, isSelected } = props;

    if (selectionType === 'visibility') {
      return (
        <ToggleIconButton
          aria-label={props['aria-label']}
          aria-labelledby={props['aria-labelledby']}
          size='small'
          variant={isSelected ? 'primary' : 'secondary'}
          className={selectionStyles}
          {...props}
        >
          <Icon>{isSelected ? <Show /> : <Hide />}</Icon>
        </ToggleIconButton>
      );
    }

    return <Checkbox slot='selection' />;
  },
);
