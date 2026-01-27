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
'use client';

import 'client-only';
import { Text } from 'react-aria-components';
import type { DetailsListLabelProps } from './types';

/**
 * DetailsListLabel - Label component for DetailsList key/term.
 *
 * Renders as a `<dt>` element within the DetailsList grid.
 *
 * @param props - The details list label props.
 * @returns The details list label component.
 *
 * @example
 * ```tsx
 * <DetailsList>
 *   <DetailsListLabel>Name</DetailsListLabel>
 *   <DetailsListValue>John Doe</DetailsListValue>
 * </DetailsList>
 * ```
 */
export function DetailsListLabel(props: DetailsListLabelProps) {
  return <Text {...props} elementType='dt' slot='label' />;
}
