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
import { ColorSwatch } from 'react-aria-components';
import { actions } from '../../ladle';
import { Icon } from '../icon';
import { Picker, PickerItem } from './picker';
import {
  colorPickerItem,
  colorSwatch,
  iconPickerItem,
} from './picker.stories.css';
import type { PickerProps } from './types';

export default {
  title: 'Components/Picker',
  argTypes: {
    columns: {
      control: {
        type: 'number',
      },
      defaultValue: 6,
    },
    disallowEmptySelection: {
      control: {
        type: 'boolean',
      },
    },
    layout: {
      control: {
        type: 'select',
      },
      options: ['stack', 'grid'],
      defaultValue: 'grid',
    },
    orientation: {
      control: {
        type: 'select',
      },
      options: ['horizontal', 'vertical'],
      defaultValue: 'horizontal',
    },
    selectionBehavior: {
      control: {
        type: 'select',
      },
      options: ['toggle', 'replace'],
      defaultValue: 'toggle',
    },
    selectionMode: {
      control: {
        type: 'select',
      },
      options: ['none', 'single', 'multiple'],
      defaultValue: 'single',
    },
  },
} satisfies StoryDefault;

const colorPickerItemClassNames = { item: { item: colorPickerItem } };

type ColorPickerItem = { id: string; color: string };

const colorPickerItems: ColorPickerItem[] = [
  { id: 'red', color: '#f00' },
  { id: 'green', color: '#0f0' },
  { id: 'blue', color: '#00f' },
  { id: 'yellow', color: '#ff0' },
  { id: 'pink', color: '#f0f' },
  { id: 'teal', color: '#0ff' },
  { id: 'orange', color: '#f08e0f' },
  { id: 'purple', color: '#c30ff0' },
];

export const ColorPickerExample: Story<PickerProps<ColorPickerItem>> = (
  props,
) => (
  <Picker<ColorPickerItem>
    {...props}
    classNames={colorPickerItemClassNames}
    items={colorPickerItems}
    aria-label='Color Picker'
    {...actions<PickerProps<ColorPickerItem>>(
      /**
       * Do not bind to the the onAction event handler prop it changes the behavior
       * of selection, in conjunction with the selectionBehavior prop:
       * https://github.com/adobe/react-spectrum/issues/6506#issuecomment-2153780073
       */
      // 'onAction',
      'onBlur',
      'onFocus',
      'onFocusChange',
      'onScroll',
      'onSelectionChange',
    )}
  >
    {({ id, color }: ColorPickerItem) => (
      <PickerItem textValue={id}>
        <ColorSwatch className={colorSwatch} color={color} />
      </PickerItem>
    )}
  </Picker>
);

ColorPickerExample.storyName = 'Color Picker';

const iconPickerItemClassNames = { item: { item: iconPickerItem } };

export const IconPickerExample: Story<PickerProps<object>> = (props) => (
  <Picker
    {...props}
    classNames={iconPickerItemClassNames}
    aria-label='Icon Picker'
    {...actions<PickerProps<object>>(
      // 'onAction',
      'onBlur',
      'onFocus',
      'onFocusChange',
      'onScroll',
      'onSelectionChange',
    )}
  >
    <PickerItem textValue='comment'>
      <Icon size='md'>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
          <title>Chat Bubble Icon</title>
          <path
            d='M3.559 4.544c.355-.35.834-.544 1.33-.544H19.11c.496 0 .975.194 1.33.544.356.35.559.829.559 1.331v9.25c0 .502-.203.981-.559 1.331-.355.35-.834.544-1.33.544H15.5l-2.7 3.6a1 1 0 0 1-1.6 0L8.5 17H4.889c-.496 0-.975-.194-1.33-.544A1.868 1.868 0 0 1 3 15.125v-9.25c0-.502.203-.981.559-1.331ZM7.556 7.5a1 1 0 1 0 0 2h8a1 1 0 0 0 0-2h-8Zm0 3.5a1 1 0 1 0 0 2H12a1 1 0 1 0 0-2H7.556Z'
            clipRule='evenodd'
            fillRule='evenodd'
          />
        </svg>
      </Icon>
    </PickerItem>
    <PickerItem textValue='badge'>
      <Icon size='md'>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
          <title>Check Mark Icon</title>
          <path
            d='M12 2c-.791 0-1.55.314-2.11.874l-.893.893a.985.985 0 0 1-.696.288H7.04A2.984 2.984 0 0 0 4.055 7.04v1.262a.986.986 0 0 1-.288.696l-.893.893a2.984 2.984 0 0 0 0 4.22l.893.893a.985.985 0 0 1 .288.696v1.262a2.984 2.984 0 0 0 2.984 2.984h1.262c.261 0 .512.104.696.288l.893.893a2.984 2.984 0 0 0 4.22 0l.893-.893a.985.985 0 0 1 .696-.288h1.262a2.984 2.984 0 0 0 2.984-2.984V15.7c0-.261.104-.512.288-.696l.893-.893a2.984 2.984 0 0 0 0-4.22l-.893-.893a.985.985 0 0 1-.288-.696V7.04a2.984 2.984 0 0 0-2.984-2.984h-1.262a.985.985 0 0 1-.696-.288l-.893-.893A2.984 2.984 0 0 0 12 2Zm3.683 7.73a1 1 0 1 0-1.414-1.413l-4.253 4.253-1.277-1.277a1 1 0 0 0-1.415 1.414l1.985 1.984a1 1 0 0 0 1.414 0l4.96-4.96Z'
            clipRule='evenodd'
            fillRule='evenodd'
          />
        </svg>
      </Icon>
    </PickerItem>
    <PickerItem textValue='clock'>
      <Icon size='md'>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
          <title>Clock Icon</title>
          <path
            d='M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z'
            clipRule='evenodd'
            fillRule='evenodd'
          />
        </svg>
      </Icon>
    </PickerItem>
  </Picker>
);

IconPickerExample.storyName = 'Icon Picker';
