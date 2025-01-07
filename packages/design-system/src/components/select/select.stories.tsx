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

import type { Story, StoryDefault } from '@ladle/react';
import { actions } from '../../ladle';
import { AriaFieldError, AriaLabel, AriaSelectValue, AriaText } from '../aria';
import { Button } from '../button';
import { Icon } from '../icon';
import { Options, OptionsItem, OptionsList } from '../options';
import { Select } from './select';
import type { SelectProps } from './types';

type StoryProps = SelectProps<object> & {
  description?: string;
  errorMessage?: string;
  label?: string;
  showLabel?: boolean;
};

export default {
  title: 'Components/Select',
  argTypes: {
    description: {
      control: {
        type: 'text',
      },
    },
    errorMessage: {
      control: {
        type: 'text',
      },
    },
    label: {
      control: {
        type: 'text',
      },
      defaultValue: 'Favorite animals',
    },
    showLabel: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
    },
    size: {
      control: {
        type: 'select',
      },
      options: ['sm', 'lg'],
      defaultValue: 'sm',
    },
    isDisabled: {
      control: {
        type: 'boolean',
      },
    },
    isInvalid: {
      control: {
        type: 'boolean',
      },
    },
  },
} satisfies StoryDefault;

export const ControlledExample: Story<StoryProps> = ({
  description,
  errorMessage,
  label,
  showLabel,
  ...rest
}) => (
  <Select
    {...rest}
    {...actions<SelectProps<object>>(
      'onBlur',
      'onFocus',
      'onFocusChange',
      'onOpenChange',
      'onSelectionChange',
    )}
    aria-label={label}
  >
    {({ isOpen }) => (
      <>
        {showLabel && <AriaLabel>{label}</AriaLabel>}
        <Button>
          <AriaSelectValue>
            {({ selectedText }) => selectedText}
          </AriaSelectValue>
          <Icon>
            {isOpen ? (
              <svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                <title>Chevron Up Icon</title>
                <path d='M17.6577 15.6996L12.0008 10.0427L6.34391 15.6996L4.92969 14.2855L10.5867 8.62855C10.5867 8.62855 12.0009 7.21436 13.415 8.62847C14.8291 10.0426 19.0718 14.2854 19.0718 14.2854L17.6577 15.6996Z' />
              </svg>
            ) : (
              <svg viewBox='0 0 24 25' xmlns='http://www.w3.org/2000/svg'>
                <title>Chevron Down Icon</title>
                <path d='M6.41417 8.94775L12.0711 14.6046L17.7279 8.94775L19.1421 10.3618L13.4852 16.0188C13.4852 16.0188 12.071 17.433 10.6569 16.0189C9.24274 14.6047 5 10.362 5 10.362L6.41417 8.94775Z' />
              </svg>
            )}
          </Icon>
        </Button>
        {description && <AriaText slot='description'>{description}</AriaText>}
        <AriaFieldError>{errorMessage}</AriaFieldError>
        <Options>
          <OptionsList>
            <OptionsItem textValue='Aardvark'>
              <AriaText slot='label'>Aardvark</AriaText>
              <AriaText slot='description'>snooty tank-ball</AriaText>
            </OptionsItem>
            <OptionsItem textValue='Cat'>
              <AriaText slot='label'>Cat</AriaText>
              <AriaText slot='description'>perfection itself</AriaText>
            </OptionsItem>
            <OptionsItem textValue='Dog'>
              <AriaText slot='label'>Dog</AriaText>
              <AriaText slot='description'>slobber wolf</AriaText>
            </OptionsItem>
            <OptionsItem textValue='Kangaroo'>
              <AriaText slot='label'>Kangaroo</AriaText>
              <AriaText slot='description'>kicky jumpah</AriaText>
            </OptionsItem>
            <OptionsItem textValue='Red Panda'>
              <AriaText slot='label'>Red Panda</AriaText>
              <AriaText slot='description'>disguised Mario</AriaText>
            </OptionsItem>
            <OptionsItem textValue='Snake'>
              <AriaText slot='label'>Snake</AriaText>
              <AriaText slot='description'>murder worm</AriaText>
            </OptionsItem>
          </OptionsList>
        </Options>
      </>
    )}
  </Select>
);

ControlledExample.storyName = 'Controlled';
ControlledExample.argTypes = {
  selectedKey: {
    control: {
      type: 'text',
    },
    defaultValue: 'Red Panda',
  },
};

export const UncontrolledExample: Story<StoryProps> = ({
  description,
  errorMessage,
  label,
  showLabel,
  ...rest
}) => (
  <Select
    {...rest}
    {...actions<SelectProps<object>>(
      'onBlur',
      'onFocus',
      'onFocusChange',
      'onOpenChange',
      'onSelectionChange',
    )}
    aria-label={label}
  >
    {({ isOpen }) => (
      <>
        {showLabel && <AriaLabel>{label}</AriaLabel>}
        <Button>
          <AriaSelectValue>
            {({ selectedText }) => selectedText}
          </AriaSelectValue>
          <Icon>
            {isOpen ? (
              <svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                <title>Chevron Up Icon</title>
                <path d='M17.6577 15.6996L12.0008 10.0427L6.34391 15.6996L4.92969 14.2855L10.5867 8.62855C10.5867 8.62855 12.0009 7.21436 13.415 8.62847C14.8291 10.0426 19.0718 14.2854 19.0718 14.2854L17.6577 15.6996Z' />
              </svg>
            ) : (
              <svg viewBox='0 0 24 25' xmlns='http://www.w3.org/2000/svg'>
                <title>Chevron Down Icon</title>
                <path d='M6.41417 8.94775L12.0711 14.6046L17.7279 8.94775L19.1421 10.3618L13.4852 16.0188C13.4852 16.0188 12.071 17.433 10.6569 16.0189C9.24274 14.6047 5 10.362 5 10.362L6.41417 8.94775Z' />
              </svg>
            )}
          </Icon>
        </Button>
        {description && <AriaText slot='description'>{description}</AriaText>}
        <AriaFieldError>{errorMessage}</AriaFieldError>
        <Options>
          <OptionsList>
            <OptionsItem textValue='Aardvark'>
              <AriaText slot='label'>Aardvark</AriaText>
              <AriaText slot='description'>snooty tank-ball</AriaText>
            </OptionsItem>
            <OptionsItem textValue='Cat'>
              <AriaText slot='label'>Cat</AriaText>
              <AriaText slot='description'>perfection itself</AriaText>
            </OptionsItem>
            <OptionsItem textValue='Dog'>
              <AriaText slot='label'>Dog</AriaText>
              <AriaText slot='description'>slobber wolf</AriaText>
            </OptionsItem>
            <OptionsItem textValue='Kangaroo'>
              <AriaText slot='label'>Kangaroo</AriaText>
              <AriaText slot='description'>kicky jumpah</AriaText>
            </OptionsItem>
            <OptionsItem textValue='Red Panda'>
              <AriaText slot='label'>Red Panda</AriaText>
              <AriaText slot='description'>disguised Mario</AriaText>
            </OptionsItem>
            <OptionsItem textValue='Snake'>
              <AriaText slot='label'>Snake</AriaText>
              <AriaText slot='description'>murder worm</AriaText>
            </OptionsItem>
          </OptionsList>
        </Options>
      </>
    )}
  </Select>
);

UncontrolledExample.storyName = 'Uncontrolled';
UncontrolledExample.argTypes = {
  placeholder: {
    control: {
      type: 'text',
    },
    defaultValue: 'Pick an animal',
  },
};
