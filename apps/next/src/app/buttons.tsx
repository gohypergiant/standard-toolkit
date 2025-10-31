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
import { Button } from '@accelint/design-toolkit/components/button/index';
import { Icon } from '@accelint/design-toolkit/components/icon/index';
import Placeholder from '@accelint/icons/placeholder';

export function Buttons() {
  return (
    <>
      <h1 className='text-header-xl text-default-light mb-l'>BUTTONS!!!!</h1>
      <h2 className='text-header-l text-default-light'>
        Design Toolkit buttons
      </h2>
      <div className='p-m flex gap-m items-center mb-l'>
        <Button>
          <Icon>
            <Placeholder />
          </Icon>
          Primary Button
        </Button>
        <Button color='critical'>Critical Button</Button>
        <Button className='bg-advisory-bold hover:bg-advisory-hover fg-info-bold'>
          Custom Button
        </Button>
      </div>
    </>
  );
}
