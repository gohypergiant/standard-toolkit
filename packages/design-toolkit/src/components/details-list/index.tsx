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
import clsx from 'clsx';
import {
  DEFAULT_SLOT,
  TextContext,
  useContextProps,
} from 'react-aria-components';
import { DetailsListContext } from './context';
import styles from './styles.module.css';
import type { DetailsListProps } from './types';

/**
 * A semantic details list component for displaying metadata in key-value pairs.
 * Uses CSS Grid layout with labels in the first column and values in the second column.
 * Perfect for map object details, user profiles, or any structured information.
 *
 * @example
 * ```tsx
 * <DetailsList align="left">
 *   <DetailsListLabel>Key</DetailsListLabel>
 *   <DetailsListValue>Value</DetailsListValue>
 *
 *   <DetailsListLabel>Ships</DetailsListLabel>
 *   <DetailsListValue>Millennium Falcon</DetailsListValue>
 *   <DetailsListValue>USS Enterprise NCC-1701</DetailsListValue>
 *   <DetailsListValue>Serenity</DetailsListValue>
 *
 *   <DetailsListLabel>Coordinates</DetailsListLabel>
 *   <DetailsListValue>
 *     <div>Great Pyramid of Giza: 29°58'44" N 31°08'02" E</div>
 *     <div>Machu Picchu: 13°09'47" S 72°32'41" W</div>
 *     <div>Colosseum: 41°53'24" N 12°29'32" E</div>
 *     <div>Taj Mahal: 27°10'30" N 78°02'31" E</div>
 *   </DetailsListValue>
 * </DetailsList>
 * ```
 * ## Child Component Behavior
 * - **DetailsListLabel**: Minimum of 1
 * - **DetailsListValue**: Minimum of 1
 */
export function DetailsList({ ref, ...props }: DetailsListProps) {
  [props, ref] = useContextProps(props, ref ?? null, DetailsListContext);

  const { children, classNames, align = 'justify', ...rest } = props;

  return (
    <TextContext
      value={{
        slots: {
          [DEFAULT_SLOT]: {},
          label: {
            className: clsx(styles.label, styles[align], classNames?.label),
          },
          value: {
            className: clsx(styles.value, styles[align], classNames?.value),
          },
        },
      }}
    >
      <dl {...rest} className={clsx(styles.list, classNames?.list)}>
        {children}
      </dl>
    </TextContext>
  );
}
