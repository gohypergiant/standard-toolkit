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

import { SkeletonStyles, SkeletonStylesDefaults } from './styles';
import type { SkeletonProps } from './types';

/**
 * Skeleton - A flexible skeleton loader component for indicating loading states
 *
 * Used to show placeholder content while data is being fetched or processed.
 * Provides visual feedback to users during loading states with customizable shapes.
 *
 * @example
 * // Basic rectangular placeholder
 * <Skeleton />
 *
 * @example
 * // Circular placeholder (useful for avatars)
 * <Skeleton shape="circ" />
 *
 * @example
 * // With loading text content
 * <Skeleton>Loading content...</Skeleton>
 *
 * @example
 * // Nested placeholders for complex layouts
 * <Skeleton className="mb-xl p-m">
 *   <br />
 *   <br />
 *   <Skeleton className="w-[75%]" />
 * </Skeleton>
 *
 * @example
 * // Custom styling
 * <Skeleton className="w-[50%] mt-l" />
 */
export function Skeleton({
  className,
  shape = SkeletonStylesDefaults.shape,
  ...rest
}: SkeletonProps) {
  return <div {...rest} className={SkeletonStyles({ className, shape })} />;
}
Skeleton.displayName = 'Skeleton';
