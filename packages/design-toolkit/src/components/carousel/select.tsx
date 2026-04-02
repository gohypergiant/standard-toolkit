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
import { useContext } from 'react';
import { OptionsItem } from '../options/item';
import { SelectField } from '../select-field';
import { CarouselContext } from './context';
import type { Key } from 'react-aria-components';
import type { CarouselSelectProps } from './types';
import styles from './style.module.css';

/**
 * Renders a dropdown select for navigating the carousel by item title.
 *
 * Displays the current item's title and allows the user to jump to any
 * item in the carousel via a select dropdown.
 *
 * @param props - The select props.
 * @param props.classNames - Custom class names for select elements.
 * @param props.classNames.field - Class names passed to the SelectField.
 * @param props.classNames.optionItem - Class names passed to each OptionsItem.
 * @returns The carousel select component.
 *
 * @example
 * ```tsx
 * <CarouselSelect />
 * ```
 */
export function CarouselSelect({ classNames, ...rest }: CarouselSelectProps) {
  const { items, currentPosition, setCurrentPosition } =
    useContext(CarouselContext);

  const onChange = (key: Key | null) => {
    const index = items.findIndex((i) => i.id === key);
    if (index >= 0) {
      setCurrentPosition(index);
    }
  };

  return (
    <SelectField
      aria-label='Carousel item select'
      value={items[currentPosition]?.title}
      placeholder={items[currentPosition]?.title}
      onChange={onChange}
      classNames={{
        field: styles['gallery-select'],
        trigger: styles['gallery-select'],
        ...classNames?.select,
      }}
      {...rest}
    >
      {items.map((item) => (
        <OptionsItem
          textValue={item.title}
          key={item.id}
          aria-label={item.title}
          id={item.id}
          classNames={classNames?.optionItem}
        >
          {item.title}
        </OptionsItem>
      ))}
    </SelectField>
  );
}
