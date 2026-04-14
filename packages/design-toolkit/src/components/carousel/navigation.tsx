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
import type { ButtonProps } from '../button/types';

/**
 * Navigates the carousel to the previous item. Automatically disables when at the first item.
 * Note that it relies on the <Carousel/>
 * component to supply context and must be used as a child of that component.
 *
 * @param props - The control props.
 * @param props.className - Additional CSS class name.
 * @returns The previous navigation button.
 *
 */
export function CarouselPrevious({
  className,
  variant = 'flat',
  isDisabled,
  ...rest
}: ButtonProps) {
  const context = useContext(CarouselContext);
  const { currentPosition, setCurrentPosition } = context;

  const shouldDisablePrevious = currentPosition === 0 || isDisabled;

  const onClick = () => {
    if (currentPosition - 1 >= 0) {
      setCurrentPosition(currentPosition - 1);
    }
  };

  return (
    <Button
      {...rest}
      aria-label='Previous'
      onClick={onClick}
      className={clsx(styles.navigation, className)}
      variant={variant}
      isDisabled={shouldDisablePrevious}
    >
      <Icon>
        <ChevronLeft />
      </Icon>
    </Button>
  );
}

/**
 * Navigates the carousel to the next item. Automatically disables when at the last item.
 * Note that it relies on the <Carousel/> component to supply context and must be used
 * as a child of that component.
 *
 * @param props - The control props.
 * @param props.className - Additional CSS class name.
 * @returns The next navigation button.
 */
export function CarouselNext({
  className,
  variant = 'flat',
  isDisabled,
  ...rest
}: ButtonProps) {
  const context = useContext(CarouselContext);
  const { currentPosition, setCurrentPosition, items } = context;

  const shouldDisableNext = currentPosition === items.length - 1 || isDisabled;

  const onClick = () => {
    if (currentPosition + 1 < items.length) {
      setCurrentPosition(currentPosition + 1);
    }
  };

  return (
    <Button
      {...rest}
      aria-label='Next'
      onClick={onClick}
      className={clsx(styles.navigation, className)}
      variant={variant}
      isDisabled={shouldDisableNext}
    >
      <Icon>
        <ChevronRight />
      </Icon>
    </Button>
  );
}
