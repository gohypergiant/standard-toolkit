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
import type { ContextValue } from 'react-aria-components';
import type { FlashcardMetaData, FlashcardProps } from './types';

const FlashcardContext =
  createContext<ContextValue<FlashcardProps, HTMLDivElement>>(null);

export function Flashcard(props: FlashcardProps) {
  const { isLoading, children, ...rest } = props;

  return (
    <Flashcard.Provider value={{ isLoading }}>
      <div
        className='rounded-[var(--radius-medium)] min-w-[128px] outline outline-interactive-hover'
        {...rest}
      >
        {children}
      </div>
    </Flashcard.Provider>
  );
}
Flashcard.displayName = 'Flashcard';

// TODO: Fix up type.
function FlashcardHero(props: PropsWithChildren) {
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
FlashcardHero.displayName = 'Flashcard.Hero';

function FlashcardIdentifier(props: PropsWithChildren) {
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
FlashcardIdentifier.displayName = 'Flashcard.Identifier';

function FlashcardSecondaryContainer(props: PropsWithChildren) {
  const { children, ...rest } = props;

  return (
    <div className='flex flex-col gap-s p-s' {...rest}>
      {children}
    </div>
  );
}
FlashcardSecondaryContainer.displayName = 'Flashcard.SecondaryContainer';

function FlashcardSecondaryDetails(props: PropsWithChildren) {
  const { children, ...rest } = props;
  return (
    <div className='flex flex-col spacing-xxs' {...rest}>
      {children}
    </div>
  );
}
FlashcardSecondaryDetails.displayName = 'Flashcard.SecondaryDetails';

function FlashcardSecondaryData(props: PropsWithChildren) {
  const { children, ...rest } = props;

  return (
    <h2 className='fg-primary-muted text-body-xs' {...rest}>
      {children}
    </h2>
  );
}
FlashcardSecondaryData.display = 'Flashcard.SecondaryData';

function FlashcardDetails(props: FlashcardMetaData) {
  const { label, value, ...rest } = props;

  return (
    <div className='flex flex-row justify-between text-body-xs' {...rest}>
      <div className='fg-primary-muted'>{label}</div>
      <div className='fg-primary-bold'>{value}</div>
    </div>
  );
}
FlashcardDetails.displayName = 'Flashcard.Details';

Flashcard.Hero = FlashcardHero;
Flashcard.Details = FlashcardDetails;
Flashcard.Identifier = FlashcardIdentifier;
Flashcard.SecondaryData = FlashcardSecondaryData;
Flashcard.Secondary = FlashcardSecondaryContainer;
Flashcard.SecondaryDetails = FlashcardSecondaryDetails;
Flashcard.Provider = FlashcardContext.Provider;
