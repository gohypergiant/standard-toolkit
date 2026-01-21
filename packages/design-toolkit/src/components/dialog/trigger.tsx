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

/**
 * DialogTrigger - Manages dialog open/close state and trigger behavior.
 *
 * Wraps a trigger element (typically a Button) and a Dialog component.
 * Handles accessibility attributes and focus management automatically.
 *
 * @example
 * <DialogTrigger>
 *   <Button>Open Dialog</Button>
 *   <Dialog>
 *     <DialogTitle>Title</DialogTitle>
 *     <DialogContent>Content</DialogContent>
 *   </Dialog>
 * </DialogTrigger>
 */
export const DialogTrigger = AriaDialogTrigger;
