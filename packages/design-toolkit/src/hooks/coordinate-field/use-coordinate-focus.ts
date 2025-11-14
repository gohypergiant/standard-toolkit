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

import {
  createRef,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { SegmentConfig } from '../../components/coordinate-field/types';

export interface UseCoordinateFocusOptions {
  editableSegmentConfigs: SegmentConfig[];
}

export interface UseCoordinateFocusResult {
  segmentRefs: React.RefObject<HTMLInputElement>[];
  focusedSegmentIndex: number;
  focusSegment: (index: number) => void;
  focusNextSegment: (currentIndex: number) => void;
  focusPreviousSegment: (currentIndex: number) => void;
  focusFirstSegment: () => void;
  focusLastSegment: () => void;
  handleSegmentKeyDown: (
    index: number,
    e: KeyboardEvent<HTMLInputElement>,
  ) => void;
  setFocusedSegmentIndex: (index: number) => void;
}

export function useCoordinateFocus({
  editableSegmentConfigs,
}: UseCoordinateFocusOptions): UseCoordinateFocusResult {
  const segmentRefsInternal = useRef<React.RefObject<HTMLInputElement>[]>([]);
  const [focusedSegmentIndex, setFocusedSegmentIndex] = useState<number>(-1);

  useEffect(() => {
    segmentRefsInternal.current = editableSegmentConfigs.map((_, i) => {
      const existingRef = segmentRefsInternal.current[i];
      if (existingRef) {
        return existingRef;
      }
      return createRef<HTMLInputElement>() as React.RefObject<HTMLInputElement>;
    });
  }, [editableSegmentConfigs]);

  const focusSegment = (index: number) => {
    if (index >= 0 && index < segmentRefsInternal.current.length) {
      segmentRefsInternal.current[index]?.current?.focus();
    }
  };

  const focusNextSegment = (currentIndex: number) => {
    focusSegment(currentIndex + 1);
  };

  const focusPreviousSegment = (currentIndex: number) => {
    focusSegment(currentIndex - 1);
  };

  const focusFirstSegment = () => {
    focusSegment(0);
  };

  const focusLastSegment = () => {
    focusSegment(segmentRefsInternal.current.length - 1);
  };

  const handleSegmentKeyDown = (
    _index: number,
    e: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Home') {
      e.preventDefault();
      focusFirstSegment();
    } else if (e.key === 'End') {
      e.preventDefault();
      focusLastSegment();
    }
  };

  return {
    segmentRefs: segmentRefsInternal.current,
    focusedSegmentIndex,
    focusSegment,
    focusNextSegment,
    focusPreviousSegment,
    focusFirstSegment,
    focusLastSegment,
    handleSegmentKeyDown,
    setFocusedSegmentIndex,
  };
}
