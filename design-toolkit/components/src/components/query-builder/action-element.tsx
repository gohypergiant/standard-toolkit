// __private-exports
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

import type { PressEvent } from '@react-types/shared';
import { useCallback, useMemo } from 'react';
import type { ActionProps } from 'react-querybuilder';
import { Button } from '../button';
import { pressToMouseEvent } from './utils';

export function ActionElement({
  disabled,
  disabledTranslation,
  title: titleProp,
  handleOnClick,
}: ActionProps) {
  // TODO: remove pressToMouseEvent when design-system is removed
  const handlePress = useCallback(
    (event: PressEvent) => handleOnClick(pressToMouseEvent(event)),
    [handleOnClick],
  );

  const title = useMemo(
    () =>
      disabledTranslation?.title && disabled
        ? disabledTranslation.title
        : titleProp,
    [disabledTranslation?.title, disabled, titleProp],
  );

  return (
    <Button
      isDisabled={disabled && !disabledTranslation}
      onPress={handlePress}
      size='small'
      variant='outline'
    >
      {title}
    </Button>
  );
}
