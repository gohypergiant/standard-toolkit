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
  type LegacyRef,
  createContext,
  forwardRef,
  useMemo,
} from 'react';
import type { ContextValue } from 'react-aria-components';
import { useContextProps, useDefaultProps, useTheme } from '../../hooks';
import { inlineVars, mergeClassNames } from '../../utils';
import { iconClassNames, iconStateVars } from './icon.css';
import type { IconProps } from './types';

export const IconContext =
  createContext<ContextValue<IconProps, HTMLDivElement>>(null);

export const Icon = forwardRef(function Icon(
  propsOriginal: IconProps,
  refOriginal: ForwardedRef<HTMLDivElement>,
) {
  let [props, ref] = useContextProps(propsOriginal, refOriginal, IconContext);

  props = useDefaultProps(props, 'Icon');

  const {
    children,
    classNames: classNamesProp,
    color,
    fill,
    size = 'relative',
    stroke,
  } = props;

  const theme = useTheme();

  const classNames = useMemo(
    () => mergeClassNames(iconClassNames, theme.Icon, classNamesProp),
    [theme.Icon, classNamesProp],
  );

  const style = useMemo(
    () =>
      inlineVars(iconStateVars, {
        color,
        fill,
        size,
        stroke,
      }),
    [color, fill, size, stroke],
  );

  return (
    <div
      ref={ref as LegacyRef<HTMLDivElement> | undefined}
      className={classNames?.container}
      style={style}
    >
      <div className={classNames?.icon}>{children}</div>
    </div>
  );
});
