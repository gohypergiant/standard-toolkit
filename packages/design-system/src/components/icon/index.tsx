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

import { type ForwardedRef, createContext, forwardRef, useMemo } from 'react';
import type { ContextValue } from 'react-aria-components';
import { useContextProps } from '../../hooks/use-context-props';
import { useDefaultProps } from '../../hooks/use-defaults';
import { useTheme } from '../../hooks/use-theme';
import { inlineVars } from '../../utils/css';
import { mergeClassNames } from '../../utils/props';
import { iconClassNames, iconStateVars } from './icon.css';
import type { IconProps } from './types';

export const IconContext =
  createContext<ContextValue<IconProps, HTMLDivElement>>(null);

export const Icon = forwardRef(function Icon(
  props: IconProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  [props, ref] = useContextProps(props, ref, IconContext);

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
    <div ref={ref} className={classNames?.container} style={style}>
      <div className={classNames?.icon}>{children}</div>
    </div>
  );
});
