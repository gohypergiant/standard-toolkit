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
 *    {identifier}
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

import type { FlashcardProps } from './types';

export function Flashcard(props: FlashcardProps) {
  const { children, ...rest } = props;

  return (
    <div
      className='radius-small w-[361px] outline outline-interactive-hover'
      {...rest}
    >
      {children}
    </div>
  );
}
Flashcard.displayName = 'Flashcard';

// TODO: types
function FlashcardHero(props: any) {
  const { children, ...rest } = props;

  <div className='padding-s gap-s bg-surface-muted' {...rest}>
    {children}
  </div>;
}
FlashcardHero.displayName = 'Flashcard.Hero';

// TODO: Types
function FlashcardIdentifier(props: any) {
  const { children, ...rest } = props;

  return (
    <div className='flex flex-col'>
      <h1 className='fg-primary-bold text-body-m' {...rest}>
        {children}
      </h1>
      {/* TODO: What is this subheader for? Does it need to be a subcomponent? */}
      <h2 className='fg-primary-muted text-body-xs'>DATA</h2>
    </div>
  );
}
FlashcardIdentifier.displayName = 'Flashcard.Identifier';

// TODO: types
function _FlashcardSecondary(props: any) {
  const { children, ...rest } = props;

  return (
    <div className='padding-s flex flex-col gap-s' {...rest}>
      {children}
    </div>
  );
}

function FlashcardSecondaryData(props: any) {
  const { children, ...rest } = props;

  return (
    <h2 className='fg-primary-muted padding-s gap-s text-body-xs' {...rest}>
      {children}
    </h2>
  );
}
FlashcardSecondaryData.display = 'Flashcard.SecondaryData';

function FlashcardDetails(props: any) {
  const { key, value, ...rest } = props;

  <div className='flex flex-row justify-between text-body-xs' {...rest}>
    <span className='fg-primary-muted'>{key}</span>
    <span className='fg-primary-bold'>{value}</span>
  </div>;
}
FlashcardDetails.displayName = 'Flashcard.Details';

Flashcard.Hero = FlashcardHero;
Flashcard.Details = FlashcardDetails;
Flashcard.Identifier = FlashcardIdentifier;
Flashcard.SecondaryData = FlashcardSecondaryData;
