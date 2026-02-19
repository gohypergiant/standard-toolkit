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

import type { LinkProps } from '@accelint/design-toolkit';
import { Link } from '@accelint/design-toolkit';
import {
  createInteractiveVisualTests,
  generateVariantMatrix,
} from '~/visual-regression/vitest';

const linkVariants = generateVariantMatrix<LinkProps>({
  dimensions: {
    allowsVisited: [true, false],
    isVisited: [true, false],
    isDisabled: [true, false],
  },
  baseProps: {
    children: 'Example Link',
  },
});

createInteractiveVisualTests({
  componentName: 'Link',
  renderComponent: (props) => <Link {...props} />,
  testId: 'test-link',
  variants: linkVariants,
  states: ['hover', 'focus', 'disabled', 'default'],
});
