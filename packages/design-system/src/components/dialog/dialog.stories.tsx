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

import { action } from '@storybook/addon-actions';
import type { StoryObj, Meta } from '@storybook/react';
import { useRef } from 'react';
import { DialogTrigger } from 'react-aria-components';
import { AriaHeading } from '../aria';
import { Button } from '../button';
import { Element } from '../element';
import { Group } from '../group';
import { Dialog } from './dialog';
import type { DialogProps } from './types';

const meta: Meta = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<
  DialogProps & {
    isGlobal: boolean;
  }
> = {
  args: {
    size: 'lg',
    isDismissable: false,
    isKeyboardDismissDisabled: false,
    isGlobal: true,
  },
  argTypes: {
    size: {
      control: {
        type: 'select',
      },
      options: ['sm', 'lg'],
    },
    isDismissable: {
      control: {
        type: 'boolean',
      },
    },
    isKeyboardDismissDisabled: {
      control: {
        type: 'boolean',
      },
    },
    isGlobal: {
      control: {
        type: 'boolean',
      },
      description: 'Not a component prop, see story for implementation details',
    },
  },
  render: ({ isDismissable, isKeyboardDismissDisabled, isGlobal, ...rest }) => {
    const ref = useRef(null);

    return (
      <DialogTrigger onOpenChange={action('onOpenChange')}>
        <Button>Press me</Button>
        <Dialog {...rest} parentRef={isGlobal ? undefined : ref}>
          {({ state }) => (
            <>
              <Element slot='header'>
                <AriaHeading>Dialog title</AriaHeading>
              </Element>
              <Element slot='content'>
                <p>Lorum Ipsum text for the dialog shall go here.</p>
              </Element>
              <Element slot='footer'>
                <Group>
                  <Button onPress={state.close}>Action 1</Button>
                  <Button slot='secondary' onPress={state.close}>
                    Action 2
                  </Button>
                </Group>
              </Element>
            </>
          )}
        </Dialog>
      </DialogTrigger>
    );
  },
};
