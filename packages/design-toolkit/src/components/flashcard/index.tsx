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
import { createContext, useContext } from 'react';
import { DetailsList } from '../details-list';
import { DetailsListLabel } from '../details-list/label';
import { DetailsListValue } from '../details-list/value';
import { Skeleton } from '../skeleton';
import { FlashcardStyles } from './styles';
import type {
  FlashcardComponentProps,
  FlashcardDetailsListProps,
  FlashcardProps,
} from './types';

const {
  container,
  hero,
  header,
  subHeader,
  flashcardData,
  detailsList,
  detailsLabel,
  detailsValue,
  skeleton,
} = FlashcardStyles();

export const FlashcardContext = createContext<FlashcardProps>({
  isLoading: false,
});

/**
 * Example usage.
 *
 * <Flashcard isLoading={isLoading}>
 *  <FlashcardHero>
 *    <FlashcardHeader>
 *      {header}
 *    </FlashcardHeader>
 *    <FlashcardSubheader>
 *      {subHeader}
 *    </FlashcardSubheader>
 *  </FlashcardHero>
 *  <FlashcardAdditionalData>
 *    {secondaryData}
 *  </FlashcardAdditionalData>
 *  <FlashcardDetailsContainer details={details} />
 * </Flashcard>
 */
export function Flashcard(props: FlashcardProps) {
  const { isLoading, children, className, ...rest } = props;

  return (
    <FlashcardContext.Provider value={{ isLoading }}>
      <div {...rest} className={container({ className })}>
        {children}
      </div>
    </FlashcardContext.Provider>
  );
}
Flashcard.displayName = 'Flashcard';

export function FlashcardHero(props: FlashcardComponentProps) {
  const { children, className, ...rest } = props;
  const { isLoading } = useContext(FlashcardContext);

  if (isLoading) {
    return (
      <div {...rest} className={hero({ className: 'gap-s' })}>
        <Skeleton className={skeleton()} data-testid='hero-skeleton' />
        <Skeleton className={skeleton({ className: 'max-w-1/2' })} />
      </div>
    );
  }

  return (
    <div {...rest} className={hero({ className })}>
      {children}
    </div>
  );
}
FlashcardHero.displayName = 'FlashcardHero';

export function FlashcardHeader(props: FlashcardComponentProps) {
  const { children, className, ...rest } = props;

  return (
    <div {...rest} className={header({ className })}>
      {children}
    </div>
  );
}
FlashcardHeader.displayName = 'FlashcardHeader';

export function FlashcardSubheader(props: FlashcardComponentProps) {
  const { children, className, ...rest } = props;

  return (
    <div {...rest} className={subHeader({ className })}>
      {children}
    </div>
  );
}
FlashcardSubheader.displayName = 'FlashcardSubheader';

export function FlashcardAdditionalData(props: FlashcardComponentProps) {
  const { children, className, ...rest } = props;
  const { isLoading } = useContext(FlashcardContext);

  // While loading, don't display.
  if (isLoading) {
    return null;
  }

  return (
    <div {...rest} className={flashcardData({ className })}>
      {children}
    </div>
  );
}
FlashcardAdditionalData.displayName = 'FlashcardAdditionalData';

export function FlashcardDetailsList(props: FlashcardDetailsListProps) {
  const { children, className, ...rest } = props;
  return (
    // TODO: Update props to include classnames, what is wrong with ...rest?
    <DetailsList
      {...rest}
      align='justify'
      classNames={{ list: detailsList({ className }) }}
    >
      {children}
    </DetailsList>
  );
}
FlashcardDetailsList.displayName = 'FlashcardDetailsList';

export function FlashcardDetailLabel(props: FlashcardComponentProps) {
  const { isLoading } = useContext(FlashcardContext);
  const { className, children, ...rest } = props;
  return (
    <DetailsListLabel {...rest} className={detailsLabel({ className })}>
      {isLoading ? (
        <Skeleton className={skeleton({ className: 'my-xxs' })} />
      ) : (
        children
      )}
    </DetailsListLabel>
  );
}
FlashcardDetailLabel.displayName = 'FlashcardDetailLabel';

export function FlashcardDetailValue(props: FlashcardComponentProps) {
  const { isLoading } = useContext(FlashcardContext);
  const { className, children, ...rest } = props;
  return (
    <DetailsListValue {...rest} className={detailsValue({ className })}>
      {isLoading ? (
        <Skeleton className={skeleton({ className: 'my-xxs' })} />
      ) : (
        children
      )}
    </DetailsListValue>
  );
}
FlashcardDetailValue.displayName = 'FlashcardDetailValue';
