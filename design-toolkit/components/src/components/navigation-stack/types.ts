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

import type { FocusableElement } from '@react-types/shared';
import type {
  DOMAttributes,
  Key,
  ReactElement,
  ReactNode,
  RefAttributes,
} from 'react';
import type { LiteralUnion } from 'type-fest';

export type NavigationStackProps = RefAttributes<HTMLDivElement> & {
  children?: ReactNode;
  defaultViewId?: string;
  className?: string;
};

export type NavigationStackViewProps = RefAttributes<HTMLDivElement> & {
  id: string;
  children: ReactNode;
};

export type NavigationStackNavigateProps = {
  children: ReactElement<DOMAttributes<FocusableElement>, string>;
  /**
   * The string is to be used as a childId. When for is a childId
   * navigate will push the childId onto the stack.
   * */
  for: LiteralUnion<'back' | 'clear', string>;
};

export type NavigationStackContextValue = {
  currentViewId: Key | null;
  pushView: (viewId: string) => void;
  popView: () => void;
  clear: () => void;
  canGoBack: boolean;
  viewStack: string[];
};
