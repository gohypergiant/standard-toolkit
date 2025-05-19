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

import { type PressHookProps, usePress } from '@react-aria/interactions';
import { continuePropagation } from '../../utils/events';
import { mergeProps } from '../../utils/props';

/**
 * The default behavior of usePress is to stop all propagation of press events
 *
 * To allow the more typical behavior of event propagation by default, this hook
 * continues propagation of press events. This allows for nested press event
 * listeners to not block press event listeners higher in the heirarchy
 */
export function usePropagatingPress(props: PressHookProps) {
  return usePress(
    mergeProps(
      {
        onPress: continuePropagation,
        onPressEnd: continuePropagation,
        onPressStart: continuePropagation,
        onPressUp: continuePropagation,
      },
      props,
    ),
  );
}
