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

import { clsx } from 'clsx';
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  type ForwardedRef,
} from 'react';
import {
  Provider,
  Slider as RACSlider,
  SliderOutput as RACSliderOutput,
  SliderThumb as RACSliderThumb,
  SliderTrack as RACSliderTrack,
  LabelContext,
  type ContextValue,
  type LabelProps,
  type TextProps,
  DEFAULT_SLOT,
  SliderStateContext,
} from 'react-aria-components';
import {
  AriaLabelContext,
  AriaTextContext,
  GroupContext,
  InputContext,
  type GroupProps,
  type InputProps,
} from '../../components';
import { useContextProps, useDefaultProps, useTheme } from '../../hooks';
import type {
  SliderProps,
  SliderRenderProps,
  SliderThumbProps,
  SliderThumbRenderProps,
  SliderTrackProps,
  SliderTrackRenderProps,
  SliderOutputProps,
  SliderBarProps,
} from './types';
import { callRenderProps, inlineVars, mergeClassNames } from '../../utils';
import {
  sliderClassNames,
  sliderThumbStateVars,
  sliderTrackStateVars,
  sliderStateVars,
} from './slider.css';

export const SliderBarContext =
  createContext<ContextValue<SliderBarProps, HTMLDivElement>>(null);

/**
 * SliderBar is optional, but must be used as a child of SliderTrack
 */
export const SliderBar = forwardRef(function SliderBar(
  props: SliderBarProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  [props, ref] = useContextProps(props, ref, SliderBarContext);

  props = useDefaultProps(props, 'SliderBar');

  const { classNames: classNamesProp, ...rest } = props;

  const theme = useTheme();

  const classNames = useMemo(
    () => mergeClassNames(sliderClassNames, theme.Slider, classNamesProp),
    [theme.Slider, classNamesProp],
  );

  const state = useContext(SliderStateContext);

  return (
    <div
      {...rest}
      ref={ref}
      className={classNames?.track?.bar}
      style={{
        position: 'absolute',
        ...(state.orientation === 'horizontal' && {
          left: state.getThumbValue(1) ? `${state.getThumbValue(0)}%` : 0,
          width: state.getThumbValue(1)
            ? `${(state.getThumbValue(1) || 0) - (state.getThumbValue(0) || 0)}%`
            : `${state.getThumbValue(0)}%`,
        }),
        ...(state.orientation === 'vertical' && {
          bottom: state.getThumbValue(1) ? `${state.getThumbValue(0)}%` : 0,
          height: state.getThumbValue(1)
            ? `${(state.getThumbValue(1) || 0) - (state.getThumbValue(0) || 0)}%`
            : `${state.getThumbValue(0)}%`,
        }),
      }}
    />
  );
});

export const SliderOutputContext =
  createContext<ContextValue<SliderOutputProps, HTMLOutputElement>>(null);

export const SliderOutput = forwardRef(function SliderOutput(
  props: SliderOutputProps,
  ref: ForwardedRef<HTMLOutputElement>,
) {
  [props, ref] = useContextProps(props, ref, SliderOutputContext);

  props = useDefaultProps(props, 'SliderOutput');

  const { children: childrenProp, classNames: classNamesProp, ...rest } = props;

  const theme = useTheme();

  const classNames = useMemo(
    () => mergeClassNames(sliderClassNames, theme.Slider, classNamesProp),
    [theme.Slider, classNamesProp],
  );

  const style = useCallback(
    (renderProps: SliderRenderProps) =>
      inlineVars(sliderStateVars, renderProps),
    [],
  );

  const children = useCallback(
    (renderProps: SliderRenderProps) => (
      <div className={classNames?.output?.output}>
        {callRenderProps(childrenProp, {
          ...renderProps,
          defaultChildren: null,
        })}
      </div>
    ),
    [childrenProp, classNames?.output?.output],
  );

  return (
    <RACSliderOutput
      {...rest}
      ref={ref}
      className={classNames?.output?.container}
      style={style}
    >
      {children}
    </RACSliderOutput>
  );
});

export const SliderTrackContext =
  createContext<ContextValue<SliderTrackProps, HTMLDivElement>>(null);

/**
 * SliderTrack must be used as a child of Slider, a parent of SliderThumb,
 * and if used, a parent of SliderBar
 */
export const SliderTrack = forwardRef(function SliderTrack(
  props: SliderTrackProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  [props, ref] = useContextProps(props, ref, SliderTrackContext);

  props = useDefaultProps(props, 'SliderTrack');

  const { children: childrenProp, classNames: classNamesProp, ...rest } = props;

  const theme = useTheme();

  const classNames = useMemo(
    () => mergeClassNames(sliderClassNames, theme.Slider, classNamesProp),
    [theme.Slider, classNamesProp],
  );

  const style = useCallback(
    (renderProps: SliderTrackRenderProps) =>
      inlineVars(sliderTrackStateVars, renderProps),
    [],
  );

  const values = useMemo<
    [
      [
        typeof SliderThumbContext,
        ContextValue<SliderThumbProps, HTMLDivElement>,
      ],
      [typeof SliderBarContext, ContextValue<SliderBarProps, HTMLDivElement>],
    ]
  >(
    () => [
      [SliderThumbContext, { classNames }],
      [SliderBarContext, { classNames }],
    ],
    [classNames],
  );

  const children = useCallback(
    (renderProps: SliderTrackRenderProps) => (
      <Provider values={values}>
        <div className={classNames?.track?.track}>
          {callRenderProps(childrenProp, {
            ...renderProps,
            defaultChildren: null,
          })}
        </div>
      </Provider>
    ),
    [childrenProp, values, classNames?.track?.track],
  );

  return (
    <RACSliderTrack
      {...rest}
      ref={ref}
      className={classNames?.track?.container}
      style={style}
    >
      {children}
    </RACSliderTrack>
  );
});

export const SliderThumbContext =
  createContext<ContextValue<SliderThumbProps, HTMLDivElement>>(null);

/**
 * SliderThumb must be used as a child of SliderTrack
 */
export const SliderThumb = forwardRef(function SliderThumb(
  props: SliderThumbProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  [props, ref] = useContextProps(props, ref, SliderThumbContext);

  props = useDefaultProps(props, 'SliderThumb');

  const { children: childrenProp, classNames: classNamesProp, ...rest } = props;

  const theme = useTheme();

  const classNames = useMemo(
    () => mergeClassNames(sliderClassNames, theme.Slider, classNamesProp),
    [theme.Slider, classNamesProp],
  );

  const style = useCallback(
    (renderProps: SliderThumbRenderProps) =>
      inlineVars(sliderThumbStateVars, renderProps),
    [],
  );

  const values = useMemo<
    [[typeof AriaLabelContext, ContextValue<LabelProps, HTMLLabelElement>]]
  >(() => [[AriaLabelContext, {}]], []);

  const children = useCallback(
    (renderProps: SliderThumbRenderProps) => (
      <Provider values={values}>
        <div className={classNames?.thumb?.thumb}>
          {callRenderProps(childrenProp, {
            ...renderProps,
            defaultChildren: null,
          })}
        </div>
      </Provider>
    ),
    [childrenProp, values, classNames?.thumb?.thumb],
  );

  return (
    <RACSliderThumb
      {...rest}
      ref={ref}
      className={classNames?.thumb?.container}
      style={style}
    >
      {children}
    </RACSliderThumb>
  );
});

export const SliderContext =
  createContext<ContextValue<SliderProps, HTMLDivElement>>(null);

export const Slider = forwardRef(function Slider(
  props: SliderProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  [props, ref] = useContextProps(props, ref, SliderContext);

  props = useDefaultProps(props, 'Slider');

  const {
    children: childrenProp,
    classNames: classNamesProp,
    alignLabel = 'stacked',
    minValue,
    maxValue,
    orientation = 'horizontal',
    ...rest
  } = props;

  const theme = useTheme();

  const classNames = useMemo(
    () => mergeClassNames(sliderClassNames, theme.Slider, classNamesProp),
    [theme.Slider, classNamesProp],
  );

  const style = useCallback(
    ({ ...renderProps }: SliderRenderProps) =>
      inlineVars(sliderStateVars, {
        ...renderProps,
        alignLabel,
      }),
    [alignLabel],
  );

  const values = useMemo<
    [
      [typeof AriaLabelContext, ContextValue<LabelProps, HTMLLabelElement>],
      [typeof AriaTextContext, ContextValue<TextProps, HTMLElement>],
      [typeof InputContext, ContextValue<InputProps, HTMLInputElement>],
      [
        typeof SliderOutputContext,
        ContextValue<SliderOutputProps, HTMLOutputElement>,
      ],
      [
        typeof SliderTrackContext,
        ContextValue<SliderTrackProps, HTMLDivElement>,
      ],
      [
        typeof GroupContext,
        ContextValue<GroupProps<InputProps, HTMLInputElement>, HTMLDivElement>,
      ],
    ]
  >(
    () => [
      [LabelContext, { className: classNames?.slider?.label }],
      [
        AriaTextContext,
        {
          slots: {
            [DEFAULT_SLOT]: {},
            min: {
              className: clsx(
                classNames?.slider?.tick,
                classNames?.slider?.min,
              ),
            },
            max: {
              className: clsx(
                classNames?.slider?.tick,
                classNames?.slider?.max,
              ),
            },
          },
        },
      ],
      [InputContext, { classNames: classNames?.input }],
      [SliderOutputContext, { classNames }],
      [SliderTrackContext, { classNames }],
      [
        GroupContext,
        {
          classNames: classNames?.group,
          orientation,
          reverse: orientation === 'vertical',
        },
      ],
    ],
    [classNames, orientation],
  );

  const children = useCallback(
    (renderProps: SliderRenderProps) => (
      <Provider values={values}>
        <div className={classNames?.slider?.slider}>
          {callRenderProps(childrenProp, renderProps)}
        </div>
      </Provider>
    ),
    [childrenProp, classNames?.slider, values],
  );

  return (
    <RACSlider
      {...rest}
      ref={ref}
      className={classNames?.slider?.container}
      orientation={orientation}
      style={style}
    >
      {children}
    </RACSlider>
  );
});