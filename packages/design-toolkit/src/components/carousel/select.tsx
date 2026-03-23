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
import styles from './style.module.css';
import type { Key } from 'react-aria-components';
import type { CarouselSelectProps } from './types';

/**
 * Renders a select field component for the carousel.
 *
 * @return {JSX.Element} The rendered select field component.
 */
export function CarouselSelect({ classNames, ...rest }: CarouselSelectProps) {
  const context = useContext(CarouselContext);
  const { items, currentPosition, setCurrentPosition } = context;

  const onChange = (value: Key | null) => {
    const index = items.findIndex((i) => i.uuid === value);
    if (index >= 0) {
      setCurrentPosition(index);
    }
  };

  return (
    <SelectField
      aria-labelledby='select-field'
      value={items[currentPosition]?.title}
      placeholder={items[currentPosition]?.title}
      onChange={onChange}
      classNames={{
        field: styles['select-field'],
        trigger: styles['select-trigger'],
      }}
      {...rest}
    >
      {items.map((item) => (
        <OptionsItem
          textValue={item.title}
          key={item.uuid}
          aria-label={item.title}
          id={item.uuid}
          classNames={classNames?.optionItem}
        >
          {item.title}
        </OptionsItem>
      ))}
    </SelectField>
  );
}
