import type { Meta, StoryObj } from '@storybook/react';
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
import React from 'react';

const meta: Meta = {
  title: 'Foundation/Typography',
  tags: ['!autodocs'],
};

export default meta;
type Story = StoryObj;

type TypographyInfo = {
  name: string;
  text: string;
};

const headers: TypographyInfo[] = [
  {
    name: 'header-xxl (32/40)',
    text: 'text-header-xxl',
  },
  {
    name: 'header-xl (24/28)',
    text: 'text-header-xl',
  },
  {
    name: 'header-l (20/24)',
    text: 'text-header-l',
  },
  {
    name: 'header-m (14/20)',
    text: 'text-header-m',
  },
  {
    name: 'header-s (12/16)',
    text: 'text-header-s',
  },
  {
    name: 'header-xs (10/12)',
    text: 'text-header-xs',
  },
];

const body: TypographyInfo[] = [
  {
    name: 'body-l (16/24)',
    text: 'text-body-l',
  },
  {
    name: 'body-m (14/20)',
    text: 'text-body-m',
  },
  {
    name: 'body-s (12/16)',
    text: 'text-body-s',
  },
  {
    name: 'body-xs (10/12)',
    text: 'text-body-xs',
  },
  {
    name: 'body-xxs (9/12)',
    text: 'text-body-xxs',
  },
];

const bodyDisplay: TypographyInfo[] = [
  {
    name: 'body-l (16/24)',
    text: 'text-body-l',
  },
  {
    name: 'body-m (14/20)',
    text: 'text-body-m',
  },
  {
    name: 'body-s (12/16)',
    text: 'text-body-s',
  },
  {
    name: 'body-xs (10/12)',
    text: 'text-body-xs',
  },
];

const button: TypographyInfo[] = [
  {
    name: 'button-l (16/24)',
    text: 'text-button-l',
  },
  {
    name: 'button-m (14/20)',
    text: 'text-button-m',
  },
  {
    name: 'button-s (12/16)',
    text: 'text-button-s',
  },
  {
    name: 'button-xs (10/12)',
    text: 'text-button-xs',
  },
];

const TypographyDisplay = (typo: TypographyInfo) => (
  <React.Fragment key={typo.name}>
    <div className={`fg-interactive-default text-right ${typo.text}`}>
      {typo.name}
    </div>
    <div className='fg-interactive-default flex flex-col gap-s font-display text-body-xs'>
      <span className='inline-flex gap-s'>{typo.text}</span>
      <span className='fg-default-dark'>Figma: {typo.name}</span>
    </div>
  </React.Fragment>
);

export const Fonts: Story = {
  render: () => (
    <div className='flex flex-col gap-xl'>
      <div className='flex flex-col gap-m'>
        <h1 className='fg-interactive-default text-header-xl'>Fonts</h1>
        <p className='fg-interactive-hover-light text-body-s'>
          We use the Roboto and Roboto Mono fonts as the basis for this design
          system.
        </p>
      </div>
      <div className='fg-interactive-default flex flex-col gap-y-oversized'>
        <div className='flex flex-col font-primary'>
          <h1 className='font-medium text-[48px] leading-[64px]'>Roboto</h1>
          <p className='font-normal text-[24px] leading-[32px]'>
            ABCDEFGHIJKLMNOPQRSTUVWXYZ
            <br />
            abcdefghijklmnopqrstuvwxyz
            <br />
            0123456789
          </p>
        </div>
        <div className='flex flex-col font-display'>
          <h1 className='font-medium text-[48px] leading-[64px]'>
            Roboto Mono
          </h1>
          <p className='font-normal text-[24px] leading-[32px]'>
            ABCDEFGHIJKLMNOPQRSTUVWXYZ
            <br />
            abcdefghijklmnopqrstuvwxyz
            <br />
            0123456789
          </p>
        </div>
      </div>
    </div>
  ),
};

export const PrimaryHeader: Story = {
  render: () => (
    <div className='flex flex-col gap-xl'>
      <div className='flex flex-col gap-m'>
        <h1 className='fg-interactive-default text-header-xl'>Headers</h1>
        <p className='fg-interactive-hover-light text-body-s'>
          The numbers that you see in the parenthesis after each name is the
          font size and line height of each of the related entries.
          <br />
          <br />
          The following includes the{' '}
          <span className='fg-highlight font-display'>font-primary</span> class
          as well.
          <br />
          <br />
          If you would like to make your headers uppercase, please use the{' '}
          <span className='fg-highlight font-display'>uppercase</span> class
          name instead of uppercase letters.
        </p>
      </div>
      <div className='grid grid-cols-2 items-center gap-x-xxl gap-y-xxl'>
        {headers.map(TypographyDisplay)}
      </div>
    </div>
  ),
};

export const PrimaryBody: Story = {
  render: () => (
    <div className='flex flex-col gap-xl'>
      <div className='flex flex-col gap-m'>
        <h1 className='fg-interactive-default text-header-xl'>Body</h1>
        <p className='fg-interactive-hover-light text-body-s'>
          The numbers that you see in the parenthesis after each name is the
          font size and line height of each of the related entries.
          <br />
          <br />
          The following includes the{' '}
          <span className='fg-highlight font-display'>font-primary</span> class
          as well.
        </p>
      </div>
      <div className='grid grid-cols-2 items-center gap-x-xxl gap-y-xxl'>
        {body.map(TypographyDisplay)}
      </div>
    </div>
  ),
};

export const DisplayBody: Story = {
  render: () => (
    <div className='flex flex-col gap-xl'>
      <div className='flex flex-col gap-m'>
        <h1 className='text-header-xl text-interactive-default'>Body</h1>
        <p className='text-body-s text-interactive-hover-light'>
          The numbers that you see in the parenthesis after each name is the
          font size and line height of each of the related entries.
          <br />
          <br />
          The following includes the{' '}
          <span className='font-display text-highlight'>font-display</span>{' '}
          class as well.
        </p>
      </div>
      <div className='grid grid-cols-2 items-center gap-x-xxl gap-y-xxl font-display'>
        {bodyDisplay.map(TypographyDisplay)}
      </div>
    </div>
  ),
};

export const PrimaryButton: Story = {
  globals: { backgrounds: { value: '#000000' } },
  render: () => (
    <div className='flex flex-col gap-xl'>
      <div className='flex flex-col gap-m'>
        <h1 className='text-header-xl text-interactive-default'>Button</h1>
        <p className='text-body-s text-interactive-hover-light'>
          The numbers that you see in the parenthesis after each name is the
          font size and line height of each of the related entries.
          <br />
          <br />
          The following includes the{' '}
          <span className='font-display text-highlight'>font-primary</span>{' '}
          class as well.
        </p>
      </div>
      <div className='grid grid-cols-2 items-center gap-x-xxl gap-y-xxl'>
        {button.map(TypographyDisplay)}
      </div>
    </div>
  ),
};
