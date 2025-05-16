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
  type ForwardedRef,
  createContext,
  forwardRef,
  useCallback,
  useMemo,
} from 'react';
import {
  type ContextValue,
  Provider,
  type GroupProps as RACGroupProps,
  SearchField as RACSearchField,
  type SearchFieldRenderProps,
} from 'react-aria-components';
import { useContextProps } from '../../hooks/use-context-props';
import { useDefaultProps } from '../../hooks/use-defaults';
import { useTheme } from '../../hooks/use-theme';
import { inlineVars } from '../../utils/css';
import { callRenderProps, mergeClassNames } from '../../utils/props';
import { AriaGroupContext } from '../aria';
import { ButtonContext } from '../button';
import type { ButtonProps } from '../button/types';
import { IconContext } from '../icon';
import type { IconProps } from '../icon/types';
import { InputContext } from '../input';
import type { InputProps } from '../input/types';
import {
  searchFieldClassNames,
  searchFieldStateVars,
} from './search-field.css';
import type { SearchFieldMapping, SearchFieldProps } from './types';

const defaultMapping: SearchFieldMapping = {
  icon: {
    sm: { size: 'xs' },
    lg: { size: 'sm' },
  },
  clear: {
    sm: { size: 'xs', variant: 'icon' },
    lg: { size: 'sm', variant: 'icon' },
  },
};

export const SearchFieldContext =
  createContext<ContextValue<SearchFieldProps, HTMLDivElement>>(null);

export const SearchField = forwardRef(function SearchField(
  props: SearchFieldProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  [props, ref] = useContextProps(props, ref, SearchFieldContext);
  props = useDefaultProps(props, 'SearchField');

  const {
    children: childrenProp,
    classNames: classNamesProp,
    mapping: mappingProp,
    size = 'lg',
    variant = 'solid',
    isDisabled,
    isReadOnly,
  } = props;

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
      mergeClassNames(searchFieldClassNames, theme.SearchField, classNamesProp),
    [theme.SearchField, classNamesProp],
  );

  const values = useMemo<
    [
      [typeof AriaGroupContext, ContextValue<RACGroupProps, HTMLDivElement>],
      [typeof IconContext, ContextValue<IconProps, HTMLDivElement>],
      [typeof InputContext, ContextValue<InputProps, HTMLInputElement>],
      [typeof ButtonContext, ContextValue<ButtonProps, HTMLButtonElement>],
    ]
  >(
    () => [
      [AriaGroupContext, { className: classNames?.group }],
      [IconContext, { ...mapping.icon[size], classNames: classNames?.icon }],
      [InputContext, { classNames: classNames?.input, size }],
      [
        ButtonContext,
        {
          ...mapping.clear[size],
          classNames: classNames?.clear,
          isDisabled: isDisabled ?? isReadOnly,
        },
      ],
    ],
    [classNames, mapping, isDisabled, isReadOnly, size],
  );

  const style = useCallback(
    ({ state, ...renderProps }: SearchFieldRenderProps) =>
      inlineVars(searchFieldStateVars, {
        ...renderProps,
        variant,
      }),
    [variant],
  );

  const children = useCallback(
    (renderProps: SearchFieldRenderProps) => (
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
    <RACSearchField
      {...props}
      ref={ref}
      className={classNames?.container}
      style={style}
    >
      {children}
    </RACSearchField>
  );
});
