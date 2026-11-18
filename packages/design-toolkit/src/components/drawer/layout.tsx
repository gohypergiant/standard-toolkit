/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
import { clsx } from '@accelint/design-foundation/lib/utils';
import styles from './styles.module.css';
import type { CSSProperties, ReactElement } from 'react';
import type { DrawerLayoutProps, DrawerLayoutTracks } from './types';

/**
 * CSS custom property names that hold configured drawer track sizes.
 */
type DrawerConfiguredTrackProperty =
  | '--drawer-top-configured-size'
  | '--drawer-right-configured-size'
  | '--drawer-bottom-configured-size'
  | '--drawer-left-configured-size';

/**
 * Inline styles that may include configured drawer track custom properties.
 */
type DrawerLayoutStyle = CSSProperties &
  Partial<Record<DrawerConfiguredTrackProperty, string>>;

/**
 * Maps optional drawer tracks to their corresponding CSS custom properties.
 *
 * @param tracks - Per-placement CSS grid-track values to serialize.
 * @returns Inline styles containing the configured drawer track properties.
 */
function getConfiguredTrackStyles(
  tracks: DrawerLayoutTracks | undefined,
): DrawerLayoutStyle {
  return {
    '--drawer-top-configured-size': tracks?.top,
    '--drawer-right-configured-size': tracks?.right,
    '--drawer-bottom-configured-size': tracks?.bottom,
    '--drawer-left-configured-size': tracks?.left,
  };
}

/**
 * Renders a CSS Grid container for positioning drawer panels around main content.
 *
 * @param props - Configuration for the drawer layout.
 * @param props.className - Optional CSS class name.
 * @param props.extend - Which drawers should extend to full container dimensions.
 * @param props.tracks - Optional per-placement CSS grid-track values.
 * @param props.push - Which drawers push the main content aside.
 * @param props.style - Inline styles merged before configured track properties.
 * @returns The rendered DrawerLayout component.
 *
 * @remarks
 * A shared layout primitive used by Drawer, Sidenav, and other panel components.
 * It controls how panels are positioned relative to the main content area.
 *
 * @example
 * ```tsx
 * <DrawerLayout extend="left right" push="left">
 *   <DrawerLayoutMain>Main content here</DrawerLayoutMain>
 *   <Drawer placement="left">...</Drawer>
 * </DrawerLayout>
 * ```
 */
export function DrawerLayout({
  className,
  extend = 'left right',
  push,
  style,
  tracks,
  ...rest
}: DrawerLayoutProps): ReactElement {
  const trackStyles = getConfiguredTrackStyles(tracks);

  return (
    <div
      {...rest}
      className={clsx('group/layout', styles.layout, className)}
      data-extend={extend}
      data-push={push || null}
      style={{ ...style, ...trackStyles }}
    />
  );
}
