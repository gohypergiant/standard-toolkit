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
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MediaControlsProvider, useResolvedDisabled } from './context';

describe('useResolvedDisabled', () => {
  describe('priority: prop > context > default', () => {
    it('should return false when no prop and no context', () => {
      const { result } = renderHook(() => useResolvedDisabled());
      expect(result.current).toBe(false);
    });

    it('should return false when no prop and no context (explicit undefined)', () => {
      const { result } = renderHook(() => useResolvedDisabled(undefined));
      expect(result.current).toBe(false);
    });

    it('should return context value when no prop is provided', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <MediaControlsProvider isDisabled={true}>
          {children}
        </MediaControlsProvider>
      );
      const { result } = renderHook(() => useResolvedDisabled(), { wrapper });
      expect(result.current).toBe(true);
    });

    it('should return context isDisabled=false when no prop is provided', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <MediaControlsProvider isDisabled={false}>
          {children}
        </MediaControlsProvider>
      );
      const { result } = renderHook(() => useResolvedDisabled(), { wrapper });
      expect(result.current).toBe(false);
    });

    it('should return prop value when prop is true (no context)', () => {
      const { result } = renderHook(() => useResolvedDisabled(true));
      expect(result.current).toBe(true);
    });

    it('should return prop value when prop is false (no context)', () => {
      const { result } = renderHook(() => useResolvedDisabled(false));
      expect(result.current).toBe(false);
    });

    it('should allow prop false to override context true', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <MediaControlsProvider isDisabled={true}>
          {children}
        </MediaControlsProvider>
      );
      const { result } = renderHook(() => useResolvedDisabled(false), {
        wrapper,
      });
      expect(result.current).toBe(false);
    });

    it('should allow prop true to override context false', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <MediaControlsProvider isDisabled={false}>
          {children}
        </MediaControlsProvider>
      );
      const { result } = renderHook(() => useResolvedDisabled(true), {
        wrapper,
      });
      expect(result.current).toBe(true);
    });
  });
});
