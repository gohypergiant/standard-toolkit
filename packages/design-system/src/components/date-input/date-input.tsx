import { createCalendar } from '@internationalized/date';
import {
  type ForwardedRef,
  cloneElement,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from 'react';
import { useDateField } from 'react-aria';
import {
  type ContextValue,
  DateFieldStateContext,
  Group,
  Provider,
  DateSegment as RACDateSegment,
  TimeFieldStateContext,
  useLocale,
} from 'react-aria-components';
import { useDateFieldState } from 'react-stately';
import { useContextProps, useDefaultProps } from '../../hooks';
import { callRenderProps, inlineVars, mergeClassNames } from '../../utils';
import { AriaGroupContext } from '../aria';
import type { DateFieldProps } from '../date-field';
import { DateFieldContext } from '../date-field/date-field';
import { Input } from '../input';
import {
  dateInputClassNames,
  dateInputStateVars,
  dateSegmentStateVars,
} from './date-input.css';
import type {
  DateInputProps,
  DateInputRenderProps,
  DateSegmentProps,
  DateSegmentRenderProps,
  DateSegmentsProps,
} from './types';

/*
TODO:
- context
- mapping
- size
 */
export const DateInputContext =
  createContext<ContextValue<DateInputProps, HTMLDivElement>>(null);

export const DateInput = forwardRef(function DateInput(
  props: DateInputProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  [props, ref] = useContextProps(props, ref, DateInputContext);
  props = useDefaultProps(props, 'DateInput');

  const { children } = props;

  const dateFieldState = useContext(DateFieldStateContext);
  const timeFieldState = useContext(TimeFieldStateContext);

  // TODO: wrap in a container div?
  return dateFieldState || timeFieldState ? (
    <DateInputInner {...props} ref={ref} />
  ) : (
    <DateInputStandalone {...props} ref={ref} />
  );
});

const DateInputInner = forwardRef(
  (props: DateInputProps, ref: ForwardedRef<HTMLDivElement>) => {
    const {
      children: childrenProp,
      classNames: classNamesProp,
      provider,
    } = props;
    const dateFieldState = useContext(DateFieldStateContext);
    const timeFieldState = useContext(TimeFieldStateContext);
    const state = dateFieldState ?? timeFieldState ?? null;

    // TODO: focus state

    const classNames = useMemo(
      () => mergeClassNames(dateInputClassNames, classNamesProp),
      [classNamesProp],
    );

    const style = useCallback(
      (renderProps: DateInputRenderProps) =>
        inlineVars(dateInputStateVars, renderProps),
      [],
    );

    // TODO: clone element here is really gross plus duplicative from DateSegments
    const children = useCallback(() => {
      return (
        <div className={classNames?.dateInput?.dateInput}>
          {provider
            ? callRenderProps(childrenProp, { ...state })
            : state.segments.map((segment, i) =>
                cloneElement(childrenProp(segment), { key: i }),
              )}
        </div>
      );
    }, [childrenProp, state, provider, classNames?.dateInput]);

    return (
      <>
        <Group
          ref={ref}
          {...props}
          className={classNames?.dateInput?.container}
          style={style}
        >
          {children}
        </Group>
        <Input />
      </>
    );
  },
);

// TODO: this is copy pasta from react-aria and needs work
const DateInputStandalone = forwardRef(
  (props: DateInputProps, ref: ForwardedRef<HTMLDivElement>) => {
    const [dateFieldProps, fieldRef] = useContextProps(
      { slot: props.slot } as DateFieldProps<any>,
      ref,
      DateFieldContext,
    );
    const { locale } = useLocale();
    const state = useDateFieldState({
      ...dateFieldProps,
      locale,
      createCalendar,
    });

    const inputRef = useRef<HTMLInputElement>(null);
    const { fieldProps } = useDateField(
      { ...dateFieldProps, inputRef },
      state,
      fieldRef,
    );

    return (
      <Provider
        values={[
          [DateFieldStateContext, state],
          [AriaGroupContext, { ...fieldProps, isInvalid: state.isInvalid }],
        ]}
      >
        <DateInputInner {...props} />
      </Provider>
    );
  },
);

export const DateSegments = (
  props: DateSegmentsProps,
  ref: ForwardedRef<HTMLDivElement>,
) => {
  console.log(props);
  const { children, classNames: classNamesProp } = props;

  const dateFieldState = useContext(DateFieldStateContext);
  const timeFieldState = useContext(TimeFieldStateContext);
  const state = dateFieldState ?? timeFieldState ?? null;

  const classNames = useMemo(
    () => mergeClassNames(dateInputClassNames, classNamesProp),
    [classNamesProp],
  );

  // TODO: do we really want to nest groups?
  return (
    <>
      <Group
        {...props}
        ref={ref}
        className={dateInputClassNames.segments?.container}
      >
        <div className={classNames?.segments?.segments}>
          {state.segments.map((segment, i) =>
            cloneElement(children(segment), { key: i }),
          )}
        </div>
      </Group>
      <Input />
    </>
  );
};

export const DateSegment = forwardRef(function DateSegment(
  props: DateSegmentProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const { classNames: classNamesProp, children } = props;

  const classNames = useMemo(
    () => mergeClassNames(dateInputClassNames, classNamesProp),
    [classNamesProp],
  );

  const style = useCallback(
    (renderProps: DateSegmentRenderProps) =>
      inlineVars(dateSegmentStateVars, {
        ...renderProps,
      }),
    [],
  );

  return (
    <RACDateSegment
      ref={ref}
      {...props}
      style={style}
      className={classNames?.segment?.container}
    >
      {children}
    </RACDateSegment>
  );
});
