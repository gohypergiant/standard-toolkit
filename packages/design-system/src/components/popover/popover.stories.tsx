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

import { action, type Story, type StoryDefault } from '@ladle/react';
import { DialogTrigger } from 'react-aria-components';
import { genericColorVars } from '../../styles/theme.css';
import { AriaHeading } from '../aria';
import { Button } from '../button';
import { Element } from '../element';
import { Group } from '../group';
import { Icon } from '../icon';
import { Popover } from './';
import type { PopoverProps } from './types';

export default {
  title: 'Components / Popover',
  argTypes: {
    placement: {
      control: {
        type: 'select',
      },
      options: ['bottom', 'end', 'start', 'top'],
      defaultValue: 'bottom',
    },
    shouldFlip: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
    },
  },
} satisfies StoryDefault;

export const TitleTextButtonExample: Story<PopoverProps> = (props) => (
  <DialogTrigger onOpenChange={action('onOpenChange')}>
    <Button variant='icon'>
      <Icon>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 28 28'>
          <title>Ladle</title>
          <path d='M9.00011 6.50098C9.00011 6.50098 9 5.00098 10.5 5.00098H17.5C19.0001 5.00098 19.0001 6.50098 19.0001 6.50098V9.00098H21.0001C21.2388 9.00098 21.0001 9.00098 22.0001 9.00098V10.501H21.0001L20 21.501C19.9325 22.5091 19.5 23.001 18.5 23.001H10C8.5 23.001 8.17675 22.462 8.00011 21.001L7 10.501H6L6.00011 9.00098C7.00011 9.00098 6.76141 9.00098 7.00011 9.00098H9.00011V6.50098ZM10.5 9.00098H17.5V6.50098H10.5V9.00098ZM8.5 10.501L9.5 21.501H18.5L19.5 10.501H8.5ZM12.9999 13.001V19.001H11.4999V13.001H12.9999Z' />
          <path d='M16.5001 19.001L16.5002 13.001H15.0001L15 19.001H16.5001Z' />
        </svg>
      </Icon>
    </Button>
    <Popover {...props}>
      {({ close }) => (
        <>
          <Element slot='header'>
            <AriaHeading>Popover title</AriaHeading>
          </Element>
          <Element slot='content'>
            <p>Lorum Ipsum text for the dialog shall go here.</p>
          </Element>
          <Element slot='footer'>
            <Group>
              <Button onPress={close}>CTA</Button>
              <Button slot='close' onPress={close}>
                Cancel
              </Button>
            </Group>
          </Element>
        </>
      )}
    </Popover>
  </DialogTrigger>
);

TitleTextButtonExample.storyName = 'Title Text Buttons';

export const TitleTextExample: Story<PopoverProps> = (props) => (
  <DialogTrigger onOpenChange={action('onOpenChange')}>
    <Button variant='icon'>
      <Icon>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
          <title>Ladle</title>
          <path d='M13 16.5H11V10.5001L13 10.5V16.5Z' />
          <path d='M12 7.5C11.4477 7.5 11 7.94772 11 8.5C11 9.05228 11.4477 9.5 12 9.5C12.5523 9.5 13 9.05228 13 8.5C13 7.94772 12.5523 7.5 12 7.5Z' />
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M12 19.5C16.1421 19.5 19.5 16.1421 19.5 12C19.5 7.85786 16.1421 4.5 12 4.5C7.85786 4.5 4.5 7.85786 4.5 12C4.5 16.1421 7.85786 19.5 12 19.5ZM12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z'
          />
        </svg>
      </Icon>
    </Button>
    <Popover {...props}>
      <Element slot='header'>
        <AriaHeading>Popover title</AriaHeading>
      </Element>
      <Element slot='content'>
        <p>Lorum Ipsum text for the dialog shall go here.</p>
      </Element>
      <Element slot='content'>
        <p>Lorum Ipsum text for the dialog shall go here.</p>
      </Element>
      <Element slot='content'>
        <p>Lorum Ipsum text for the dialog shall go here.</p>
      </Element>
      <Element slot='content'>
        <p>Lorum Ipsum text for the dialog shall go here.</p>
      </Element>
    </Popover>
  </DialogTrigger>
);

TitleTextExample.storyName = 'Title and Text';

export const NoHeaderSlotExample: Story<PopoverProps> = (props) => (
  <DialogTrigger onOpenChange={action('onOpenChange')}>
    <Button variant='icon'>
      <Icon>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
          <title>Ladle</title>
          <path d='M13 16.5H11V10.5001L13 10.5V16.5Z' />
          <path d='M12 7.5C11.4477 7.5 11 7.94772 11 8.5C11 9.05228 11.4477 9.5 12 9.5C12.5523 9.5 13 9.05228 13 8.5C13 7.94772 12.5523 7.5 12 7.5Z' />
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M12 19.5C16.1421 19.5 19.5 16.1421 19.5 12C19.5 7.85786 16.1421 4.5 12 4.5C7.85786 4.5 4.5 7.85786 4.5 12C4.5 16.1421 7.85786 19.5 12 19.5ZM12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z'
          />
        </svg>
      </Icon>
    </Button>
    <Popover {...props}>
      <Element slot='content'>
        <p>
          Notice that text is not muted when no element with a
          slot=&quot;header&quot; is present.
        </p>
      </Element>
      <Element slot='content'>
        <p style={{ color: genericColorVars.neutral.v03 }}>
          You can still apply styles directly to elements to change colors.
        </p>
      </Element>
    </Popover>
  </DialogTrigger>
);

NoHeaderSlotExample.storyName = 'Text';
