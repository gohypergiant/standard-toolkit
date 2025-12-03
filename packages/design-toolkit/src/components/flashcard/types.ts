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

import type { ComponentPropsWithRef, PropsWithChildren } from 'react';
import type { DetailsListProps } from '../details-list/types';

export type FlashcardComponentProps = PropsWithChildren &
  ComponentPropsWithRef<'div'>;

export type FlashcardProps = FlashcardComponentProps & {
  isLoading?: boolean;
  header: string;
  subheader: string;
};

export type FlashcardDetailsListProps = FlashcardComponentProps &
  Partial<DetailsListProps>;
