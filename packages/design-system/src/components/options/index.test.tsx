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
import { Collection, DialogTrigger } from 'react-aria-components';
import { describe, expect, it } from 'vitest';
import {
  AriaHeader,
  AriaKeyboard,
  AriaSection,
  AriaSeparator,
  AriaText,
} from '../aria';
import { Button } from '../button';
import { Icon } from '../icon';
import { Options, OptionsItem, OptionsList } from './';

const options = [
  {
    id: 'foo',
    name: 'Australian',
    children: [
      { id: 2, name: 'Koala', description: 'drunk bear' },
      { id: 3, name: 'Kangaroo', description: 'kicky jumpah' },
      { id: 4, name: 'Platypus', description: 'poison fur-duck' },
      { id: 999 },
    ],
  },
  {
    id: 'bar',
    name: 'American',
    children: [
      { id: 6, name: 'Bald Eagle', description: 'tuxedo vulture' },
      { id: 7, name: 'Bison', description: 'stabby fur-cow' },
      { id: 8, name: 'Skunk', description: 'stinky squirrel' },
    ],
  },
  { id: 10, name: 'Foo' },
  { id: 666 },
  { id: 11, name: 'Bar' },
];

function setup({ items = options, ...rest } = {}) {
  render(
    <DialogTrigger>
      <Button>Click to see Options</Button>
      <Options isOpen>
        <OptionsList {...rest} aria-label='Pick an animal' items={options}>
          {(section) => {
            const floatingItems = section.name ? (
              <OptionsItem {...section} textValue={section.name}>
                <Icon size='md'>
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
                    <title>Ladle</title>
                    <path d='M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z' />
                  </svg>
                </Icon>
                <AriaText slot='label'>{section.name}</AriaText>
                <AriaKeyboard>⌘V</AriaKeyboard>
              </OptionsItem>
            ) : (
              <AriaSeparator />
            );

            return section.children ? (
              <AriaSection>
                <AriaHeader>{section.name}</AriaHeader>
                <Collection items={section.children}>
                  {(item) =>
                    item.name ? (
                      <OptionsItem {...item} textValue={item.name}>
                        <AriaText slot='label'>{item.name}</AriaText>
                        <AriaText slot='description'>
                          {item.description}
                        </AriaText>
                      </OptionsItem>
                    ) : (
                      <AriaSeparator />
                    )
                  }
                </Collection>
              </AriaSection>
            ) : (
              floatingItems
            );
          }}
        </OptionsList>
      </Options>
    </DialogTrigger>,
  );

  return {
    ...rest,
    items,
  };
}

describe('Options', () => {
  it('should render', () => {
    setup();

    expect(screen.getByText('Foo')).toBeInTheDocument();
  });
});
