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
import { createContext } from 'react';
import {
  type ContextValue,
  Header,
  Heading,
  HeadingContext,
  Provider,
  Text,
  TextContext,
  useContextProps,
} from 'react-aria-components';
import { IconContext } from '../icon';
import { HeroStyles } from './styles';
import type { HeroProps } from './types';

const { hero, icon, title, subtitle } = HeroStyles();

export const HeroContext =
  createContext<ContextValue<HeroProps, HTMLElement>>(null);

/**
 * A versatile hero component that displays an icon alongside primary and secondary content.
 * Automatically organizes child components by type and supports both stacked and grid layouts.
 *
 * @example
 * ```tsx
 * // Basic hero with icon and content
 * <Hero>
 *   <Icon><Placeholder /></Icon>
 *   <Hero.Title>Primary Title</Hero.Title>
 *   <Hero.Subtitle>Secondary information</Hero.Subtitle>
 * </Hero>
 *
 * // Grid layout for compact display
 * <Hero compact>
 *   <Icon><Settings /></Icon>
 *   <Hero.Title>Settings</Hero.Title>
 *   <Hero.Subtitle>Configure your preferences</Hero.Subtitle>
 * </Hero>
 * ```
 *
 * ## Child Component Behavior
 * - **Icon**: Only one allowed
 * - **Hero.Title**: Only one allowed
 * - **Hero.Subtitle**: Any number allowed as secondary content
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
Hero.displayName = 'Hero';
Hero.Title = Heading;
Hero.Title.displayName = 'Hero.Title';
Hero.Subtitle = Text;
Hero.Subtitle.displayName = 'Hero.Subtitle';
