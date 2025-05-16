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

import { Broadcast } from '@accelint/bus';
import { Icon } from '@accelint/design-system';
import { Button } from '@accelint/design-toolkit/button';
import { Add, ExpandWindow } from '@accelint/icons';
import { useCallback, useEffect, useRef, useState } from 'react';

const bus = Broadcast.getInstance();

export function BusExample() {
  // NOTE: state is still local to each page, doing this for example sake
  const [value, setValue] = useState(0);
  const workerRef = useRef<Worker>();

  const doInc = useCallback(() => {
    bus.emit('inc', {});
  }, []);

  const openWindow = useCallback(() => {
    open('/tmp');
  }, []);

  useEffect(() => {
    function inc() {
      setValue((val) => val + 1);
    }

    bus.on('inc', inc);

    return () => {
      bus.off('inc', inc);
    };
  }, []);

  useEffect(() => {
    workerRef.current = new Worker(new URL('./worker.ts', import.meta.url));

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  return (
    <div className='p-xl text-default-light flex flex-col gap-m items-center justify-center w-full'>
      <div className='font-display text-s'>Value: {value}</div>
      <div>
        <Button variant='outline' size='small' onPress={doInc}>
          Increment{' '}
          <Icon>
            <Add />
          </Icon>
        </Button>
      </div>
      <div>
        <Button variant='outline' size='small' onPress={openWindow}>
          New Window{' '}
          <Icon>
            <ExpandWindow />
          </Icon>
        </Button>
      </div>
    </div>
  );
}
