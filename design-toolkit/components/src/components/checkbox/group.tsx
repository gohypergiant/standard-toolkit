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
import {
  CheckboxGroup as AriaCheckboxGroup,
  composeRenderProps,
  useContextProps,
} from 'react-aria-components';
import { Label } from '../label';
import { CheckboxGroupContext } from './context';
import { CheckboxStyles } from './styles';
import type { CheckboxGroupProps } from './types';

const { group, groupLabel } = CheckboxStyles();

export function CheckboxGroup({ ref, ...props }: CheckboxGroupProps) {
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
