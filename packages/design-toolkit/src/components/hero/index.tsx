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
import {
  Header,
  HeadingContext,
  Provider,
  TextContext,
  useContextProps,
} from 'react-aria-components';
import { IconContext } from '../icon/context';
import { HeroContext } from './context';
import { HeroStyles } from './styles';
import type { HeroProps } from './types';

const { hero, icon, title, subtitle } = HeroStyles();

/**
 * A versatile hero component that displays an icon alongside primary and secondary content.
 * Automatically organizes child components by type and supports both stacked and grid layouts.
 *
 * @example
 * ```tsx
 * // Basic hero with icon and content
 * <Hero>
 *   <Icon><Placeholder /></Icon>
 *   <HeroTitle>Primary Title</HeroTitle>
 *   <HeroSubtitle>Secondary information</HeroSubtitle>
 * </Hero>
 *
 * // Grid layout for compact display
 * <Hero compact>
 *   <Icon><Settings /></Icon>
 *   <HeroTitle>Settings</HeroTitle>
 *   <HeroSubtitle>Configure your preferences</HeroSubtitle>
 * </Hero>
 * ```
 *
 * ## Child Component Behavior
 * - **Icon**: Only one allowed
 * - **HeroTitle**: Only one allowed
 * - **HeroSubtitle**: Any number allowed as secondary content
 *
 * ## Layout Modes
 * - **Stack** (default): Vertical layout with larger icon and stacked content
 * - **Grid** (compact=true): Horizontal layout with smaller icon beside content
 */
export function Hero({ ref, ...props }: HeroProps) {
  [props, ref] = useContextProps(props, ref ?? null, HeroContext);

  const { children, classNames, compact, ...rest } = props;

  return (
    <Provider
      values={[
        [
          IconContext,
          { className: icon({ className: classNames?.icon }), size: 'large' },
        ],
        [
          HeadingContext,
          { className: title({ className: classNames?.title }), level: 2 },
        ],
        [
          TextContext,
          { className: subtitle({ className: classNames?.subtitle }) },
        ],
      ]}
    >
      <Header
        {...rest}
        ref={ref}
        className={hero({ className: classNames?.hero })}
        data-layout={compact ? 'grid' : 'stack'}
      >
        {children}
      </Header>
    </Provider>
  );
}
