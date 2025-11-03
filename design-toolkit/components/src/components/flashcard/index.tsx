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
 *  <Flashcard.Hero>
 *    <Flashcard.Identifier>
 *      {identifier}
 *    </Flashcard.Identifier>
 *  </Flashcard.Hero>
 *  <Flashcard.Secondary>
 *    <Flashcard.SecondaryData>
 *      {secondaryData}
 *    </Flashcard.SecondaryData>
 *
 *     {details.map((key, value) => (
 *      <Flashcard.Details key={key} value={value} />
 *     ))}
 *  </Flashcard.Secondary>
 * </Flashcard>
 */

import { createContext, type PropsWithChildren, useContext } from 'react';
import { Skeleton } from '../skeleton';
import { FlashcardStyles } from './styles';
import type { FlashcardDetailContainerProps, FlashcardProps } from './types';

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
      <div className={container({ className })} {...rest}>
        {children}
      </div>
    </FlashcardContext.Provider>
  );
}
Flashcard.displayName = 'Flashcard';

// TODO: Update type to include className.
export function FlashcardHero(props: PropsWithChildren) {
  const { children, ...rest } = props;
  const { isLoading } = useContext(FlashcardContext);

  if (isLoading) {
    return (
      <div className={hero()} {...rest}>
        <Skeleton />
        <Skeleton className='w-1/2' />
      </div>
    );
  }

  return (
    <div className={hero()} {...rest}>
      {children}
    </div>
  );
}
FlashcardHero.displayName = 'FlashcardHero';

// classNames
export function FlashcardIdentifier(props: PropsWithChildren) {
  const { children, ...rest } = props;

  return (
    <div className={identifier()} {...rest}>
      <div className={header()}>{children}</div>
      {/* TODO: Does this need another subcomponent? */}
      <div className={subHeader()}>DATA</div>
    </div>
  );
}
FlashcardIdentifier.displayName = 'FlashcardIdentifier';

export function FlashcardSecondaryContainer(props: PropsWithChildren) {
  const { children, ...rest } = props;

  return (
    <div className={secondaryContainer()} {...rest}>
      {children}
    </div>
  );
}
FlashcardSecondaryContainer.displayName = 'FlashcardSecondaryContainer';

export function FlashcardSecondaryDetails(props: PropsWithChildren) {
  const { children, ...rest } = props;
  return (
    <div className={secondaryDetails()} {...rest}>
      {children}
    </div>
  );
}
FlashcardSecondaryDetails.displayName = 'FlashcardSecondaryDetails';

export function FlashcardSecondaryData(props: PropsWithChildren) {
  const { children, ...rest } = props;
  const { isLoading } = useContext(FlashcardContext);

  if (isLoading) {
    return null;
  }

  return (
    <h2 className={secondaryData()} {...rest}>
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

  return (
    <div className={detailsContainer()} {...rest}>
      {/* Limit to the first 5 items. Not optimal. */}
      {details.splice(0, 5).map((item) => {
        return (
          <div className={detailsItem()} key={item.label}>
            <div className={detailsLabel()}>
              {isLoading ? <Skeleton /> : item.label}
            </div>
            <div className={detailsValue()}>
              {isLoading ? <Skeleton /> : item.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}
FlashcardDetailsContainer.displayName = 'FlashcardDetailsContainer';
