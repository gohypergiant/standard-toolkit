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

import { tv } from '@accelint/design-foundation/lib/utils';

export const FlashcardStyles = tv({
  slots: {
    container:
      'min-w-[128px] rounded-medium font-display outline outline-interactive-hover',
    hero: 'flex flex-col gap-s bg-surface-muted p-s',
    identifier: 'flex flex-col',
    header: 'fg-primary-bold text-body-m',
    subHeader: 'fg-primary-muted text-body-xs',
    secondaryContainer: 'flex flex-col gap-s p-s',
    secondaryData: 'fg-primary-muted text-body-xs',
    detailsContainer: 'flex w-full flex-col justify-between text-body-xs',
    detailsItem: 'flex w-full flex-row justify-between text-body-xs',
    detailsLabel: 'fg-primary-muted',
    detailsValue: 'fg-primary-bold',
    skeleton: 'min-h-[8px] py-0',
  },
});
