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

  const fallbackCopyToClipboard = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopiedFormat(null);
    } catch (err) {
      logger.withError(err).warn('Fallback copy to clipboard failed');
    }
    document.body.removeChild(textArea);
  };

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
      await navigator.clipboard.writeText(formatResult.value);
      setCopiedFormat(formatToCopy);
      registerTimeout(
        setTimeout(() => {
          setCopiedFormat(null);
        }, COPY_FEEDBACK_DURATION_MS),
      );
    } catch (_err) {
      fallbackCopyToClipboard(formatResult.value);
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
