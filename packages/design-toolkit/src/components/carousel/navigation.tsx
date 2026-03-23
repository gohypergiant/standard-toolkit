/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
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
import { clsx } from '@accelint/design-foundation/lib/utils';
import ChevronLeft from '@accelint/icons/chevron-left';
import ChevronRight from '@accelint/icons/chevron-right';
import { useContext } from 'react';
import { Button } from '../button';
import { Icon } from '../icon';
import { CarouselContext } from './context';
import styles from './style.module.css';
import type { CarouselControlProps, CarouselNavigationProps } from './types';

/**
 * Renders a navigation button for a carousel.
 *
 * @param {CarouselNavigationProps} props - The props for the CarouselNavigation component.
 * @param {string} props.direction - The direction of the navigation button.
 * @param {Function} props.onClick - The click event handler.
 * @param {boolean} props.isDisabled - Whether the button is disabled.
 * @param {string} props.className - The class name for the navigation button.
 * @return {JSX.Element} The rendered CarouselNavigation component.
 */
function CarouselNavigation({
  direction,
  onClick,
  isDisabled,
  className,
  ...rest
}: CarouselNavigationProps) {
  return (
    <Button
      onClick={onClick}
      className={clsx(styles.button, className)}
      variant='flat'
      isDisabled={isDisabled}
      {...rest}
    >
      <Icon>{direction === 'left' ? <ChevronLeft /> : <ChevronRight />}</Icon>
    </Button>
  );
}

/**
 * Renders a navigation button for a carousel, allowing the user to go to the previous item.
 *
 * @return {JSX.Element} The rendered CarouselPrevious component.
 * @param {string} props.className - The class name for the navigation button.
 */
export function CarouselPrevious({ className, ...rest }: CarouselControlProps) {
  const context = useContext(CarouselContext);
  const { currentPosition, setCurrentPosition } = context;

  const onClick = () => {
    if (currentPosition - 1 >= 0) {
      setCurrentPosition(currentPosition - 1);
    }
  };

  return (
    <CarouselNavigation
      direction='left'
      onClick={onClick}
      isDisabled={currentPosition === 0}
      className={className}
      {...rest}
    />
  );
}

/**
 * Renders a navigation button for a carousel, allowing the user to go to the next item.
 *
 * @return {JSX.Element} The rendered CarouselNext component.
 * @param {string} props.className - The class name for the navigation button.
 */
export function CarouselNext({ className, ...rest }: CarouselControlProps) {
  const context = useContext(CarouselContext);
  const { currentPosition, setCurrentPosition, items } = context;

  const onClick = () => {
    if (currentPosition + 1 < items.length) {
      setCurrentPosition(currentPosition + 1);
    }
  };

  return (
    <CarouselNavigation
      direction='right'
      onClick={onClick}
      isDisabled={currentPosition === items.length - 1}
      className={className}
      {...rest}
    />
  );
}
