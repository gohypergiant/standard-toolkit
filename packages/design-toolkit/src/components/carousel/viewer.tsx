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
import { useContext, useEffect, useState } from 'react';
import { clsx } from 'react-querybuilder';
import { CarouselContext } from './context';
import styles from './style.module.css';
import type { CarouselViewerProps } from './types';

export function CarouselViewer({
  children,
  classNames,
  ...rest
}: CarouselViewerProps) {
  const context = useContext(CarouselContext);
  const { items, currentPosition } = context;
  const [currentItem, setCurrentItem] = useState(items[currentPosition]);

  useEffect(() => {
    if (items[currentPosition]?.uuid !== currentItem?.uuid) {
      setCurrentItem(items[currentPosition]);
    }
  }, [currentPosition, items, currentItem]);

  return (
    <div className={clsx(styles.viewer, classNames?.container)} {...rest}>
      <img
        src={currentItem?.dataUrl}
        alt={currentItem?.title}
        className={classNames?.image}
      />
      {children}
    </div>
  );
}
