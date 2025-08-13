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
import { Check, Remove } from '@accelint/icons';
import { createContext } from 'react';
import {
  Checkbox as AriaCheckbox,
  CheckboxGroup as AriaCheckboxGroup,
  type ContextValue,
  composeRenderProps,
  useContextProps,
} from 'react-aria-components';
import { Icon } from '../icon';
import { Label } from '../label';
import { CheckboxStyles } from './styles';
import type { CheckboxGroupProps, CheckboxProps } from './types';

const { group, groupLabel, checkbox, control, label } = CheckboxStyles();

export const CheckboxGroupContext =
  createContext<ContextValue<CheckboxGroupProps, HTMLDivElement>>(null);

function CheckboxGroup({ ref, ...props }: CheckboxGroupProps) {
  [props, ref] = useContextProps(props, ref ?? null, CheckboxGroupContext);

  const {
    children,
    classNames,
    label,
    orientation = 'vertical',
    ...rest
  } = props;

  return (
    <AriaCheckboxGroup
      {...rest}
      ref={ref}
      className={composeRenderProps(classNames?.group, (className) =>
        group({ className }),
      )}
      data-orientation={orientation}
    >
      {composeRenderProps(children, (children, { isDisabled, isRequired }) => (
        <>
          {label && (
            <Label
              className={groupLabel({ className: classNames?.label })}
              isDisabled={isDisabled}
              isRequired={isRequired}
            >
              {label}
            </Label>
          )}
          {children}
        </>
      ))}
    </AriaCheckboxGroup>
  );
}
CheckboxGroup.displayName = 'Checkbox.Group';

export const CheckboxContext =
  createContext<ContextValue<CheckboxProps, HTMLLabelElement>>(null);

/**
 * Checkbox - A form control for binary or multiple selection with group support
 *
 * Provides accessible checkbox functionality with support for individual checkboxes
 * or grouped selections. Includes visual feedback for checked, indeterminate, and
 * disabled states with integrated labeling and validation support.
 *
 * @example
 * // Basic checkbox
 * <Checkbox>
 *   Accept terms and conditions
 * </Checkbox>
 *
 * @example
 * // Checkbox group with multiple options
 * <Checkbox.Group label="Select preferences">
 *   <Checkbox value="notifications">Email notifications</Checkbox>
 *   <Checkbox value="marketing">Marketing emails</Checkbox>
 *   <Checkbox value="updates">Product updates</Checkbox>
 * </Checkbox.Group>
 *
 * @example
 * // Disabled checkbox
 * <Checkbox isDisabled>
 *   Unavailable option
 * </Checkbox>
 *
 * @example
 * // Indeterminate checkbox (partial selection)
 * <Checkbox isIndeterminate>
 *   Select all items
 * </Checkbox>
 */
export function Checkbox({ ref, ...props }: CheckboxProps) {
  [props, ref] = useContextProps(props, ref ?? null, CheckboxContext);

  const { classNames, children, ...rest } = props;

  return (
    <AriaCheckbox
      {...rest}
      ref={ref}
      className={composeRenderProps(classNames?.checkbox, (className) =>
        checkbox({ className }),
      )}
    >
      {composeRenderProps(
        children,
        (children, { isIndeterminate, isSelected }) => (
          <>
            <span className={control({ className: classNames?.control })}>
              <Icon size='small'>
                {isIndeterminate && !isSelected && <Remove />}
                {isSelected && <Check />}
              </Icon>
            </span>
            {children && (
              <span className={label({ className: classNames?.label })}>
                {children}
              </span>
            )}
          </>
        ),
      )}
    </AriaCheckbox>
  );
}
Checkbox.displayName = 'Checkbox';
Checkbox.Group = CheckboxGroup;
