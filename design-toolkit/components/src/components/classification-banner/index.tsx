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
'use client';

import 'client-only';
import { useContextProps } from 'react-aria-components';
import { ClassificationBannerContext } from './context';
import {
  ClassificationBannerStyles,
  ClassificationBannerStylesDefaults,
} from './styles';
import type { ClassificationBannerProps } from './types';

/**
 * ClassificationBanner - A prominent banner for displaying security classification
 *
 * Provides a full-width banner component for displaying security classification
 * information at the top or bottom of pages. Essential for applications handling
 * classified or sensitive information requiring clear visual indicators.
 *
 * @example
 * // Top classification banner
 * <ClassificationBanner variant="confidential" />
 */
export function ClassificationBanner({
  ref,
  ...props
}: ClassificationBannerProps) {
  [props, ref] = useContextProps(
    props,
    ref ?? null,
    ClassificationBannerContext,
  );

  const {
    className,
    variant = ClassificationBannerStylesDefaults.variant,
    children,
    ...rest
  } = props;

  return (
    <div
      {...rest}
      className={ClassificationBannerStyles({
        variant,
        className,
      })}
    >
      {children}
    </div>
  );
}
