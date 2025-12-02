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
import { clsx } from '@accelint/design-foundation/lib/utils';
import 'client-only';
import { createContext, useContext } from 'react';
import { Heading, Text } from 'react-aria-components';
import { DetailsList } from '../details-list';
import { DetailsListLabel } from '../details-list/label';
import { DetailsListValue } from '../details-list/value';
import { Skeleton } from '../skeleton';
import styles from './styles.module.css';
import type {
  FlashcardComponentProps,
  FlashcardDetailsListProps,
  FlashcardProps,
} from './types';

export const FlashcardContext = createContext<FlashcardProps>({
  isLoading: false,
  header: '',
  subheader: '',
});

/**
 * Example usage.
 *
 * ```tsx
 * <Flashcard isLoading={isLoading} header="Identifier" subheader="DATA">
 *  <FlashcardHero />
 *  <FlashcardAdditionalData>
 *    {secondaryData}
 *  </FlashcardAdditionalData>
 *  <FlashcardDetailsList>
 *    {detail.map((detail) => (
 *     <Fragment key={detail.id}>
 *       <FlashcardDetailsLabel>
 *         {detail.label}
 *       </FlashcardDetailsLabel>
 *       <FlashcardDetailsValue>
 *         {detail.value}
 *       </FlashcardDetailsValue>
 *     </Fragment>
 *     ))}
 *  </FlashcardDetailsList>
 * </Flashcard>
 * ```
 */
export function Flashcard(props: FlashcardProps) {
  const { isLoading, header, subheader, children, className, ...rest } = props;

  return (
    <FlashcardContext.Provider value={{ isLoading, header, subheader }}>
      <div {...rest} className={clsx(styles.container, className)}>
        {children}
      </div>
    </FlashcardContext.Provider>
  );
}
Flashcard.displayName = 'Flashcard';

export function FlashcardHero(props: FlashcardComponentProps) {
  const { children, className, ...rest } = props;
  const { isLoading, header, subheader } = useContext(FlashcardContext);

  if (isLoading) {
    return (
      <div {...rest} className={clsx(styles.hero, className, 'gap-s')}>
        <Skeleton className={styles.skeleton} data-testid='hero-skeleton' />
        <Skeleton className={clsx(styles.skeleton, styles.half)} />
      </div>
    );
  }

  return (
    <div {...rest} className={clsx(styles.hero, className)}>
      <FlashcardHeader className={styles.header}>{header}</FlashcardHeader>
      <FlashcardSubheader className={styles.subheader}>
        {subheader}
      </FlashcardSubheader>
    </div>
  );
}
FlashcardHero.displayName = 'FlashcardHero';

const FlashcardHeader = Heading;
const FlashcardSubheader = Text;

export function FlashcardAdditionalData(props: FlashcardComponentProps) {
  const { children, className, ...rest } = props;
  const { isLoading } = useContext(FlashcardContext);

  // While loading, don't display.
  if (isLoading) {
    return null;
  }

  return (
    <div {...rest} className={clsx(styles.data, className)}>
      {children}
    </div>
  );
}
FlashcardAdditionalData.displayName = 'FlashcardAdditionalData';

export function FlashcardDetailsList(props: FlashcardDetailsListProps) {
  const { children, className, ...rest } = props;
  return (
    <DetailsList
      {...rest}
      align='justify'
      classNames={{ list: clsx(styles['details-list'], className) }}
    >
      {children}
    </DetailsList>
  );
}
FlashcardDetailsList.displayName = 'FlashcardDetailsList';

export function FlashcardDetailsLabel(props: FlashcardComponentProps) {
  const { isLoading } = useContext(FlashcardContext);
  const { className, children, ...rest } = props;
  return (
    <DetailsListLabel
      {...rest}
      className={clsx(styles['details-label'], className)}
    >
      {isLoading ? (
        <Skeleton className={clsx(styles.skeleton, styles.smaller)} />
      ) : (
        children
      )}
    </DetailsListLabel>
  );
}
FlashcardDetailsLabel.displayName = 'FlashcardDetailsLabel';

export function FlashcardDetailsValue(props: FlashcardComponentProps) {
  const { isLoading } = useContext(FlashcardContext);
  const { className, children, ...rest } = props;
  return (
    <DetailsListValue
      {...rest}
      className={clsx(styles['details-value'], className)}
    >
      {isLoading ? (
        <Skeleton className={clsx(styles.skeleton, styles.smaller)} />
      ) : (
        children
      )}
    </DetailsListValue>
  );
}
FlashcardDetailsValue.displayName = 'FlashcardDetailsValue';
