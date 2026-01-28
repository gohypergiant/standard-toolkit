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

import type { ReactNode } from 'react';

/**
 * Props for the DeferredCollection component.
 */
export interface DeferredCollectionProps {
  /** The content to render once ready - can be ReactNode or a function returning ReactNode for deferred creation. */
  children: ReactNode | (() => ReactNode);
  /** Fallback element to show while deferring render. */
  fallback?: ReactNode;
  /** Number of animation frames to defer before rendering (default: 2). */
  deferFrames?: number;
}
