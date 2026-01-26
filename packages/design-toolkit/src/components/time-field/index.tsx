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
import { clsx } from '@accelint/design-foundation/lib/utils';
import Time from '@accelint/icons/time';
import {
  DateInput as AriaDateInput,
  Text as AriaText,
  TimeField as AriaTimeField,
  composeRenderProps,
  DateSegment,
  FieldError,
  type TimeValue,
} from 'react-aria-components';
import { Icon } from '../icon';
import { Label } from '../label';
import styles from './styles.module.css';
import type { TimeFieldProps } from './types';

/**
 * TimeField - Form input for time values
 *
 * Provides configurable granularity, 12/24-hour format, and automatic accessibility.
 *
 * @param props - {@link TimeFieldProps}
 * @param props.classNames - Custom CSS class names for field elements.
 * @param props.description - Helper text displayed below the input.
 * @param props.errorMessage - Error message displayed when validation fails.
 * @param props.granularity - The granularity of the time value (hour, minute, second).
 * @param props.hourCycle - Whether to use 12 or 24 hour time format.
 * @param props.inputProps - Props passed to the underlying DateInput element.
 * @param props.label - Label text for the field.
 * @param props.shouldForceLeadingZeros - Whether to force leading zeros in time segments.
 * @param props.size - Size variant of the field.
 * @param props.isDisabled - Whether the field is disabled.
 * @param props.isInvalid - Whether the field is in an invalid state.
 * @param props.isRequired - Whether the field is required.
 * @param props.isReadOnly - Whether the field is read-only.
 * @returns The rendered TimeField component.
 *
 * @example
 * ```tsx
 * <TimeField label="Start time" granularity="minute" onChange={setTime} />
 * ```
 */
export function TimeField<T extends TimeValue>({
  classNames,
  description: descriptionProp,
  errorMessage: errorMessageProp,
  granularity = 'second',
  hourCycle = 24,
  inputProps,
  label: labelProp,
  shouldForceLeadingZeros = true,
  size = 'medium',
  isDisabled,
  isInvalid: isInvalidProp,
  isRequired,
  isReadOnly = false,
  ...rest
}: TimeFieldProps<T>) {
  const errorMessage = errorMessageProp || null; // Protect against empty string
  const isSmall = size === 'small';

  return (
    <AriaTimeField<T>
      {...rest}
      className={composeRenderProps(classNames?.field, (className) =>
        clsx('group/time-field', styles.field, className),
      )}
      granularity={granularity}
      hourCycle={hourCycle}
      shouldForceLeadingZeros={shouldForceLeadingZeros}
      isDisabled={isDisabled}
      isInvalid={isInvalidProp || (errorMessage ? true : undefined)} // Leave uncontrolled if possible to fallback to validation state
      isRequired={isRequired}
      isReadOnly={isReadOnly}
      aria-label={labelProp}
      data-size={size}
    >
      {(
        { isDisabled }, // Rely on internal state, not props, since state could differ from props
      ) => (
        <>
          {!isSmall && labelProp && (
            <Label
              className={clsx(styles.label, classNames?.label)}
              isDisabled={isDisabled}
              isRequired={isRequired}
            >
              {labelProp}
            </Label>
          )}
          <div
            className={clsx(styles.control, classNames?.control)}
            data-readonly={isReadOnly || null}
          >
            {!isReadOnly && size === 'medium' && (
              <Icon>
                <Time />
              </Icon>
            )}
            <AriaDateInput
              {...inputProps}
              className={composeRenderProps(classNames?.input, (className) =>
                clsx(styles.input, className),
              )}
            >
              {(segmentProp) => (
                <DateSegment
                  segment={segmentProp}
                  className={composeRenderProps(
                    classNames?.segment,
                    (className) => clsx(styles.segment, className),
                  )}
                />
              )}
            </AriaDateInput>
            <span>Z</span>
          </div>
          {descriptionProp && !(isSmall || isInvalidProp) && !errorMessage && (
            <AriaText
              slot='description'
              className={clsx(styles.description, classNames?.description)}
            >
              {descriptionProp}
            </AriaText>
          )}
          <FieldError
            className={composeRenderProps(classNames?.error, (className) =>
              clsx(styles.error, className),
            )}
          >
            {errorMessage}
          </FieldError>
        </>
      )}
    </AriaTimeField>
  );
}
