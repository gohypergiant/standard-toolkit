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
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MediaControlsProvider, useMediaControlsDisabled } from './context';

describe('useMediaControlsDisabled', () => {
  describe('disabled if prop or context is true', () => {
    it('should return false when no prop and no context', () => {
      const { result } = renderHook(() => useMediaControlsDisabled());
      expect(result.current).toBe(false);
    });

    it('should return false when no prop and no context (explicit undefined)', () => {
      const { result } = renderHook(() => useMediaControlsDisabled(undefined));
      expect(result.current).toBe(false);
    });

    it('should return context value when no prop is provided', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <MediaControlsProvider isDisabled={true}>
          {children}
        </MediaControlsProvider>
      );
      const { result } = renderHook(() => useMediaControlsDisabled(), {
        wrapper,
      });
      expect(result.current).toBe(true);
    });

    it('should return context isDisabled=false when no prop is provided', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <MediaControlsProvider isDisabled={false}>
          {children}
        </MediaControlsProvider>
      );
      const { result } = renderHook(() => useMediaControlsDisabled(), {
        wrapper,
      });
      expect(result.current).toBe(false);
    });

    it('should return prop value when prop is true (no context)', () => {
      const { result } = renderHook(() => useMediaControlsDisabled(true));
      expect(result.current).toBe(true);
    });

    it('should return prop value when prop is false (no context)', () => {
      const { result } = renderHook(() => useMediaControlsDisabled(false));
      expect(result.current).toBe(false);
    });

    it('should return true when context is disabled regardless of prop', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <MediaControlsProvider isDisabled={true}>
          {children}
        </MediaControlsProvider>
      );
      const { result } = renderHook(() => useMediaControlsDisabled(false), {
        wrapper,
      });
      expect(result.current).toBe(true);
    });

    it('should allow prop true to override context false', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <MediaControlsProvider isDisabled={false}>
          {children}
        </MediaControlsProvider>
      );
      const { result } = renderHook(() => useMediaControlsDisabled(true), {
        wrapper,
      });
      expect(result.current).toBe(true);
    });
  });
});
