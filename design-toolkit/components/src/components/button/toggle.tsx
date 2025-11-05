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
  ToggleButton as AriaToggleButton,
  composeRenderProps,
  useContextProps,
} from 'react-aria-components';
import { IconProvider } from '../icon/context';
import { ToggleButtonContext } from './context';
import { ToggleButtonStyles } from './styles';
import type { ToggleButtonProps } from './types';

/**
 * ToggleButton - A button component that maintains pressed/unpressed state
 *
 * Provides accessible toggle functionality with visual feedback for the current state.
 * Perfect for features like favorites, bookmarks, switches, or any binary state controls.
 * Includes icon support and integrates with React Aria for keyboard navigation and accessibility.
 *
 * @example
 * // Basic toggle button
 * <ToggleButton>Toggle Feature</ToggleButton>
 *
 * @example
 * // Controlled toggle button with different variants
 * <ToggleButton variant="flat" isSelected={isEnabled} onChange={setIsEnabled}>
 *   Enable Notifications
 * </ToggleButton>
 *
 * @example
 * // Toggle button with icon and state
 * <ToggleButton variant="outline" isSelected={isFavorite} onChange={setIsFavorite}>
 *   <Icon><Heart /></Icon>
 *   {isFavorite ? 'Favorite' : 'Add to Favorites'}
 * </ToggleButton>
 *
 * @example
 * // Icon-only toggle button
 * <ToggleButton variant="icon" isSelected={isBookmarked} onChange={setIsBookmarked}>
 *   <Icon><Bookmark /></Icon>
 * </ToggleButton>
 *
 * @example
 * // Toggle button with different colors and sizes
 * <ToggleButton color="critical" size="small" isSelected={isEnabled}>
 *   Critical Toggle
 * </ToggleButton>
 */
export function ToggleButton({ ref, ...props }: ToggleButtonProps) {
  [props, ref] = useContextProps(props, ref ?? null, ToggleButtonContext);

  const {
    children,
    className,
    color = 'mono-muted',
    size = 'medium',
    variant,
    ...rest
  } = props;

  return (
    <IconProvider size={size}>
      <AriaToggleButton
        {...rest}
        ref={ref}
        className={composeRenderProps(className, (className) =>
          ToggleButtonStyles({
            className,
            variant,
          }),
        )}
        data-color={color}
        data-size={size}
      >
        {children}
      </AriaToggleButton>
    </IconProvider>
  );
}
