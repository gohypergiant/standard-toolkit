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
import { createContext } from 'react';
import {
  type ContextValue,
  DEFAULT_SLOT,
  Text,
  TextContext,
  useContextProps,
} from 'react-aria-components';
import { DetailsListStyles, DetailsListStylesDefaults } from './styles';
import type { ProviderProps } from '@/lib/types';
import type {
  DetailsListLabelProps,
  DetailsListProps,
  DetailsListValueProps,
} from './types';

const { list, label, value } = DetailsListStyles();

export const DetailsListContext =
  createContext<ContextValue<DetailsListProps, HTMLDListElement>>(null);

function DetailsListProvider({
  children,
  ...props
}: ProviderProps<DetailsListProps>) {
  return (
    <DetailsListContext.Provider value={props}>
      {children}
    </DetailsListContext.Provider>
  );
}
DetailsListProvider.displayName = 'DetailsListProvider.Provider';

function DetailsListLabel(props: DetailsListLabelProps) {
  return <Text {...props} elementType='dt' slot='label' />;
}
DetailsListLabel.displayName = 'DetailsList.Label';

function DetailsListValue(props: DetailsListValueProps) {
  return <Text {...props} elementType='dd' slot='value' />;
}
DetailsListValue.displayName = 'DetailsList.Value';

/**
 * A semantic details list component for displaying metadata in key-value pairs.
 * Uses CSS Grid layout with labels in the first column and values in the second column.
 * Perfect for map object details, user profiles, or any structured information.
 *
 * @example
 * ```tsx
 * <DetailsList align="left">
 *   <DetailsList.Label>Key</DetailsList.Label>
 *   <DetailsList.Value>Value</DetailsList.Value>
 *
 *   <DetailsList.Label>Ships</DetailsList.Label>
 *   <DetailsList.Value>Millennium Falcon</DetailsList.Value>
 *   <DetailsList.Value>USS Enterprise NCC-1701</DetailsList.Value>
 *   <DetailsList.Value>Serenity</DetailsList.Value>
 *
 *   <DetailsList.Label>Coordinates</DetailsList.Label>
 *   <DetailsList.Value>
 *     <div>Great Pyramid of Giza: 29°58'44" N 31°08'02" E</div>
 *     <div>Machu Picchu: 13°09'47" S 72°32'41" W</div>
 *     <div>Colosseum: 41°53'24" N 12°29'32" E</div>
 *     <div>Taj Mahal: 27°10'30" N 78°02'31" E</div>
 *   </DetailsList.Value>
 * </DetailsList>
 * ```
 * ## Child Component Behavior
 * - **DetailsList.Label**: Minimum of 1
 * - **DetailsList.Value**: Minimum of 1
 */
export function DetailsList({ ref, ...props }: DetailsListProps) {
  [props, ref] = useContextProps(props, ref ?? null, DetailsListContext);

  const {
    children,
    classNames,
    align = DetailsListStylesDefaults.align,
    ...rest
  } = props;

  return (
    <TextContext
      value={{
        slots: {
          [DEFAULT_SLOT]: {},
          label: { className: label({ className: classNames?.label, align }) },
          value: { className: value({ className: classNames?.value, align }) },
        },
      }}
    >
      <dl {...rest} className={list({ className: classNames?.list, align })}>
        {children}
      </dl>
    </TextContext>
  );
}
DetailsList.displayName = 'DetailsList';
DetailsList.Provider = DetailsListProvider;
DetailsList.Label = DetailsListLabel;
DetailsList.Value = DetailsListValue;
