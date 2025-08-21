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

import { Button, Icon, LinkButton, useTheme } from '@accelint/design-toolkit';
import { Brightness } from '@accelint/icons';
import { useCallback } from 'react';

export function Nav() {
  const theme = useTheme();
  const mode = theme?.mode ?? 'dark';

  const toggleMode = useCallback(() => {
    theme?.toggleMode(mode === 'light' ? 'dark' : 'light');
  }, [theme, mode]);

  return (
    <div className='fg-info-bold bg-surface-default w-full flex items-center justify-between p-m'>
      <div className='flex items-center gap-m'>
        <LinkButton
          size='xsmall'
          variant='flat'
          className='rounded-none'
          href='/'
        >
          Bus Example
        </LinkButton>
        <LinkButton
          size='xsmall'
          variant='flat'
          className='rounded-none'
          href='/buttons'
        >
          Button Example
        </LinkButton>
      </div>
      <div>
        <Button
          variant='icon'
          onPress={toggleMode}
          className='sudo:fg-primary-bold'
        >
          Theme toggle
          <Icon size='large'>
            <Brightness />
          </Icon>
        </Button>
      </div>
    </div>
  );
}
