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

/** Options for the useCoordinatePaste hook */
export interface UseCoordinatePasteOptions {
  /** Callback when a coordinate value is successfully parsed and applied */
  onValueApplied: (value: CoordinateValue) => void;
  /** Optional error callback for invalid paste attempts */
  onError?: (message: string, context?: Record<string, unknown>) => void;
}

/** Return value from the useCoordinatePaste hook */
export interface UseCoordinatePasteResult {
  /** Array of parsed coordinate matches for disambiguation */
  disambiguationMatches: ParsedCoordinateMatch[];
  /** Whether the disambiguation modal is visible */
  showDisambiguationModal: boolean;
  /** Currently selected format in disambiguation modal */
  selectedDisambiguationFormat: CoordinateSystem | null;
  /** Paste event handler for coordinate input */
  handleInputPaste: (e: React.ClipboardEvent<HTMLDivElement>) => void;
  /** Confirm selection in disambiguation modal */
  handleDisambiguationSelect: () => void;
  /** Control disambiguation modal visibility */
  setShowDisambiguationModal: (show: boolean) => void;
  /** Set the selected format in disambiguation modal */
  setSelectedDisambiguationFormat: (format: CoordinateSystem | null) => void;
  /** Reset disambiguation modal state */
  cleanupDisambiguationModal: () => void;
}

/**
 * Handles paste events with coordinate parsing and disambiguation when multiple formats match
 *
 * @example
 * ```tsx
 * function CoordinateFieldWithPaste() {
 *   const [value, setValue] = useState<CoordinateValue | null>(null);
 *
 *   const {
 *     disambiguationMatches,
 *     showDisambiguationModal,
 *     selectedDisambiguationFormat,
 *     handleInputPaste,
 *     handleDisambiguationSelect,
 *     setShowDisambiguationModal,
 *     setSelectedDisambiguationFormat,
 *   } = useCoordinatePaste({
 *     onValueApplied: setValue,
 *     onError: (msg) => console.error(msg),
 *   });
 *
 *   return (
 *     <>
 *       <div onPaste={handleInputPaste}>
 *         // ...Coordinate input segments
 *       </div>
 *       {showDisambiguationModal && (
 *         <Dialog onClose={() => setShowDisambiguationModal(false)}>
 *           {disambiguationMatches.map((match) => (
 *             <Radio
 *               key={match.format}
 *               value={match.format}
 *               isSelected={selectedDisambiguationFormat === match.format}
 *               onChange={() => setSelectedDisambiguationFormat(match.format)}
 *             >
 *               {match.format}: {match.matched}
 *             </Radio>
 *           ))}
 *           <Button onPress={handleDisambiguationSelect}>Confirm</Button>
 *         </Dialog>
 *       )}
 *     </>
 *   );
 * }
 * ```
 *
 * @param options - {@link UseCoordinatePasteOptions}
 * @param options.onValueApplied - Callback when a coordinate value is successfully parsed and applied.
 * @param options.onError - Optional error callback for invalid paste attempts.
 * @returns {@link UseCoordinatePasteResult} Paste handling utilities and disambiguation state.
 */
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

  /**
   * Normalizes MGRS coordinate input to a standard format.
   *
   * - Converts all letters to uppercase
   * - Adds leading zero to single-digit grid zones (e.g., "6R" → "06R")
   * - Handles both spaced ("6R YP 12345 67890") and compact ("6RYP1234567890") formats
   *
   * @param input - Raw MGRS coordinate string
   * @returns Normalized MGRS coordinate string
   *
   * @example
   * normalizeMgrsInput("6r yp 12345 67890") // → "06R YP 12345 67890"
   * normalizeMgrsInput("6ryp1234567890")    // → "06RYP1234567890"
   */
  const normalizeMgrsInput = (input: string): string => {
    // Convert to uppercase
    let normalized = input.toUpperCase();

    // Add leading zero to single-digit grid zones
    // Pattern: single digit followed by letter at start (with optional space)
    normalized = normalized.replace(/^(\d)([A-Z])/, '0$1$2');

    return normalized;
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
    const rawPastedText = e.clipboardData?.getData('text/plain');
    if (rawPastedText) {
      const pastedText = normalizeMgrsInput(rawPastedText);

      if (isCompleteCoordinate(pastedText)) {
        e.preventDefault();
        handleCoordinatePaste(pastedText);
      }
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
