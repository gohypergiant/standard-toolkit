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
  SliderOutputProps,
} from './types';
import { callRenderProps, inlineVars, mergeClassNames } from '../../utils';
import {
  sliderClassNames,
  sliderThumbStateVars,
  sliderTrackStateVars,
  sliderStateVars,
} from './slider.css';

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
    (renderProps: SliderOutputProps) =>
      inlineVars(sliderStateVars, renderProps),
    [],
  );

  const values = useMemo<
    [
      [
        typeof SliderOutputContext,
        ContextValue<SliderOutputProps, HTMLDivElement>,
      ],
    ]
  >(() => [[SliderOutputContext, { classNames }]], [classNames]);

  const children = useCallback(
    (renderProps: SliderOutputProps) => (
      <Provider values={values}>
        {callRenderProps(childrenProp, renderProps)}
      </Provider>
    ),
    [childrenProp, values],
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
      [InputContext, { className: classNames?.input?.container, size: 'sm' }],
    ],
    [classNames?.input?.container],
  );

  const children = useCallback(
    (renderProps: SliderRenderProps) => (
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
      className={classNames?.input?.container}
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
      inlineVars(sliderTrackStateVars, renderProps),
    [],
  );

  const values = useMemo<
    [
      [
        typeof SliderThumbContext,
        ContextValue<SliderThumbProps, HTMLDivElement>,
      ],
    ]
  >(() => [[SliderThumbContext, { classNames }]], [classNames]);

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
      className={classNames?.track?.container}
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
    (renderProps: SliderThumbRenderProps) =>
      inlineVars(sliderThumbStateVars, renderProps),
    [],
  );

  const values = useMemo<
    [
      [
        typeof SliderThumbContext,
        ContextValue<SliderThumbProps, HTMLDivElement>,
      ],
    ]
  >(() => [[SliderThumbContext, { classNames }]], [classNames]);

  const children = useCallback(
    (renderProps: SliderThumbRenderProps) => (
      <Provider values={values}>
        {callRenderProps(childrenProp, {
          ...renderProps,
          orientation: 'horizontal',
        })}
      </Provider>
    ),
    [childrenProp, values],
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
    alignLabel = 'top',
    minValue = 0,
    maxValue = 100,
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
      [
        typeof SliderInputContext,
        ContextValue<SliderInputProps, HTMLInputElement>,
      ],
      [
        typeof SliderTrackContext,
        ContextValue<SliderTrackProps, HTMLDivElement>,
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
            min: { className: classNames?.slider?.min },
            max: { className: classNames?.slider?.max },
          },
        },
      ],
      [SliderInputContext, { className: classNames?.input?.container }],
      [SliderTrackContext, { className: classNames?.track?.container }],
    ],
    [classNames],
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
