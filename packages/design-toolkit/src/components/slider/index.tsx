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
import { TooltipTrigger } from '../tooltip/trigger';
import styles from './styles.module.css';
import type { SliderProps } from './types';

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
export function Slider({
  classNames,
  label: labelProp,
  layout = 'grid',
  maxValue: maxValueProp = 100,
  minValue: minValueProp = 0,
  orientation = 'horizontal',
  showInput,
  showLabel = true,
  ...rest
}: SliderProps) {
  return (
    <AriaSlider
      {...rest}
      className={composeRenderProps(classNames?.slider, (className) =>
        clsx('group/slider', styles.slider, className),
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
            <Label className={clsx(styles.label, classNames?.label)}>
              {labelProp}
            </Label>
          )}
          {showInput && (
            <div className={clsx(styles.inputs, classNames?.inputs)}>
              {state.values.map((value, index) => (
                <Input
                  key={`number-field-${index === 0 ? 'min' : 'max'}`}
                  className={composeRenderProps(
                    classNames?.input,
                    (className) => clsx(styles.input, className),
                  )}
                  value={value}
                  disabled={state.isDisabled}
                  data-disabled={state.isDisabled || undefined}
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
              clsx(styles.track, className),
            )}
          >
            <div
              className={clsx(
                styles.trackBackground,
                classNames?.trackBackground,
              )}
            />
            {state.values.map((_, index) => (
              <Fragment key={`slider-${index === 0 ? 'min' : 'max'}`}>
                <div
                  className={clsx(styles.trackValue, classNames?.trackValue)}
                  data-start={
                    state.values.length === 1 ? 0 : state.getThumbPercent(0)
                  }
                  data-end={state.getThumbPercent(
                    state.values.length === 1 ? 0 : 1,
                  )}
                />
                <TooltipTrigger
                  isDisabled={!showInput || state.isThumbDragging(index)}
                >
                  <SliderThumb
                    index={index}
                    className={composeRenderProps(
                      classNames?.thumb,
                      (className) => clsx(styles.thumb, className),
                    )}
                  />
                  <Tooltip placement='top'>
                    {state.getThumbValue(index)}
                  </Tooltip>
                </TooltipTrigger>
              </Fragment>
            ))}
          </AriaSliderTrack>
          <Text
            slot='min'
            className={clsx(styles.minValue, classNames?.minValue)}
          >
            {minValueProp}
          </Text>
          <Text
            slot='max'
            className={clsx(styles.maxValue, classNames?.maxValue)}
          >
            {maxValueProp}
          </Text>
        </>
      )}
    </AriaSlider>
  );
}
