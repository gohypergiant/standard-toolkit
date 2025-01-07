import {
  createContext,
  forwardRef,
  useCallback,
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
} from 'react-aria-components';
import {
  AriaTextContext,
  InputContext,
  type AriaLabelContext,
  type InputProps,
  type InputRenderProps,
} from '../../components';
import { useContextProps, useDefaultProps, useTheme } from '../../hooks';
import type {
  SliderProps,
  SliderRenderProps,
  SliderThumbProps,
  SliderThumbRenderProps,
  SliderTrackProps,
  SliderTrackRenderProps,
  SliderInputProps,
  SliderBarProps,
} from './types';
import { callRenderProps, inlineVars, mergeClassNames } from '../../utils';
import { sliderClassNames, sliderStateVars } from './slider.css';

/**
 * SliderBar must be used as a child of SliderTrack
 */

export const SliderBarContext =
  createContext<ContextValue<SliderBarProps, HTMLDivElement>>(null);

export const SliderBar = forwardRef(function SliderBar(
  props: SliderBarProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  [props, ref] = useContextProps(props, ref, SliderBarContext);

  props = useDefaultProps(props, 'SliderBar');

  const { classNames: classNamesProp } = props;

  const theme = useTheme();

  const classNames = useMemo(
    () => mergeClassNames(sliderClassNames, theme.Slider, classNamesProp),
    [theme.Slider, classNamesProp],
  );

  return (
    <div
      ref={ref}
      className={classNames?.slider?.bar}
      style={{
        position: 'absolute',
        left: props.maxValue ? `${props.minValue}%` : 0,
        width: props.maxValue
          ? `${(props.maxValue || 0) - (props.minValue || 0)}%`
          : `${props.minValue}%`,
      }}
    />
  );
});

/**
 * SliderInput must be used as a child of Slider
 */

export const SliderInputContext =
  createContext<ContextValue<SliderInputProps, HTMLInputElement>>(null);

export const SliderInput = forwardRef(function SliderInput(
  props: SliderInputProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  [props, ref] = useContextProps(props, ref, SliderInputContext);

  props = useDefaultProps(props, 'SliderInput');

  const { children: childrenProp, classNames: classNamesProp, ...rest } = props;

  const theme = useTheme();

  const classNames = useMemo(
    () => mergeClassNames(sliderClassNames, theme.Slider, classNamesProp),
    [theme.Slider, classNamesProp],
  );

  const style = useCallback(
    (renderProps: SliderInputProps) => inlineVars(sliderStateVars, renderProps),
    [],
  );

  const values = useMemo<
    [[typeof InputContext, ContextValue<InputProps, HTMLInputElement>]]
  >(
    () => [
      [InputContext, { className: classNames?.slider?.input, size: 'sm' }],
    ],
    [classNames?.slider?.input],
  );

  const children = useCallback(
    (renderProps: InputRenderProps) => (
      <Provider values={values}>
        {callRenderProps(childrenProp, renderProps)}
      </Provider>
    ),
    [values, childrenProp],
  );

  return (
    <RACSliderOutput
      {...rest}
      ref={ref}
      className={classNames?.slider?.input}
      style={style}
    >
      {children}
    </RACSliderOutput>
  );
});

/**
 * SliderTrack must be used as a child of Slider,
 * a parent of SliderThumb and, if used, a parent of SliderBar
 */

export const SliderTrackContext =
  createContext<ContextValue<SliderTrackProps, HTMLDivElement>>(null);

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
      inlineVars(sliderStateVars, renderProps),
    [],
  );

  const values = useMemo<
    [
      [typeof SliderContext, ContextValue<SliderProps, HTMLDivElement>],
      [
        typeof SliderTrackContext,
        ContextValue<SliderTrackProps, HTMLDivElement>,
      ],
    ]
  >(
    () => [
      [SliderContext, { classNames }],
      [SliderTrackContext, { classNames }],
    ],
    [classNames],
  );

  const children = useCallback(
    (renderProps: SliderTrackRenderProps) => (
      <Provider values={values}>
        {callRenderProps(childrenProp, renderProps)}
      </Provider>
    ),
    [childrenProp, values],
  );

  return (
    <RACSliderTrack
      {...rest}
      ref={ref}
      className={classNames?.slider?.track}
      style={(state) => style(state)}
    >
      {children}
    </RACSliderTrack>
  );
});

/**
 * SliderThumb must be used as a child of SliderTrack
 */

export const SliderThumbContext =
  createContext<ContextValue<SliderThumbProps, HTMLDivElement>>(null);

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
    ({ ...renderProps }: SliderThumbRenderProps) =>
      inlineVars(sliderStateVars, renderProps),
    [],
  );

  const values = useMemo<
    [
      [typeof SliderContext, ContextValue<SliderProps, HTMLDivElement>],
      [
        typeof SliderThumbContext,
        ContextValue<SliderThumbProps, HTMLDivElement>,
      ],
    ]
  >(
    () => [
      [SliderContext, { classNames }],
      [SliderThumbContext, { classNames }],
    ],
    [classNames],
  );

  const children = useCallback(
    (renderProps: SliderThumbRenderProps) => (
      <Provider values={values}>
        {callRenderProps(childrenProp, {
          ...renderProps,
          defaultChildren: null,
        })}
      </Provider>
    ),
    [childrenProp, values],
  );

  return (
    <RACSliderThumb
      {...rest}
      ref={ref}
      className={classNames?.slider?.thumb}
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
    alignLabel = 'top',
    min = 0,
    max = 100,
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
      [typeof SliderContext, ContextValue<SliderProps, HTMLDivElement>],
      [typeof AriaLabelContext, ContextValue<LabelProps, HTMLLabelElement>],
      [typeof AriaTextContext, ContextValue<TextProps, HTMLElement>],
    ]
  >(
    () => [
      [SliderContext, { classNames, alignLabel }],
      [LabelContext, { className: classNames?.slider?.label }],
      [
        AriaTextContext,
        {
          slots: {
            [DEFAULT_SLOT]: {},
            min: { className: classNames?.slider?.min },
            max: { className: classNames?.slider?.max },
          },
        },
      ],
    ],
    [classNames?.slider?.label, classNames, alignLabel],
  );

  const children = useCallback(
    (renderProps: SliderRenderProps) => (
      <Provider values={values}>
        <div className={classNames?.slider?.container}>
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
      style={style}
    >
      {children}
    </RACSlider>
  );
});
