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

import {
  type FC,
  type ForwardedRef,
  Fragment,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import {
  type ContextValue,
  DateFieldStateContext,
  Group,
  DateSegment as RACDateSegment,
  type SlotProps,
  TimeFieldStateContext,
} from 'react-aria-components';
import { useContextProps } from '../../hooks/use-context-props';
import { useDefaultProps } from '../../hooks/use-defaults';
import { useTheme } from '../../hooks/use-theme';
import { inputs } from '../../styles/typography.css';
import { inlineVars } from '../../utils/css';
import { callRenderProps, mergeClassNames } from '../../utils/props';
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

const defaultMapping = {
  icon: {
    sm: { size: 'xs' },
    lg: { size: 'md' },
  },
  input: {
    sm: inputs.sm,
    lg: inputs.lg,
  },
};

const defaultSize = 'lg';

export const DateInputContext =
  createContext<ContextValue<DateInputProps, HTMLDivElement>>(null);

export const DateInput = forwardRef(function DateInput(
  props: DateInputProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  [props, ref] = useContextProps(props, ref, DateInputContext);
  props = useDefaultProps(props, 'DateInput');

  const {
    children: childrenProp,
    classNames: classNamesProp,
    mapping: mappingProp,
    size = defaultSize,
    provider,
    ...rest
  } = props;

  const dateFieldState = useContext(DateFieldStateContext);
  const timeFieldState = useContext(TimeFieldStateContext);
  const state = dateFieldState ?? timeFieldState ?? null;

  const theme = useTheme();

  const mapping = useMemo(
    () => ({
      ...defaultMapping,
      ...mappingProp,
    }),
    [mappingProp],
  );

  const classNames = useMemo(
    () =>
      mergeClassNames(dateInputClassNames, theme.DateInput, classNamesProp, {
        input: { input: mapping.input[size] },
      }),
    [theme.DateInput, classNamesProp, mapping, size],
  );

  const style = useCallback(
    (renderProps: DateInputRenderProps) =>
      inlineVars(dateInputStateVars, { ...renderProps, size }),
    [size],
  );

  const children = useCallback(
    (renderProps: DateInputRenderProps) => (
      <div className={classNames?.input?.input}>
        {childrenProp &&
          (provider ? (
            callRenderProps(childrenProp, { ...renderProps, ...state })
          ) : (
            <>
              {state.segments.map((segment) => (
                <Fragment key={segment.type}>{childrenProp(segment)}</Fragment>
              ))}
            </>
          ))}
      </div>
    ),
    [childrenProp, state, provider, classNames?.input],
  );

  return (
    <>
      <Group
        ref={ref}
        {...rest}
        className={classNames?.input?.container}
        style={style}
      >
        {children}
      </Group>
      <Input />
    </>
  );
});

export const DateSegments = forwardRef(
  (props: DateSegmentsProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { children, classNames: classNamesProp } = props;

    const dateFieldState = useContext(DateFieldStateContext);
    const timeFieldState = useContext(TimeFieldStateContext);
    const state = dateFieldState ?? timeFieldState ?? null;

    const theme = useTheme();

    const classNames = useMemo(
      () =>
        mergeClassNames(dateInputClassNames, theme.DateInput, classNamesProp),
      [theme.DateInput, classNamesProp],
    );

    return (
      <div className={classNames?.input?.segments} ref={ref}>
        {state.segments.map((segment) => (
          <Fragment key={segment.type}>{children(segment)}</Fragment>
        ))}
      </div>
    );
  },
);

export const DateSegmentContext =
  createContext<ContextValue<SlotProps, HTMLDivElement>>(null);

export const DateSegment: FC<DateSegmentProps> = forwardRef(
  function DateSegment(
    props: DateSegmentProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) {
    [props, ref] = useContextProps(props, ref, DateSegmentContext);

    const {
      classNames: classNamesProp,
      children: childrenProp,
      ...rest
    } = props;

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

    const children = useCallback(
      (renderProps: DateSegmentRenderProps) => {
        const { isPlaceholder, placeholder, text, value } = renderProps;
        if (typeof childrenProp === 'function') {
          return childrenProp({ ...renderProps, defaultChildren: null });
        }

        if (isPlaceholder) {
          return placeholder;
        }

        return (
          <div className={classNames?.segment?.segment}>{value ?? text}</div>
        );
      },
      [childrenProp, classNames],
    );

    return (
      <RACDateSegment
        ref={ref}
        {...rest}
        style={style}
        className={classNames?.segment?.container}
      >
        {children}
      </RACDateSegment>
    );
  },
);
