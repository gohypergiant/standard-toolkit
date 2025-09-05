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
/** biome-ignore-all lint/correctness/useUniqueElementIds: ids are unique for these tests */

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AriaHeading } from '../aria';
import { Button } from '../button';
import { Element } from '../element';
import { TabPanel, TabPanels } from '../tabs';
import { Drawer, DrawerDialog, DrawerTab, DrawerTabList } from './';
import type { DrawerProps } from './types';

function setup(props: Partial<DrawerProps> = {}) {
  render(
    <Drawer {...props}>
      <DrawerTabList>
        <DrawerTab id='a'>Foo</DrawerTab>
      </DrawerTabList>
      <DrawerDialog>
        <Element slot='header'>
          <AriaHeading slot='title'>Hello</AriaHeading>
          <Button slot='close'>Close</Button>
        </Element>
        <Element slot='content'>
          <TabPanels>
            <TabPanel id='a'>
              <p>Bar</p>
            </TabPanel>
          </TabPanels>
        </Element>
        <Element slot='footer'>Footer</Element>
      </DrawerDialog>
    </Drawer>,
  );

  return props;
}

describe('Drawer', () => {
  it('should render', () => {
    setup();

    expect(screen.getByText('Foo')).toBeInTheDocument();
    expect(screen.getByText('Bar')).toBeInTheDocument();
  });
});
