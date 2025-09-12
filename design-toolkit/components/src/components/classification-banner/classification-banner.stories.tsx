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
  createStandardParameters,
  STANDARD_ARG_TYPES,
} from '^storybook/utils/controls';
import { ClassificationBanner } from './index';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ClassificationBanner> = {
  title: 'Components/ClassificationBanner',
  component: ClassificationBanner,
  parameters: {
    ...createStandardParameters('content'),
    layout: 'fullscreen',
    docs: {
      subtitle:
        'Displays security classification banners for pages and documents.',
    },
  },
  args: {
    children: '',
    variant: 'missing',
  },
  argTypes: {
    children: {
      ...STANDARD_ARG_TYPES.children,
      description:
        'Custom text content (optional - variant provides default text if empty)',
    },
    variant: STANDARD_ARG_TYPES.classificationVariant,
  },
};

export default meta;

export const Default: StoryObj<typeof ClassificationBanner> = {
  render: ClassificationBanner,
};
