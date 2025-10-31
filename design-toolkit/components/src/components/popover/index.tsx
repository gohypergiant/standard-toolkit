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
import { DialogTrigger as AriaDialogTrigger } from 'react-aria-components';
import type { PopoverProps } from './types';

/**
 * Popover - A floating content container positioned relative to a trigger element
 *
 * Provides accessible popover functionality with flexible positioning and content
 * organization. Perfect for contextual information, menus, or supplementary content
 * that appears on demand without interrupting the user's workflow.
 *
 * @example
 * // Basic popover
 * <Popover>
 *   <PopoverTrigger>
 *     <Button>Show Info</Button>
 *   </PopoverTrigger>
 *   <PopoverContent>
 *     <PopoverBody>
 *       <p>Additional information appears here</p>
 *     </PopoverBody>
 *   </PopoverContent>
 * </Popover>
 *
 * @example
 * // Popover with title and actions
 * <Popover placement="top">
 *   <PopoverTrigger>
 *     <Button>Options</Button>
 *   </PopoverTrigger>
 *   <PopoverContent>
 *     <PopoverTitle>Quick Actions</PopoverTitle>
 *     <PopoverBody>
 *       <Button>Edit</Button>
 *       <Button>Delete</Button>
 *     </PopoverBody>
 *   </PopoverContent>
 * </Popover>
 */
export function Popover({
  placement = 'bottom',
  children,
  ...rest
}: PopoverProps) {
  return <AriaDialogTrigger {...rest}>{children}</AriaDialogTrigger>;
}
