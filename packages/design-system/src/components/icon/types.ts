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

import type { CSSProperties, PropsWithChildren } from 'react';
import type { SlotProps } from 'react-aria-components';

export type IconClassNames = Partial<{
  container: string;
  icon: string;
}>;

export type IconSizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'relative';

export type BaseIconProps = Pick<CSSProperties, 'color' | 'fill' | 'stroke'> & {
  classNames?: IconClassNames;
  size?: IconSizes;
};

export type IconState = Required<Omit<BaseIconProps, 'classNames'>>;

export type IconProps = PropsWithChildren<BaseIconProps & SlotProps>;
