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

import { getLogger } from '@accelint/logger';
import { useState } from 'react';

const logger = getLogger({
  enabled: process.env.NODE_ENV !== 'production',
  level: 'debug',
  prefix: '[CoordinateField]',
  pretty: true,
});

import { getAllCoordinateFormats } from '../../components/coordinate-field/coordinate-utils';
import type {
  CoordinateSystem,
  CoordinateValue,
} from '../../components/coordinate-field/types';
import type { UseTimeoutCleanupResult } from './use-timeout-cleanup';

const COPY_FEEDBACK_DURATION_MS = 2000;

export interface UseCoordinateCopyOptions {
  currentValue: CoordinateValue | null;
  validationErrors: string[];
  isDisabled: boolean;
  registerTimeout: UseTimeoutCleanupResult['registerTimeout'];
}

export interface UseCoordinateCopyResult {
  copiedFormat: CoordinateSystem | null;
  handleCopyFormat: (formatToCopy: CoordinateSystem) => Promise<void>;
  isFormatButtonEnabled: boolean;
}

export function useCoordinateCopy({
  currentValue,
  validationErrors,
  isDisabled,
  registerTimeout,
}: UseCoordinateCopyOptions): UseCoordinateCopyResult {
  const [copiedFormat, setCopiedFormat] = useState<CoordinateSystem | null>(
    null,
  );

  /**
   * Fallback clipboard copy for browsers that don't support navigator.clipboard API.
   * Creates a temporary textarea, copies text using document.execCommand('copy'),
   * and provides visual feedback by setting copiedFormat state for 2 seconds.
   *
   * @param text - The coordinate string to copy to clipboard
   * @param formatToCopy - The coordinate format being copied (for UI feedback)
   */
  const fallbackCopyToClipboard = (
    text: string,
    formatToCopy: CoordinateSystem,
  ) => {
    // Create temporary textarea for copy operation
    const textArea = document.createElement('textarea');
    textArea.value = text;
    // Position off-screen so it's not visible to user
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');

      // Set copied format to show Check icon in UI
      setCopiedFormat(formatToCopy);

      // Reset to null after 2 seconds to return to Copy icon
      registerTimeout(
        setTimeout(() => {
          setCopiedFormat(null);
        }, COPY_FEEDBACK_DURATION_MS),
      );
    } catch (err) {
      logger.withError(err).warn('Fallback copy to clipboard failed');
    }

    // Clean up temporary textarea
    document.body.removeChild(textArea);
  };

  /**
   * Handles copying a coordinate in the specified format to the clipboard.
   * Uses modern clipboard API (navigator.clipboard.writeText) with fallback
   * to document.execCommand for older browsers.
   *
   * Sets copiedFormat state to show visual feedback (Check icon) for 2 seconds.
   *
   * @param formatToCopy - The coordinate format to copy (dd, ddm, dms, mgrs, utm)
   */
  const handleCopyFormat = async (formatToCopy: CoordinateSystem) => {
    if (!currentValue) {
      return;
    }

    const allFormats = getAllCoordinateFormats(currentValue);
    const formatResult = allFormats[formatToCopy];

    if (!formatResult.isValid) {
      return;
    }

    try {
      // Modern clipboard API - copy and show feedback
      await navigator.clipboard.writeText(formatResult.value);

      // Set copied format to show Check icon in UI
      setCopiedFormat(formatToCopy);

      // Reset to null after 2 seconds to return to Copy icon
      registerTimeout(
        setTimeout(() => {
          setCopiedFormat(null);
        }, COPY_FEEDBACK_DURATION_MS),
      );
    } catch (_err) {
      // Fall back to document.execCommand for older browsers
      fallbackCopyToClipboard(formatResult.value, formatToCopy);
    }
  };

  const isFormatButtonEnabled =
    currentValue !== null && validationErrors.length === 0 && !isDisabled;

  return {
    copiedFormat,
    handleCopyFormat,
    isFormatButtonEnabled,
  };
}
