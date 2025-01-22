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

import {
  type ButtonClassNames,
  type ButtonState,
  buttonStateVars,
  containerQueries,
  elevationVars,
} from '@accelint/design-system';
import { style } from '@vanilla-extract/css';

type ClassNames = {
  container: string;
  trigger: ButtonClassNames;
};

export const classNames: ClassNames = {
  container: style({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  }),
  trigger: {
    button: style({
      '@container': containerQueries<ButtonState>(buttonStateVars, {
        query: {
          isHovered: true,
        },
        boxShadow: elevationVars.raised.shadow,
      }),
    }),
  },
};
