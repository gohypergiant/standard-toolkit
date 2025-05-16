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

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { ClassNames } from '../../types';
import { TEST_IDS, Tab, TabList, TabPanel, TabPanels, Tabs } from './';
import type { TabsProps } from './types';

function setup(props: Partial<TabsProps> = {}) {
  render(
    <Tabs {...props}>
      <TabList>
        <Tab id='foo'>Foo</Tab>
        <Tab id='bar'>Bar</Tab>
      </TabList>
      <TabPanels>
        <TabPanel id='foo'>Foo&apos;s Content</TabPanel>
        <TabPanel id='bar'>Bar&apos;s Content</TabPanel>
      </TabPanels>
    </Tabs>,
  );

  return props;
}

describe('Tabs', () => {
  it('should render', () => {
    setup();

    expect(screen.getByText(`Foo's Content`)).toBeInTheDocument();
  });

  it('should pass down classNames', () => {
    setup({ classNames: TEST_IDS });

    // TODO: Likely candidate for test utils
    const list = (function getIds(ids: ClassNames) {
      return Object.values(ids).reduce<string[]>((acc, value) => {
        if (typeof value === 'string') {
          acc.push(value);
        } else {
          acc.push(...getIds(value));
        }

        return acc;
      }, []);
    })(TEST_IDS);

    for (const id of list) {
      for (const element of screen.getAllByTestId(id)) {
        expect(element.classList).toContain(id);
      }
    }
  });
});
