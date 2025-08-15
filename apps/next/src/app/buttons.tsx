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
import { Button as DesignSystemButton } from '@accelint/design-system';
import { useTheme } from '@accelint/design-toolkit';
import { Button } from '@accelint/design-toolkit/button';
import { Icon } from '@accelint/design-toolkit/icon';
import Placeholder from '@accelint/icons/placeholder';
import { useCallback } from 'react';

export function Buttons() {
  const theme = useTheme();
  const mode = theme?.mode ?? 'dark';

  const toggleMode = useCallback(() => {
    const mode = theme?.mode ?? 'dark';
    theme?.toggleMode(mode === 'light' ? 'dark' : 'light');
    console.log(theme?.tokens);
  }, [theme]);

  return (
    <>
      <h1 className='text-header-xl text-default-light mb-l'>BUTTONS!!!!</h1>
      <h2 className='text-header-l text-default-light'>
        Design Toolkit buttons
      </h2>
      <div className='p-m flex gap-m items-center mb-l'>
        <Button onPress={toggleMode}>
          <Icon>
            <Placeholder />
          </Icon>
          Toggle Mode
        </Button>
        <Button color='critical'>Critical Button</Button>
        <Button className='bg-advisory-bold hover:bg-advisory-hover text-interactive-default'>
          Custom Button
        </Button>
      </div>
      <h2 className='text-header-l text-default-light'>
        Design System (old!) buttons
      </h2>
      <div className='p-m flex gap-m items-center'>
        <DesignSystemButton color='primary'>Primary Button</DesignSystemButton>
        <DesignSystemButton color='critical'>
          Critical Button
        </DesignSystemButton>
        <DesignSystemButton
          color='primary'
          classNames={{
            button:
              'bg-advisory-bold hover:bg-advisory-hover text-interactive-default',
          }}
        >
          Custom Button
        </DesignSystemButton>
      </div>
    </>
  );
}
