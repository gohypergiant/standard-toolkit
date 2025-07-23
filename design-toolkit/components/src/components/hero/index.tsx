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
import { containsExactChildren } from '@/lib/react';
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
import { Icon, IconContext } from '../icon';
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
 *   <Heading>Primary Title</Heading>
 *   <Text>Secondary information</Text>
 * </Hero>
 *
 * // Grid layout for compact display
 * <Hero compact>
 *   <Icon><Settings /></Icon>
 *   <Heading>Settings</Heading>
 *   <Text>Configure your preferences</Text>
 * </Hero>
 * ```
 *
 * @param children - Icon, Heading, and Text components. Order doesn't matter as they're automatically sorted.
 * @param className - Additional CSS classes to apply to the container
 * @param compact - When true, uses grid layout with icon on left and content on right. When false (default), uses stacked layout.
 * @param props - Additional HTML attributes passed to the header element
 *
 * ## Child Component Behavior
 * - **Icon**: Only one allowed. Subsequent icons will be marked as invalid in development.
 * - **Heading**: Only one allowed. Subsequent headings will be marked as invalid in development.
 * - **Text**: Any number allowed as secondary content.
 * - **Other elements**: Marked as invalid in development builds and displayed in a debug panel.
 *
 * ## Layout Modes
 * - **Stack** (default): Vertical layout with larger icon and stacked content
 * - **Grid** (compact=true): Horizontal layout with smaller icon beside content
 */
export function Hero({ ref, ...props }: HeroProps) {
  [props, ref] = useContextProps(props, ref ?? null, HeroContext);

  const { children, classNames, compact, ...rest } = props;

  containsExactChildren({
    children,
    componentName: Hero.displayName,
    restrictions: [
      [Icon, { min: 0, max: 1 }],
      [Hero.Title, { min: 1, max: 1 }],
      [Hero.Subtitle, { min: 0 }],
    ],
  });

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
Hero.Subtitle = Text;
