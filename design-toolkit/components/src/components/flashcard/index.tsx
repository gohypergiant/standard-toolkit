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
import type { FlashcardDetailContainerProps, FlashcardProps } from './types';

export const FlashcardContext = createContext<FlashcardProps>({
  isLoading: false,
});

export function Flashcard(props: FlashcardProps) {
  const { isLoading, children, ...rest } = props;

  return (
    <FlashcardContext.Provider value={{ isLoading }}>
      <div
        className='rounded-medium min-w-[128px] outline outline-interactive-hover'
        {...rest}
      >
        {children}
      </div>
    </FlashcardContext.Provider>
  );
}
Flashcard.displayName = 'Flashcard';

export function FlashcardHero(props: PropsWithChildren) {
  const { children, ...rest } = props;
  const context = useContext(FlashcardContext);

  if (context?.isLoading) {
    return (
      <div className='gap-s bg-surface-muted p-s' {...rest}>
        <Skeleton />
        <Skeleton />
      </div>
    );
  }

  return (
    <div className='gap-s bg-surface-muted p-s' {...rest}>
      {children}
    </div>
  );
}
FlashcardHero.displayName = 'FlashcardHero';

export function FlashcardIdentifier(props: PropsWithChildren) {
  const { children, ...rest } = props;

  return (
    <div className='flex flex-col'>
      <div className='fg-primary-bold text-body-m' {...rest}>
        {children}
      </div>
      {/* TODO: Flashcard.HeroIdentifierLabel? What is this for. */}
      <div className='fg-primary-muted text-body-xs'>DATA</div>
    </div>
  );
}
FlashcardIdentifier.displayName = 'FlashcardIdentifier';

export function FlashcardSecondaryContainer(props: PropsWithChildren) {
  const { children, ...rest } = props;

  return (
    <div className='flex flex-col gap-s p-s' {...rest}>
      {children}
    </div>
  );
}
FlashcardSecondaryContainer.displayName = 'FlashcardSecondaryContainer';

export function FlashcardSecondaryDetails(props: PropsWithChildren) {
  const { children, ...rest } = props;
  return (
    <div className='flex flex-col spacing-xxs' {...rest}>
      {children}
    </div>
  );
}
FlashcardSecondaryDetails.displayName = 'FlashcardSecondaryDetails';

export function FlashcardSecondaryData(props: PropsWithChildren) {
  const { children, ...rest } = props;

  return (
    <h2 className='fg-primary-muted text-body-xs' {...rest}>
      {children}
    </h2>
  );
}
FlashcardSecondaryData.display = 'FlashcardSecondaryData';

export function FlashcardDetailsContainer(
  props: FlashcardDetailContainerProps,
) {
  const { details, classNames } = props;
  if (!(details && details.length)) {
    return null;
  }

  return details
    .splice(0, 5)
    .map((item) => (
      <FlashcardDetail
        label={item.label}
        value={item.value}
        key={item.label}
        className={classNames?.detail}
      />
    ));
}

function FlashcardDetail(props: FlashcardDetailProps) {
  const { label, value, ...rest } = props;

  return (
    <div className='flex flex-row justify-between text-body-xs' {...rest}>
      <div className='fg-primary-muted'>{label}</div>
      <div className='fg-primary-bold'>{value}</div>
    </div>
  );
}
FlashcardDetail.displayName = 'FlashcardDetail';
