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

import { useState } from 'react';
import {
  deduplicateMatchesByLocation,
  isCompleteCoordinate,
  parseCoordinatePaste,
} from '../../components/coordinate-field/coordinate-utils';
import type {
  CoordinateSystem,
  CoordinateValue,
  ParsedCoordinateMatch,
} from '../../components/coordinate-field/types';

export interface UseCoordinatePasteOptions {
  onValueApplied: (value: CoordinateValue) => void;
  onError?: (message: string, context?: Record<string, unknown>) => void;
}

export interface UseCoordinatePasteResult {
  disambiguationMatches: ParsedCoordinateMatch[];
  showDisambiguationModal: boolean;
  selectedDisambiguationFormat: CoordinateSystem | null;
  handleInputPaste: (e: React.ClipboardEvent<HTMLDivElement>) => void;
  handleDisambiguationSelect: () => void;
  setShowDisambiguationModal: (show: boolean) => void;
  setSelectedDisambiguationFormat: (format: CoordinateSystem | null) => void;
  cleanupDisambiguationModal: () => void;
}

export function useCoordinatePaste({
  onValueApplied,
  onError,
}: UseCoordinatePasteOptions): UseCoordinatePasteResult {
  const [disambiguationMatches, setDisambiguationMatches] = useState<
    ParsedCoordinateMatch[]
  >([]);
  const [showDisambiguationModal, setShowDisambiguationModal] = useState(false);
  const [selectedDisambiguationFormat, setSelectedDisambiguationFormat] =
    useState<CoordinateSystem | null>(null);

  /**
   * Handles paste failure when no coordinate formats match
   * Calls onError with "Invalid coordinate format" message
   */
  const handlePasteNoMatches = (pastedText: string) => {
    const errorMsg = 'Invalid coordinate format';
    onError?.(errorMsg, { pastedText });
  };

  const handlePasteSingleMatch = (match: ParsedCoordinateMatch | undefined) => {
    if (match) {
      onValueApplied(match.value);
    }
  };

  const handlePasteMultipleMatches = (matches: ParsedCoordinateMatch[]) => {
    setDisambiguationMatches(matches);
    const firstMatch = matches[0];
    if (firstMatch) {
      setSelectedDisambiguationFormat(firstMatch.format);
    }
    setShowDisambiguationModal(true);
  };

  const handleCoordinatePaste = (pastedText: string) => {
    const allMatches = parseCoordinatePaste(pastedText);

    if (allMatches.length === 0) {
      handlePasteNoMatches(pastedText);
      return;
    }

    // Deduplicate matches by location - only show modal for different locations
    const matches = deduplicateMatchesByLocation(allMatches);

    if (matches.length === 1) {
      handlePasteSingleMatch(matches[0]);
    } else {
      handlePasteMultipleMatches(matches);
    }
  };

  const handleInputPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const pastedText = e.clipboardData?.getData('text/plain');
    if (pastedText && isCompleteCoordinate(pastedText)) {
      e.preventDefault();
      handleCoordinatePaste(pastedText);
    }
  };

  const cleanupDisambiguationModal = () => {
    setShowDisambiguationModal(false);
    setDisambiguationMatches([]);
    setSelectedDisambiguationFormat(null);
  };

  const handleDisambiguationSelect = () => {
    if (selectedDisambiguationFormat) {
      const match = disambiguationMatches.find(
        (m) => m.format === selectedDisambiguationFormat,
      );
      if (match) {
        onValueApplied(match.value);
      }
    }
    cleanupDisambiguationModal();
  };

  return {
    disambiguationMatches,
    showDisambiguationModal,
    selectedDisambiguationFormat,
    handleInputPaste,
    handleDisambiguationSelect,
    setShowDisambiguationModal,
    setSelectedDisambiguationFormat,
    cleanupDisambiguationModal,
  };
}
