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

/**
 * Context for sharing Flashcard state across child components.
 */
export const FlashcardContext = createContext<FlashcardProps>({
  isLoading: false,
  header: '',
  subheader: '',
});

/**
 * Flashcard - A quick visual identifier for map entity data.
 *
 * Container component that provides loading state and header/subheader
 * to child components via context.
 *
 * @param props - {@link FlashcardProps}
 * @param props.isLoading - Whether the flashcard is in a loading state.
 * @param props.header - Primary header text.
 * @param props.subheader - Secondary text below the header.
 * @param props.children - Child components to render.
 * @param props.className - Optional CSS class name.
 * @returns The rendered Flashcard component.
 *
 * @example
 * ```tsx
 * <Flashcard isLoading={false} header="Identifier" subheader="DATA">
 *   <FlashcardHero />
 *   <FlashcardAdditionalData>Secondary info</FlashcardAdditionalData>
 *   <FlashcardDetailsList>
 *     <FlashcardDetailsLabel>Status</FlashcardDetailsLabel>
 *     <FlashcardDetailsValue>Active</FlashcardDetailsValue>
 *   </FlashcardDetailsList>
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

/**
 * FlashcardHero - Upper section displaying header and subheader.
 *
 * Reads header and subheader from Flashcard context. Shows skeleton
 * placeholders when the parent Flashcard has isLoading=true.
 *
 * @param props - {@link FlashcardComponentProps}
 * @param props.children - Optional child content.
 * @param props.className - Optional CSS class name.
 * @returns The rendered FlashcardHero component.
 *
 * @example
 * ```tsx
 * <Flashcard header="Entity Name" subheader="Type">
 *   <FlashcardHero />
 * </Flashcard>
 * ```
 */
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

/**
 * FlashcardAdditionalData - Secondary data section below the hero.
 *
 * Hidden when the parent Flashcard has isLoading=true.
 *
 * @param props - {@link FlashcardComponentProps}
 * @param props.children - Content to display in the section.
 * @param props.className - Optional CSS class name.
 * @returns The rendered FlashcardAdditionalData component, or null if loading.
 *
 * @example
 * ```tsx
 * <Flashcard header="Entity" subheader="Data">
 *   <FlashcardHero />
 *   <FlashcardAdditionalData>
 *     Last updated: 2024-01-15
 *   </FlashcardAdditionalData>
 * </Flashcard>
 * ```
 */
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

/**
 * FlashcardDetailsList - Wrapper for key-value detail pairs.
 *
 * Wraps DetailsList with justify alignment for flashcard styling.
 *
 * @param props - {@link FlashcardDetailsListProps}
 * @param props.children - FlashcardDetailsLabel and FlashcardDetailsValue pairs.
 * @param props.className - Optional CSS class name.
 * @returns The rendered FlashcardDetailsList component.
 *
 * @example
 * ```tsx
 * <Flashcard header="Aircraft" subheader="Entity">
 *   <FlashcardHero />
 *   <FlashcardDetailsList>
 *     <FlashcardDetailsLabel>Status</FlashcardDetailsLabel>
 *     <FlashcardDetailsValue>Active</FlashcardDetailsValue>
 *     <FlashcardDetailsLabel>Speed</FlashcardDetailsLabel>
 *     <FlashcardDetailsValue>450 kts</FlashcardDetailsValue>
 *   </FlashcardDetailsList>
 * </Flashcard>
 * ```
 */
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

/**
 * FlashcardDetailsLabel - Label for detail items.
 *
 * Shows skeleton placeholder when the parent Flashcard has isLoading=true.
 *
 * @param props - {@link FlashcardComponentProps}
 * @param props.children - Label text content.
 * @param props.className - Optional CSS class name.
 * @returns The rendered FlashcardDetailsLabel component.
 *
 * @example
 * ```tsx
 * <FlashcardDetailsList>
 *   <FlashcardDetailsLabel>Status</FlashcardDetailsLabel>
 *   <FlashcardDetailsValue>Active</FlashcardDetailsValue>
 * </FlashcardDetailsList>
 * ```
 */
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

/**
 * FlashcardDetailsValue - Value for detail items.
 *
 * Shows skeleton placeholder when the parent Flashcard has isLoading=true.
 *
 * @param props - {@link FlashcardComponentProps}
 * @param props.children - Value text content.
 * @param props.className - Optional CSS class name.
 * @returns The rendered FlashcardDetailsValue component.
 *
 * @example
 * ```tsx
 * <FlashcardDetailsList>
 *   <FlashcardDetailsLabel>Type</FlashcardDetailsLabel>
 *   <FlashcardDetailsValue>Aircraft</FlashcardDetailsValue>
 * </FlashcardDetailsList>
 * ```
 */
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
