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
import { Time } from '@accelint/icons';
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
import { TimeFieldStyles } from './styles';
import type { TimeFieldProps } from './types';

const { field, label, control, input, description, error, segment } =
  TimeFieldStyles();

export function TimeField<T extends TimeValue>({
  classNames,
  description: descriptionProp,
  errorMessage: errorMessageProp,
  inputProps,
  label: labelProp,
  size = 'medium',
  isDisabled,
  isInvalid: isInvalidProp,
  isRequired,
  hideTimeZone = false,
  granularity = 'second',
  ...rest
}: TimeFieldProps<T>) {
  const errorMessage = errorMessageProp || null; // Protect against empty string
  const isSmall = size === 'small';

  return (
    <AriaTimeField<T>
      {...rest}
      isDisabled={isDisabled}
      isInvalid={isInvalidProp || (errorMessage ? true : undefined)} // Leave uncontrolled if possible to fallback to validation state
      isRequired={isRequired}
      aria-label={labelProp}
      data-size={size}
      hideTimeZone={hideTimeZone}
      granularity={granularity}
      hourCycle={24}
      className={composeRenderProps(classNames?.field, (className) =>
        field({ className }),
      )}
    >
      {(
        { isDisabled }, // Rely on internal state, not props, since state could differ from props
      ) => (
        <>
          {!isSmall && label && (
            <Label
              className={label({ className: classNames?.label })}
              isDisabled={isDisabled}
              isRequired={isRequired}
            >
              {labelProp}
            </Label>
          )}
          <div className={control({ className: classNames?.control })}>
            {size === 'medium' && (
              <Icon>
                <Time />
              </Icon>
            )}
            <AriaDateInput
              {...inputProps}
              className={composeRenderProps(classNames?.input, (className) =>
                input({
                  className,
                }),
              )}
            >
              {(segmentProp) => {
                return (
                  <DateSegment
                    segment={segmentProp}
                    className={composeRenderProps(
                      classNames?.segment,
                      (className) => segment({ className }),
                    )}
                  />
                );
              }}
            </AriaDateInput>
            <span>Z</span>
          </div>
          {descriptionProp && !(isSmall || isInvalidProp) && !errorMessage && (
            <AriaText
              className={description({
                className: classNames?.description,
              })}
              slot='description'
            >
              {descriptionProp}
            </AriaText>
          )}
          <FieldError
            className={composeRenderProps(classNames?.error, (className) =>
              error({ className }),
            )}
          >
            {errorMessage}
          </FieldError>
        </>
      )}
    </AriaTimeField>
  );
}
