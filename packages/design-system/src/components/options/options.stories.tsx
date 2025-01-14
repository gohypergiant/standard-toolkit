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

import type { StoryObj, Meta } from '@storybook/react';
import { Collection, DialogTrigger } from 'react-aria-components';
import {
  AriaHeader,
  AriaKeyboard,
  AriaSection,
  AriaSeparator,
  AriaText,
} from '../aria';
import { Button } from '../button';
import { Icon } from '../icon';
import { Options, OptionsItem, OptionsList } from './options';
import type { OptionsListProps } from './types';

type StoryProps = OptionsListProps<object>;

const meta: Meta = {
  title: 'Components/Options',
  component: Options,
  tags: ['autodocs'],
};

export default meta;

const flatOptions = [
  { id: 2, name: 'Koala', description: 'drunk bear' },
  { id: 3, name: 'Kangaroo', description: 'kicky jumpah' },
  { id: 4, name: 'Platypus', description: 'poison fur-duck' },
  { id: 6, name: 'Bald Eagle', description: 'tuxedo vulture' },
  { id: 7, name: 'Bison', description: 'stabby fur-cow' },
  { id: 8, name: 'Skunk', description: 'stinky squirrel' },
];
export const Flat: StoryObj<StoryProps> = {
  render: (props) => (
    <OptionsList {...props} aria-label='Pick an animal' items={flatOptions}>
      {(item) => (
        <OptionsItem {...item} textValue={item.name}>
          <AriaText slot='label'>{item.name}</AriaText>
          <AriaText slot='description'>{item.description}</AriaText>
        </OptionsItem>
      )}
    </OptionsList>
  ),
};

const mixedOptions = [
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
export const Mixed: StoryObj<StoryProps> = {
  render: (props) => (
    <DialogTrigger>
      <Button>Click to see Options</Button>
      <Options>
        <OptionsList
          {...props}
          aria-label='Pick an animal'
          items={mixedOptions}
        >
          {(section) => {
            const floatingItems = section.name ? (
              <OptionsItem {...section} textValue={section.name}>
                <Icon size='md'>
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
                    <title>Airplane Icon</title>
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
    </DialogTrigger>
  ),
};

const sectionsOptions = [
  {
    id: 'foo',
    name: 'Australian',
    children: [
      { id: 2, name: 'Koala' },
      { id: 3, name: 'Kangaroo' },
      { id: 4, name: 'Platypus' },
    ],
  },
  {
    id: 'bar',
    name: 'American',
    children: [
      { id: 6, name: 'Bald Eagle' },
      { id: 7, name: 'Bison' },
      { id: 8, name: 'Skunk' },
    ],
  },
];
export const Sections: StoryObj<StoryProps> = {
  render: (props) => (
    <DialogTrigger>
      <Button>Click to see Options</Button>
      <Options>
        <OptionsList
          {...props}
          aria-label='Pick an animal'
          items={sectionsOptions}
        >
          {(section) => (
            <AriaSection>
              <AriaHeader>{section.name}</AriaHeader>
              <Collection items={section.children}>
                {(item) => (
                  <OptionsItem {...item} textValue={item.name}>
                    <AriaText slot='label'>{item.name}</AriaText>
                  </OptionsItem>
                )}
              </Collection>
            </AriaSection>
          )}
        </OptionsList>
      </Options>
    </DialogTrigger>
  ),
};

export const Static: StoryObj<StoryProps> = {
  render: (props) => (
    <DialogTrigger>
      <Button>Click to see Options</Button>
      <Options>
        <OptionsList {...props} aria-label='Pick an animal'>
          <AriaSection>
            <AriaHeader>Australian</AriaHeader>
            <OptionsItem>Koala</OptionsItem>
            <OptionsItem>Kangaroo</OptionsItem>
            <OptionsItem>Platypus</OptionsItem>
            <AriaSeparator />
          </AriaSection>
          <AriaSection>
            <AriaHeader>American</AriaHeader>
            <OptionsItem>Bald Eagle</OptionsItem>
            <OptionsItem>Bison</OptionsItem>
            <OptionsItem>Skunk</OptionsItem>
            <AriaSeparator />
          </AriaSection>
          <OptionsItem isDisabled>Foo</OptionsItem>
          <OptionsItem>Bar</OptionsItem>
        </OptionsList>
      </Options>
    </DialogTrigger>
  ),
};
