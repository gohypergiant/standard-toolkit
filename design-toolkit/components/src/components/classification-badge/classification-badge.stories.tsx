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
  createSizeControl,
  createStandardParameters,
  STANDARD_ARG_TYPES,
} from '^storybook/utils/controls';
import { ClassificationBadge } from './';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ClassificationBadge> = {
  title: 'Components/ClassificationBadge',
  component: ClassificationBadge,
  args: {
    children: '',
    size: 'medium',
    variant: 'missing',
  },
  argTypes: {
    children: STANDARD_ARG_TYPES.children,
    size: createSizeControl('COMPACT'),
    variant: STANDARD_ARG_TYPES.classificationVariant,
  },
  parameters: {
    ...createStandardParameters('content'),
    docs: {
      subtitle: 'A badge component for displaying classification levels.',
    },
  },
};

export default meta;

export const Default: StoryObj<typeof ClassificationBadge> = {
  render: ClassificationBadge,
};
