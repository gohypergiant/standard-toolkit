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

import { COMMON_CONTROL_EXCLUSIONS } from './exclusions';

/**
 * Helper to create consistent parameters for different component types
 */
export const createStandardParameters = (
  type: 'form' | 'overlay' | 'container' | 'content',
) => {
  const baseParams = {
    controls: {
      exclude: [
        ...COMMON_CONTROL_EXCLUSIONS.REACT_PROPS,
        ...COMMON_CONTROL_EXCLUSIONS.ARIA_INTERNAL,
        ...COMMON_CONTROL_EXCLUSIONS.STYLING_PROPS,
        ...COMMON_CONTROL_EXCLUSIONS.EVENT_HANDLERS,
      ],
    },
  };

  switch (type) {
    case 'form':
      return {
        ...baseParams,
        controls: {
          ...baseParams.controls,
          exclude: [
            ...baseParams.controls.exclude,
            ...COMMON_CONTROL_EXCLUSIONS.FORM_PROPS,
          ],
        },
      };

    case 'overlay':
      return {
        ...baseParams,
        layout: 'fullscreen',
        controls: {
          ...baseParams.controls,
          exclude: [
            ...baseParams.controls.exclude,
            'parentRef',
            'isDismissable',
            'isKeyboardDismissDisabled',
          ],
        },
      };

    case 'container':
      return {
        ...baseParams,
        layout: 'padded',
      };

    default:
      return baseParams;
  }
};
