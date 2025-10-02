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
import { Fragment } from 'react';
import {
  Slider as AriaSlider,
  SliderTrack as AriaSliderTrack,
  composeRenderProps,
  Input,
  Label,
  SliderThumb,
  Text,
} from 'react-aria-components';
import { Tooltip } from '../tooltip';
import { SliderStyles } from './styles';
import type { SliderProps } from './types';

const {
  slider,
  label,
  inputs,
  input,
  thumb,
  track,
  trackBackground,
  trackValue,
  minValue,
  maxValue,
} = SliderStyles();

/**
 * Slider - An interactive range input component for numeric value selection
 *
 * Provides accessible slider functionality with optional input field integration,
 * flexible layouts, and comprehensive keyboard and mouse interaction support.
 * Perfect for settings, filters, or any numeric input requiring visual feedback.
 *
 * @example
 * // Basic slider
 * <Slider label="Volume" defaultValue={50} />
 */
export const Slider = ({
  classNames,
  label: labelProp,
  layout = 'grid',
  maxValue: maxValueProp = 100,
  minValue: minValueProp = 0,
  orientation = 'horizontal',
  showInput,
  showLabel = true,
  ...rest
}: SliderProps) => {
  return (
    <AriaSlider
      {...rest}
      className={composeRenderProps(classNames?.slider, (className) =>
        slider({ className }),
      )}
      maxValue={maxValueProp}
      minValue={minValueProp}
      orientation={orientation}
      aria-label={showLabel ? undefined : labelProp}
      data-layout={layout}
    >
      {({ state }) => (
        <>
          {showLabel && (
            <Label className={label({ className: classNames?.label })}>
              {labelProp}
            </Label>
          )}
          {showInput && (
            <div
              className={inputs({
                className: classNames?.inputs,
              })}
            >
              {state.values.map((value, index) => (
                <Input
                  key={`number-field-${index === 0 ? 'min' : 'max'}`}
                  className={composeRenderProps(
                    classNames?.input,
                    (className) => input({ className }),
                  )}
                  value={value}
                  onChange={(event) =>
                    state.setThumbValue(
                      index,
                      Number.parseFloat(event.target.value),
                    )
                  }
                />
              ))}
            </div>
          )}
          <AriaSliderTrack
            className={composeRenderProps(classNames?.track, (className) =>
              track({ className }),
            )}
          >
            <div
              className={trackBackground({
                className: classNames?.trackBackground,
              })}
            />
            {state.values.map((_, index) => (
              <Fragment key={`slider-${index === 0 ? 'min' : 'max'}`}>
                <div
                  className={trackValue({
                    className: classNames?.trackValue,
                  })}
                  data-start={
                    state.values.length === 1 ? 0 : state.getThumbPercent(0)
                  }
                  data-end={state.getThumbPercent(
                    state.values.length === 1 ? 0 : 1,
                  )}
                />
                <Tooltip
                  isDisabled={!showInput || state.isThumbDragging(index)}
                >
                  <Tooltip.Trigger>
                    <SliderThumb
                      index={index}
                      className={composeRenderProps(
                        classNames?.thumb,
                        (className) => thumb({ className }),
                      )}
                    />
                  </Tooltip.Trigger>
                  <Tooltip.Body placement='top'>
                    {state.getThumbValue(index)}
                  </Tooltip.Body>
                </Tooltip>
              </Fragment>
            ))}
          </AriaSliderTrack>
          <Text
            slot='min'
            className={minValue({ className: classNames?.minValue })}
          >
            {minValueProp}
          </Text>
          <Text
            slot='max'
            className={maxValue({ className: classNames?.maxValue })}
          >
            {maxValueProp}
          </Text>
        </>
      )}
    </AriaSlider>
  );
};
