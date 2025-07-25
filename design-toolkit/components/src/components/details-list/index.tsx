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

import type { ComponentProps } from 'react';
import { createContext, useContext } from 'react';
import { DetailsListStyles } from './styles';
import type { DetailsListProps } from './types';

type Justify = 'left' | 'center' | 'right';

// Context to pass styling variants to child components
const DetailsListContext = createContext<{
  justifyLabel?: Justify;
  justifyValue?: Justify;
}>({});

/**
 * A semantic details list component for displaying metadata in key-value pairs.
 * Uses CSS Grid layout with labels in the first column and values in the second column.
 * Perfect for map object details, user profiles, or any structured information.
 *
 * @example
 * ```tsx
 * <DetailsList
 *   justifyLabel="right"
 *   justifyValue="center"
 *   spacing="large"
 * >
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
 *
 * Props for the DetailsList component
 *
 * @param justifyLabel - Horizontal text alignment for labels ('left' | 'center' | 'right')
 * @param justifyValue - Horizontal text alignment for values ('left' | 'center' | 'right')
 * @param spacing - Grid gap spacing between items ('small' | 'medium' | 'large')
 * @param children - React children (DetailsList.Label and DetailsList.Value components)
 * @param className - Additional CSS classes to apply to the dl element
 */
export function DetailsList({
  children,
  className,
  justifyLabel,
  justifyValue,
  spacing,
  ...props
}: DetailsListProps) {
  const styles = DetailsListStyles({
    justifyLabel,
    justifyValue,
    spacing,
  });

  return (
    <DetailsListContext.Provider value={{ justifyLabel, justifyValue }}>
      <dl className={styles.list({ className })} {...props}>
        {children}
      </dl>
    </DetailsListContext.Provider>
  );
}

/**
 * Label component for a details list item. Renders as a `<dt>` element.
 */
DetailsList.Label = function DetailsListLabel({
  children,
  className,
  ...props
}: ComponentProps<'dt'>) {
  const { justifyLabel, justifyValue } = useContext(DetailsListContext);
  const styles = DetailsListStyles({ justifyLabel, justifyValue });

  return (
    <dt className={styles.label({ className })} {...props}>
      {children}
    </dt>
  );
};

/**
 * Value component for a details list item. Renders as a `<dd>` element.
 * Multiple values can be associated with a single label.
 */
DetailsList.Value = function DetailsListValue({
  children,
  className,
  ...props
}: ComponentProps<'dd'>) {
  const { justifyLabel, justifyValue } = useContext(DetailsListContext);
  const styles = DetailsListStyles({ justifyLabel, justifyValue });

  return (
    <dd className={styles.value({ className })} {...props}>
      {children}
    </dd>
  );
};
