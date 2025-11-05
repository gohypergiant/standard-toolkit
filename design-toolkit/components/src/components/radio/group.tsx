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
  RadioGroup as AriaRadioGroup,
  composeRenderProps,
  useContextProps,
} from 'react-aria-components';
import { Label } from '../label';
import { RadioContext } from './context';
import { RadioStyles } from './styles';
import type { RadioGroupProps } from './types';

const { group, groupLabel } = RadioStyles();

/**
 * RadioGroup - Container component for Radio buttons
 *
 * Groups related Radio components and manages their selection state.
 * Only one Radio can be selected at a time within a RadioGroup.
 */
export function RadioGroup({ ref, ...props }: RadioGroupProps) {
  [props, ref] = useContextProps(props, ref ?? null, RadioContext);

  const { children, classNames, label, ...rest } = props;

  return (
    <AriaRadioGroup
      {...rest}
      ref={ref}
      className={composeRenderProps(classNames?.group, (className) =>
        group({ className }),
      )}
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
    </AriaRadioGroup>
  );
}
