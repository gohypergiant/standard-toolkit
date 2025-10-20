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

import type { PropsWithChildren } from 'react';

export type BasePaginationProps = PropsWithChildren & {
  pageCount?: number;
  currentPage?: number;
  classNames?: {
    container?: string;
    controls?: string;
    pages?: string;
  };
  onChange?: (nextPage: number) => void;
};

export type PaginationNavProps = {
  className?: string;
  onPress?: () => void;
};

export type PageNumberContainerProps = {
  className?: string;
  onPress?: (pageNumber: number) => void;
};

export type PaginationPageNumberProps = {
  className?: string;
  pageNumber: number;
  isSelected: boolean;
  onPress?: () => void;
};

export type PaginationRange = {
  minRange: number;
  maxRange: number;
};
