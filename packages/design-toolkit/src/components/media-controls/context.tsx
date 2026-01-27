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
'use client';

import 'client-only';
import { useMediaStore } from 'media-chrome/react/media-store';
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
} from 'react';
import type { MediaControlsContextValue } from './types';

/**
 * Context for MediaControls component.
 *
 * Provides shared configuration values (isDisabled) to all child controls.
 */
export const MediaControlsContext =
  createContext<MediaControlsContextValue | null>(null);

/**
 * Validates that media-chrome's MediaProvider is present.
 *
 * @throws {Error} Throws if called outside a MediaProvider context.
 */
export function useMediaProviderGuard(): void {
  const store = useMediaStore();
  if (!store) {
    throw new Error(
      'MediaControls must be used within a MediaProvider from media-chrome.',
    );
  }
}

/**
 * Resolves disabled state from prop or context.
 *
 * Returns true if either the prop or context indicates disabled.
 * A parent context disabling controls cannot be overridden by children.
 *
 * @param propIsDisabled - The disabled prop value.
 * @returns The resolved disabled state.
 */
export function useMediaControlsDisabled(propIsDisabled?: boolean): boolean {
  const context = useContext(MediaControlsContext);
  return Boolean(propIsDisabled || context?.isDisabled);
}

/**
 * Provider for MediaControls component.
 *
 * Provides shared configuration to all media control children.
 *
 * @param props - The provider props.
 * @param props.children - Child components to receive context.
 * @param props.isDisabled - Whether controls are disabled.
 * @returns The context provider wrapping children.
 *
 * @example
 * ```tsx
 * <MediaControlsProvider isDisabled={false}>
 *   <PlayButton />
 *   <MuteButton />
 * </MediaControlsProvider>
 * ```
 */
export function MediaControlsProvider({
  children,
  isDisabled = false,
}: PropsWithChildren<Partial<MediaControlsContextValue>>) {
  const value = useMemo(() => ({ isDisabled }), [isDisabled]);

  return (
    <MediaControlsContext.Provider value={value}>
      {children}
    </MediaControlsContext.Provider>
  );
}
