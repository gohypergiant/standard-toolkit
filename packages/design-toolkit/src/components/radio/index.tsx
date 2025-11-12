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
import { Radio as AriaRadio, composeRenderProps } from 'react-aria-components';
import { RadioStyles } from './styles';
import type { RadioProps } from './types';

const { radio, control, label } = RadioStyles();

/**
 * Radio - A form control for exclusive selection within a group of options
 *
 * Provides accessible radio button functionality where only one option can be
 * selected at a time within a group. Includes proper labeling, keyboard navigation,
 * and visual feedback for selection states.
 *
 * @example
 * // Basic radio group
 * <RadioGroup label="Choose size">
 *   <Radio value="small">Small</Radio>
 *   <Radio value="medium">Medium</Radio>
 *   <Radio value="large">Large</Radio>
 * </RadioGroup>
 *
 * @example
 * // Radio group with default selection
 * <RadioGroup defaultValue="medium" label="Size preference">
 *   <Radio value="small">Small (S)</Radio>
 *   <Radio value="medium">Medium (M)</Radio>
 *   <Radio value="large">Large (L)</Radio>
 * </RadioGroup>
 *
 * @example
 * // Disabled radio options
 * <RadioGroup label="Shipping options">
 *   <Radio value="standard">Standard shipping</Radio>
 *   <Radio value="express">Express shipping</Radio>
 *   <Radio value="overnight" isDisabled>Overnight (unavailable)</Radio>
 * </RadioGroup>
 */
export function Radio({ classNames, children, ...rest }: RadioProps) {
  return (
    <AriaRadio
      {...rest}
      className={composeRenderProps(classNames?.radio, (className) =>
        radio({ className }),
      )}
    >
      {composeRenderProps(children, (children) => (
        <>
          <span className={control({ className: classNames?.control })} />
          <span className={label({ className: classNames?.label })}>
            {children}
          </span>
        </>
      ))}
    </AriaRadio>
  );
}
