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

import { actions } from '../../ladle/actions';
import { TextArea } from '.';
import type { Story, StoryDefault } from '@ladle/react';
import type { TextAreaProps } from './types';

export default {
  title: 'Components/TextArea',
  argTypes: {
    disabled: {
      control: {
        type: 'boolean',
      },
    },
    'aria-invalid': {
      control: {
        type: 'select',
      },
      options: ['true', 'false', 'grammar', 'spelling'],
    },
    placeholder: {
      control: {
        type: 'text',
      },
    },
    readOnly: {
      control: {
        type: 'boolean',
      },
    },
    resize: {
      control: {
        type: 'select',
      },
      options: ['both', 'horizontal', 'vertical', 'none'],
      defaultValue: 'none',
    },
  },
} satisfies StoryDefault<TextAreaProps>;

export const ControlledExample: Story<TextAreaProps> = (props) => (
  <TextArea
    {...props}
    {...actions<TextAreaProps>(
      'onChange',
      'onHoverChange',
      'onHoverEnd',
      'onHoverStart',
      'onBlur',
      'onFocus',
    )}
  />
);

ControlledExample.storyName = 'Controlled';

ControlledExample.argTypes = {
  value: {
    control: {
      type: 'text',
    },
    defaultValue: '',
  },
};

export const UncontrolledExample: Story<TextAreaProps> = (props) => (
  <TextArea
    {...props}
    defaultValue=''
    {...actions<TextAreaProps>(
      'onChange',
      'onHoverChange',
      'onHoverEnd',
      'onHoverStart',
      'onBlur',
      'onFocus',
    )}
  />
);

UncontrolledExample.storyName = 'Uncontrolled';
