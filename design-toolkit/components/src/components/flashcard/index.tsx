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

/**
 * Example usage.
 *
 * <Flashcard>
 *  <FlashcardHero>
 *    <FlashcardIdentifier>
 *      <FlashcardHeader>
 *        {header}
 *      </FlashcardHeader>
 *      <FlashcardSubheader>
 *        {subHeader}
 *      </FlashcardSubheader>
 *    </FlashcardIdentifier>
 *  </FlashcardHero>
 *  <FlashcardSecondary>
 *    <FlashcardSecondaryData>
 *      {secondaryData}
 *    </FlashcardSecondaryData>
 *    <FlashcardDetailsContainer details={details} />
 *  </FlashcardSecondary>
 * </Flashcard>
 */

import { createContext, useContext } from 'react';
import { Skeleton } from '../skeleton';
import { FlashcardStyles } from './styles';
import type {
  FlashcardComponentProps,
  FlashcardDetailContainerProps,
  FlashcardProps,
} from './types';

const {
  container,
  hero,
  identifier,
  header,
  subHeader,
  secondaryContainer,
  secondaryDetails,
  secondaryData,
  detailsContainer,
  detailsItem,
  detailsLabel,
  detailsValue,
} = FlashcardStyles();

export const FlashcardContext = createContext<FlashcardProps>({
  isLoading: false,
});

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
      <div {...rest} className={hero({ className })}>
        <Skeleton />
        <Skeleton className='w-1/2' />
      </div>
    );
  }

  return (
    <div {...rest} className={hero()}>
      {children}
    </div>
  );
}
FlashcardHero.displayName = 'FlashcardHero';

// classNames
export function FlashcardIdentifier(props: FlashcardComponentProps) {
  const { children, className, ...rest } = props;

  return (
    <div {...rest} className={identifier({ className })}>
      {children}
    </div>
  );
}
FlashcardIdentifier.displayName = 'FlashcardIdentifier';

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

export function FlashcardSecondaryContainer(props: FlashcardComponentProps) {
  const { children, className, ...rest } = props;

  return (
    <div {...rest} className={secondaryContainer({ className })}>
      {children}
    </div>
  );
}
FlashcardSecondaryContainer.displayName = 'FlashcardSecondaryContainer';

export function FlashcardSecondaryDetails(props: FlashcardComponentProps) {
  const { children, className, ...rest } = props;
  return (
    <div {...rest} className={secondaryDetails({ className })}>
      {children}
    </div>
  );
}
FlashcardSecondaryDetails.displayName = 'FlashcardSecondaryDetails';

export function FlashcardSecondaryData(props: FlashcardComponentProps) {
  const { children, className, ...rest } = props;
  const { isLoading } = useContext(FlashcardContext);

  // While loading, don't display.
  if (isLoading) {
    return null;
  }

  return (
    <h2 {...rest} className={secondaryData({ className })}>
      {children}
    </h2>
  );
}
FlashcardSecondaryData.display = 'FlashcardSecondaryData';

export function FlashcardDetailsContainer(
  props: FlashcardDetailContainerProps,
) {
  const { details, classNames, ...rest } = props;
  const { isLoading } = useContext(FlashcardContext);

  if (!details?.length) {
    return null;
  }

  const displayDetails = [...details].splice(0, 5);

  return (
    <div
      {...rest}
      className={detailsContainer({ className: classNames?.container })}
    >
      {/* Limit to the first 5 items in details array.*/}
      {displayDetails.map((item) => {
        return (
          <div
            className={detailsItem({ className: classNames?.item })}
            key={item.label}
          >
            <div className={detailsLabel({ className: classNames?.label })}>
              {isLoading ? <Skeleton className='my-xxs py-xxs' /> : item.label}
            </div>
            <div className={detailsValue({ className: classNames?.value })}>
              {isLoading ? <Skeleton className='my-xxs py-xxs' /> : item.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}
FlashcardDetailsContainer.displayName = 'FlashcardDetailsContainer';
