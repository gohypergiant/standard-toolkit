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

'use client';

import 'client-only';
import Check from '@accelint/icons/check';
import CopyToClipboard from '@accelint/icons/copy-to-clipboard';
import GlobalShare from '@accelint/icons/global-share';
import { filterDOMProps } from '@react-aria/utils';
import { clsx } from 'clsx';
import { useCallback, useMemo, useState } from 'react';
import {
  Text as AriaText,
  composeRenderProps,
  FieldError,
  FieldErrorContext,
  GroupContext,
  LabelContext,
  Provider,
  TextContext,
  useContextProps,
} from 'react-aria-components';
import { useCoordinateField } from '../../hooks/coordinate-field';
import { Button } from '../button';
import { Dialog } from '../dialog';
import { DialogContent } from '../dialog/content';
import { DialogFooter } from '../dialog/footer';
import { DialogTitle } from '../dialog/title';
import { DialogTrigger } from '../dialog/trigger';
import { Icon } from '../icon';
import { Label } from '../label';
import { Popover } from '../popover';
import { PopoverContent } from '../popover/content';
import { PopoverTitle } from '../popover/title';
import { PopoverTrigger } from '../popover/trigger';
import { Radio } from '../radio';
import { RadioGroup } from '../radio/group';
import { CoordinateFieldContext, CoordinateFieldStateContext } from './context';
import {
  type CoordinateFormatResult,
  getAllCoordinateFormats,
} from './coordinate-utils';
import { CoordinateSegment } from './segment';
import { getSegmentLabel } from './segment-configs';
import styles from './styles.module.css';
import {
  COORDINATE_FORMAT_LABELS,
  COORDINATE_FORMAT_NAMES,
  COORDINATE_SYSTEMS,
  type CoordinateSystem,
} from './types';
import { calculateMaxControlWidth } from './width-utils';
import type { CoordinateFieldProps } from './types';

/**
 * CoordinateField - A comprehensive coordinate input component with multiple format support
 *
 * Provides accessible coordinate input functionality with support for multiple coordinate
 * systems (DD, DDM, DMS, MGRS, UTM). All values are normalized to Decimal Degrees internally
 * for consistency.
 *
 * @example
 * // Basic coordinate field
 * <CoordinateField label="Location" />
 *
 * @example
 * // Coordinate field with validation
 * <CoordinateField
 *   label="Target Coordinates"
 *   isRequired
 *   isInvalid={hasError}
 *   errorMessage="Please enter a valid coordinate"
 * />
 *
 * @example
 * // Coordinate field with specific format
 * <CoordinateField
 *   label="Position"
 *   format="dms"
 *   description="Enter coordinates in Degrees Minutes Seconds format"
 * />
 *
 * @example
 * // Compact coordinate field
 * <CoordinateField
 *   label="Coordinates"
 *   size="small"
 *   format="dd"
 * />
 *
 * @example
 * // Controlled coordinate field
 * <CoordinateField
 *   label="Selected Location"
 *   value={coordinates}
 *   onChange={setCoordinates}
 * />
 *
 * @example
 * // Coordinate field with error handling
 * <CoordinateField
 *   label="Target Coordinates"
 *   onError={(message, context) => {
 *     // message will be "Invalid coordinate value" for validation errors
 *     // or "Invalid coordinate format" for paste errors
 *     setErrorMessage(message);
 *     console.error(message, context);
 *   }}
 *   isInvalid={!!errorMessage}
 *   errorMessage={errorMessage}
 * />
 */
export function CoordinateField({ ref, ...props }: CoordinateFieldProps) {
  [props, ref] = useContextProps(props, ref, CoordinateFieldContext);

  const {
    classNames,
    description: descriptionProp,
    label: labelProp,
    format = 'dd',
    size = 'medium',
    showFormatButton = true,
    isDisabled = false,
    isInvalid: isInvalidProp = false,
    isRequired = false,
    ...rest
  } = props;

  const isSmall = size === 'small';

  const DOMProps = filterDOMProps(rest, { global: true });

  // When size is small and label is hidden, use aria-label instead of aria-labelledby
  // to ensure screen readers have an accessible name
  const ariaLabelForSmallSize =
    isSmall && labelProp ? labelProp : rest['aria-label'];

  const {
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
    effectiveErrorMessage,
    isInvalid,
  } = useCoordinateField(
    props,
    ariaLabelForSmallSize,
    rest['aria-describedby'],
    rest['aria-details'],
  );

  const componentState = {
    segmentValues: state.segmentValues,
    format,
    currentValue: state.currentValue,
    validationErrors: state.validationErrors,
    isDisabled,
    isInvalid,
    isRequired,
    size,
    registerTimeout,
  };

  // Store all coordinate formats, calculated only when popover opens
  const [allCoordinateFormats, setAllCoordinateFormats] = useState<Record<
    CoordinateSystem,
    CoordinateFormatResult
  > | null>(null);

  const handlePopoverOpenChange = useCallback(
    (isOpen: boolean) => {
      if (isOpen) {
        setAllCoordinateFormats(getAllCoordinateFormats(state.currentValue));
      }
    },
    [state.currentValue],
  );

  // Calculate the maximum width needed for the control container
  // This keeps the outlined container at a fixed width while segments animate
  const maxControlWidth = useMemo(
    () =>
      calculateMaxControlWidth(
        state.editableSegmentConfigs,
        state.segmentConfigs,
        showFormatButton,
      ),
    [state.editableSegmentConfigs, state.segmentConfigs, showFormatButton],
  );

  return (
    <Provider
      values={[
        [CoordinateFieldContext, props],
        [CoordinateFieldStateContext, componentState],
        [GroupContext, fieldProps],
        [LabelContext, labelProps],
        [
          TextContext,
          {
            slots: {
              description: descriptionProps,
              errorMessage: errorProps,
            },
          },
        ],
        [FieldErrorContext, validation],
      ]}
    >
      <div
        {...DOMProps}
        {...fieldProps}
        ref={ref}
        className={clsx(
          'group/coordinate-field',
          styles.field,
          classNames?.field,
        )}
        data-size={size}
        data-disabled={isDisabled || null}
        data-invalid={isInvalid || null}
      >
        {!isSmall && labelProp && (
          <Label
            className={classNames?.label}
            isDisabled={isDisabled}
            isRequired={isRequired}
          >
            {labelProp}
          </Label>
        )}

        <div
          className={clsx(styles.control, classNames?.control)}
          style={{ width: maxControlWidth }}
        >
          <div
            className={clsx(styles.input, classNames?.input)}
            onPasteCapture={paste.handleInputPaste}
            data-input-container
          >
            {state.segmentConfigs.map((config, configIndex) => {
              if (config.type === 'literal') {
                return (
                  <span
                    key={`${format}-literal-${configIndex}-${config.value}`}
                    className='fg-primary-muted'
                  >
                    {config.value}
                  </span>
                );
              }

              const editableIndex = state.segmentConfigs
                .slice(0, configIndex)
                .filter((c) => c.type !== 'literal').length;

              return (
                <CoordinateSegment
                  key={`${format}-segment-${editableIndex}`}
                  value={state.segmentValues[editableIndex] || ''}
                  onChange={(newValue) =>
                    state.handleSegmentChange(editableIndex, newValue)
                  }
                  onFocus={() => focus.setFocusedSegmentIndex(editableIndex)}
                  onBlur={() => {
                    focus.setFocusedSegmentIndex(-1);
                    state.flushPendingValidation();
                  }}
                  onKeyDown={(e) =>
                    focus.handleSegmentKeyDown(editableIndex, e)
                  }
                  onAutoAdvance={() => focus.focusNextSegment(editableIndex)}
                  onAutoRetreat={() =>
                    focus.focusPreviousSegment(editableIndex)
                  }
                  placeholder={config.placeholder}
                  maxLength={config.maxLength}
                  pad={config.pad}
                  className={clsx(styles.segment, classNames?.segment)}
                  isDisabled={isDisabled}
                  allowedChars={config.allowedChars}
                  segmentRef={focus.segmentRefs[editableIndex]}
                  segmentIndex={editableIndex}
                  totalSegments={state.editableSegmentConfigs.length}
                  ariaLabel={getSegmentLabel(format, editableIndex)}
                />
              );
            })}
          </div>

          {showFormatButton && (
            <PopoverTrigger onOpenChange={handlePopoverOpenChange}>
              <Button
                variant='icon'
                size={size}
                color='mono-bold'
                className={classNames?.formatButton}
                aria-label='View coordinate in all formats'
                isDisabled={!copy.isFormatButtonEnabled}
              >
                <Icon>
                  <GlobalShare />
                </Icon>
              </Button>
              <Popover>
                <PopoverTitle className={styles.popoverTitle}>
                  Copy Coordinates
                </PopoverTitle>
                <PopoverContent>
                  {allCoordinateFormats &&
                    COORDINATE_SYSTEMS.map((formatKey) => {
                      const formatResult = allCoordinateFormats[formatKey];
                      const isCopied = copy.copiedFormat === formatKey;

                      return (
                        <div key={formatKey} className={styles.formatRow}>
                          <div className={styles.formatLabels}>
                            <span className={styles.formatLabel}>
                              {COORDINATE_FORMAT_LABELS[formatKey]}
                            </span>
                            <span
                              className={styles.formatValue}
                              title={formatResult.value}
                            >
                              {formatResult.value}
                            </span>
                          </div>
                          <Button
                            variant='icon'
                            color='mono-bold'
                            aria-label={`Copy ${COORDINATE_FORMAT_LABELS[formatKey]} format`}
                            onClick={() => copy.handleCopyFormat(formatKey)}
                            isDisabled={!formatResult.isValid}
                          >
                            <Icon>
                              {isCopied ? <Check /> : <CopyToClipboard />}
                            </Icon>
                          </Button>
                        </div>
                      );
                    })}
                </PopoverContent>
              </Popover>
            </PopoverTrigger>
          )}
        </div>

        {/* Description is hidden when field is invalid (unless disabled) to make room for error message */}
        {descriptionProp && !isSmall && (!isInvalid || isDisabled) && (
          <AriaText
            className={clsx(styles.description, classNames?.description)}
            slot='description'
          >
            {descriptionProp}
          </AriaText>
        )}

        <FieldError
          className={composeRenderProps(classNames?.error, (className) =>
            clsx(styles.error, className),
          )}
        >
          {effectiveErrorMessage}
        </FieldError>

        <DialogTrigger
          isOpen={paste.showDisambiguationModal}
          onOpenChange={paste.setShowDisambiguationModal}
        >
          <Button className='hidden'>Hidden Trigger</Button>
          <Dialog size='small'>
            <DialogTitle className={styles.modalTitle}>
              Select Coordinate Format
            </DialogTitle>
            <DialogContent>
              <p className={styles.modalDescription}>
                The pasted value matches multiple coordinate formats. Please
                select the correct interpretation:
              </p>

              <RadioGroup
                classNames={{ group: styles.formatOptions }}
                value={paste.selectedDisambiguationFormat}
                onChange={(value) =>
                  paste.setSelectedDisambiguationFormat(
                    value as CoordinateSystem,
                  )
                }
              >
                {paste.disambiguationMatches.map((match) => (
                  <Radio key={match.format} value={match.format}>
                    <div className={styles.modalOptionContent}>
                      <span className={styles.formatOptionLabel}>
                        {COORDINATE_FORMAT_NAMES[match.format]}
                      </span>
                      <span className={styles.formatOptionValue}>
                        {match.displayString}
                      </span>
                    </div>
                  </Radio>
                ))}
              </RadioGroup>
            </DialogContent>
            <DialogFooter className={styles.modalActions}>
              <Button
                variant='flat'
                onPress={() => paste.setShowDisambiguationModal(false)}
              >
                Cancel
              </Button>
              <Button onPress={paste.handleDisambiguationSelect}>
                Apply Selected
              </Button>
            </DialogFooter>
          </Dialog>
        </DialogTrigger>
      </div>
    </Provider>
  );
}
