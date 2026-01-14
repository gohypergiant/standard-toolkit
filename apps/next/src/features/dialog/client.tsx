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

import {
  Button,
  Dialog,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@accelint/design-toolkit';
import { useRef } from 'react';
import { type DialogVariant, PROP_COMBOS } from './variants';

function DialogCard({ size }: DialogVariant) {
  const containerRef = useRef(null);

  return (
    <>
      <DialogTrigger isOpen>
        <Button className='hidden'>Open</Button>
        <Dialog size={size} parentRef={containerRef}>
          <DialogTitle>{size} Dialog</DialogTitle>
          <div className='p-4'>
            <p>This is a {size} dialog example.</p>
          </div>
          <DialogFooter>
            <Button variant='outline'>Cancel</Button>
            <Button>Confirm</Button>
          </DialogFooter>
        </Dialog>
      </DialogTrigger>
      <div ref={containerRef} className='relative min-h-[300px] flex-1' />
    </>
  );
}

function PropCombos() {
  return PROP_COMBOS.map((props) => {
    return <DialogCard key={props.size} size={props.size} />;
  });
}

export function DialogClient() {
  return (
    <div className='flex'>
      <PropCombos />
    </div>
  );
}
