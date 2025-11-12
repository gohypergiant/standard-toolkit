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
import { Label as AriaLabel, useContextProps } from 'react-aria-components';
import { LabelContext } from './context';
import { LabelStyles } from './styles';
import type { LabelProps } from './types';

/**
 * Label - A semantic label component for form elements and content
 *
 * Provides accessible labeling for form controls with automatic handling of
 * required/optional states. Integrates with React Aria form components to
 * ensure proper accessibility and screen reader support.
 *
 * @example
 * // Basic label
 * <Label>Username</Label>
 *
 * @example
 * // Required field label
 * <Label isRequired>Email Address</Label>
 *
 * @example
 * // Disabled label
 * <Label isDisabled>Inactive Field</Label>
 */
export function Label({ ref, ...props }: LabelProps) {
  [props, ref] = useContextProps(props, ref ?? null, LabelContext);

  const { children, className, isDisabled, isRequired, ...rest } = props;

  return (
    <AriaLabel
      {...rest}
      className={LabelStyles({ className })}
      data-disabled={isDisabled || null}
      data-required={isRequired || null}
    >
      {children}
      {!isRequired && ' (optional)'}
    </AriaLabel>
  );
}
