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

import type { PropsWithChildren } from 'react';

export const PreviewGrid = ({ children }: PropsWithChildren) => {
  return (
    <div className='flex flex-1 flex-col gap-s p-s'>
      <div className='grid auto-rows-min gap-s md:grid-cols-5'>{children}</div>
    </div>
  );
};

const PreviewGridItem = ({ children }: PropsWithChildren) => {
  return (
    <div className='flex justify-center aspect-square items-center bg-surface-raised p-m'>
      {children}
    </div>
  );
};

PreviewGrid.Item = PreviewGridItem;
