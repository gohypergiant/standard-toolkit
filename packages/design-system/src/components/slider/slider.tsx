import {
  createContext,
  forwardRef,
  useCallback,
  useMemo,
  type ForwardedRef,
} from 'react';
import { Provider,
  Slider as RACSlider,
  LabelContext,
  type ContextValue,
  type TextProps,
} from 'react-aria-components';
import {
  type AriaLabelContext,
  AriaTextContext,
} from '../../components';
import {
  useContextProps,
  useDefaultProps,
  useTheme,
} from '../../hooks';
import type { SliderProps, SliderRenderProps } from './types';
import { callRenderProps, inlineVars, mergeClassNames } from '../../utils';
import { sliderClassNames, sliderStateVars } from './slider.css';

export const SliderContext = createContext<ContextValue<SliderProps, HTMLDivElement>>(null);

export const Slider = forwardRef(function Slider(
  props: SliderProps,
  ref: ForwardedRef<HTMLDivElement>
) {
  [props, ref] = useContextProps(props, ref, SliderContext);

  props = useDefaultProps(props, 'Slider');

  const {
    children: childrenProp,
    classNames: classNamesProp,
    alignLabel = 'top',
    ...rest
  } = props;

  const theme = useTheme();

  const classNames = useMemo(
    () => mergeClassNames(sliderClassNames, theme.Slider, classNamesProp),
    [theme.Slider, classNamesProp]
  );

  const style = useCallback(
    ({...renderProps}: SliderRenderProps) => inlineVars(sliderStateVars, {
      ...renderProps,
      alignLabel,
    }),
    [alignLabel]
  );

  const values = useMemo<[
    [typeof SliderContext, ContextValue<SliderProps, HTMLLabelElement>],
    [typeof AriaLabelContext, ContextValue<TextProps, HTMLElement>],
    [typeof AriaTextContext, ContextValue<TextProps, HTMLElement>],
  ]>(() => [
    [SliderContext, { classNames, alignLabel}],
        [LabelContext, { className: classNames?.slider?.label }],
    [AriaTextContext, { className: classNames?.slider?.label}],
  ], [classNames?.slider?.label]);

  const children = useCallback((renderProps: SliderRenderProps) => (
    <Provider values={values}>
      <div className={classNames?.slider?.container}>
        {callRenderProps(childrenProp, {
          ...renderProps,
          defaultChildren: null,
        })}
      </div>
    </Provider>
  ), [childrenProp, classNames?.slider, values]);


  return (
    <RACSlider
      {...rest}
      ref={ref}
      className={classNames?.slider?.container}
      style={style}
    >
      {children}
    </RACSlider>
  )
});