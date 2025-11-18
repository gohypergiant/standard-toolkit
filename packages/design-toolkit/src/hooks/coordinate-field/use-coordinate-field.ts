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

import { useId } from '@react-aria/utils';
import { useMemo } from 'react';
import { useCoordinateCopy } from './use-coordinate-copy';
import { useCoordinateFieldState } from './use-coordinate-field-state';
import { useCoordinateFocus } from './use-coordinate-focus';
import { useCoordinatePaste } from './use-coordinate-paste';
import { useTimeoutCleanup } from './use-timeout-cleanup';
import type { ValidationResult } from 'react-aria-components';
import type {
  CoordinateFieldProps,
  CoordinateSystem,
  CoordinateValue,
} from '../../components/coordinate-field/types';

const FOCUS_DELAY_MS = 0;

export interface UseCoordinateFieldResult {
  state: ReturnType<typeof useCoordinateFieldState>;
  focus: ReturnType<typeof useCoordinateFocus>;
  paste: ReturnType<typeof useCoordinatePaste>;
  copy: ReturnType<typeof useCoordinateCopy>;
  registerTimeout: (timeoutId: NodeJS.Timeout) => void;
  fieldProps: {
    id: string;
    role: 'group';
    'aria-labelledby': string | undefined;
    'aria-describedby': string | undefined;
    'aria-label': string | undefined;
    'aria-details': string | undefined;
    'aria-invalid': boolean | undefined;
    'aria-required': boolean | undefined;
    'aria-disabled': boolean | undefined;
  };
  labelProps: {
    id: string;
    htmlFor: string;
  };
  descriptionProps: {
    id: string;
  };
  errorProps: {
    id: string;
  };
  validation: ValidationResult;
  ids: {
    fieldId: string;
    labelId: string;
    descriptionId: string;
    errorId: string;
  };
  effectiveErrorMessage: string | null;
  isInvalid: boolean;
}

export function useCoordinateField(
  props: CoordinateFieldProps,
  customAriaLabel?: string,
  customAriaDescribedby?: string,
  customAriaDetails?: string,
): UseCoordinateFieldResult {
  const {
    description,
    errorMessage: errorMessageProp,
    format = 'dd' as CoordinateSystem,
    value,
    defaultValue,
    onChange,
    onError,
    isDisabled = false,
    isInvalid: isInvalidProp = false,
    isRequired = false,
    id: idProp,
  } = props;

  const fieldId = useId(idProp);
  const labelId = useId();
  const descriptionId = useId();
  const errorId = useId();

  const { registerTimeout } = useTimeoutCleanup();

  const state = useCoordinateFieldState({
    value,
    defaultValue,
    format,
    onChange,
    onError,
    registerTimeout,
  });

  const focus = useCoordinateFocus({
    editableSegmentConfigs: state.editableSegmentConfigs,
  });

  const handlePasteValueApplied = (pastedValue: CoordinateValue) => {
    state.applyPastedCoordinate(pastedValue);

    // Defer focus until after React commits state updates to the DOM.
    // applyPastedCoordinate triggers setSegmentValues which updates the input
    // elements, and we need those updates to complete before focusing.
    registerTimeout(
      setTimeout(() => {
        focus.focusFirstSegment();
      }, FOCUS_DELAY_MS),
    );
  };

  const paste = useCoordinatePaste({
    onValueApplied: handlePasteValueApplied,
    onError,
  });

  const copy = useCoordinateCopy({
    currentValue: state.currentValue,
    validationErrors: state.validationErrors,
    isDisabled,
    registerTimeout,
  });

  const effectiveErrorMessage = useMemo(
    () => errorMessageProp || state.effectiveErrorMessage,
    [errorMessageProp, state.effectiveErrorMessage],
  );

  const isInvalid = isInvalidProp || effectiveErrorMessage !== null;

  const describedByIds = [
    description && descriptionId,
    effectiveErrorMessage && errorId,
    customAriaDescribedby,
  ].filter(Boolean);
  const describedBy =
    describedByIds.length > 0 ? describedByIds.join(' ') : undefined;

  const labelProps = {
    id: labelId,
    htmlFor: fieldId,
  };

  // Only use aria-labelledby when we have a visible label (not using aria-label)
  // When aria-label is provided (e.g., in small size), it takes precedence
  const ariaLabelledBy = customAriaLabel ? undefined : labelId;

  const fieldProps = {
    id: fieldId,
    role: 'group' as const,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': describedBy,
    'aria-label': customAriaLabel || undefined,
    'aria-details': customAriaDetails || undefined,
    'aria-invalid': isInvalid || undefined,
    'aria-required': isRequired || undefined,
    'aria-disabled': isDisabled || undefined,
  };

  const descriptionProps = {
    id: descriptionId,
  };

  const errorProps = {
    id: errorId,
  };

  const validation: ValidationResult = useMemo(
    () => ({
      isInvalid,
      validationErrors: effectiveErrorMessage ? [effectiveErrorMessage] : [],
      validationDetails: {} as ValidityState,
    }),
    [isInvalid, effectiveErrorMessage],
  );

  return {
    state,
    focus,
    paste,
    copy,
    registerTimeout,
    fieldProps,
    labelProps,
    descriptionProps,
    errorProps,
    validation,
    ids: {
      fieldId,
      labelId,
      descriptionId,
      errorId,
    },
    effectiveErrorMessage,
    isInvalid,
  };
}
