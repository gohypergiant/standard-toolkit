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

import type { ComponentPropsWithRef } from 'react';
import type { ButtonProps, ToggleButtonProps } from '../button/types';

export type PaginationContextValue = {
  page: number;
  total: number;
  isLoading?: boolean;
  setPage: (page: number) => void;
};

export type PaginationProps = Omit<
  ComponentPropsWithRef<'nav'>,
  'className' | 'onChange'
> & {
  classNames?: {
    container?: string;
    prev?: ButtonProps['className'];
    pages?: ToggleButtonProps['className'];
    next?: ButtonProps['className'];
  };
  total: number;
  defaultValue?: number;
  value?: number;
  isLoading?: boolean;
  onChange?: (page: number) => void;
};

export type PaginationPagesProps = Pick<ToggleButtonProps, 'className'> & {
  onPress?: (page: number) => void;
};

export type PaginationPrevProps = Pick<ButtonProps, 'className'> & {
  onPress?: (page: number) => void;
};

export type PaginationNextProps = Pick<ButtonProps, 'className'> & {
  onPress?: (page: number) => void;
};
