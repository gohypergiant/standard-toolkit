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

import { type Story, type StoryDefault, action } from '@ladle/react';
import { type RefObject, useRef } from 'react';
import { DialogTrigger } from 'react-aria-components';
import { genericColorVars, radiusVars, sizeVars } from '../../styles/theme.css';
import { AriaHeading } from '../aria';
import { Button } from '../button';
import { Element } from '../element';
import { Group } from '../group';
import { Dialog } from './';
import type { DialogProps } from './types';

export default {
  title: 'Components / Dialog',
  argTypes: {
    size: {
      control: {
        type: 'select',
      },
      options: ['sm', 'lg'],
      defaultValue: 'lg',
    },
    isDismissable: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    isKeyboardDismissDisabled: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    isGlobal: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
      description: 'Not a component prop, see story for implementation details',
    },
  },
} satisfies StoryDefault;

export const Example: Story<
  DialogProps & {
    isGlobal: boolean;
  }
> = ({ isDismissable, isKeyboardDismissDisabled, isGlobal, ...rest }) => {
  const ref = useRef(null);

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: 600,
        height: 800,
        padding: sizeVars.v05,
        border: `1px solid ${genericColorVars.neutral.v08}`,
        borderRadius: radiusVars.lg,
      }}
    >
      <DialogTrigger onOpenChange={action('onOpenChange')}>
        <Button>Press me</Button>
        <Dialog
          {...rest}
          parentRef={
            isGlobal ? undefined : (ref as unknown as RefObject<HTMLElement>)
          }
        >
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
                  <Button slot='close' onPress={state.close}>
                    Action 2
                  </Button>
                </Group>
              </Element>
            </>
          )}
        </Dialog>
      </DialogTrigger>
    </div>
  );
};
