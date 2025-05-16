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
import { Tree, TreeGroup } from '.';
import { actions } from '../../ladle/actions';
import { AriaText } from '../aria';
import { Button, ButtonContext, ToggleButton } from '../button';
import { Checkbox } from '../checkbox';
import { Group } from '../group';
import { Icon } from '../icon';
import type { TreeProps, TreeRenderProps } from './types';

export default {
  title: 'Components/Tree',
  argTypes: {
    allowsDragging: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
    },
    allowsExpansion: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
    },
    allowsVisibility: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
    },
    selectionBehavior: {
      control: {
        type: 'select',
      },
      options: ['replace', 'toggle'],
      defaultValue: 'replace',
    },
    selectionMode: {
      control: {
        type: 'select',
      },
      options: ['multiple', 'none', 'single'],
      defaultValue: 'multiple',
    },
    showTreeLines: {
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
      defaultValue: 'lg',
    },
  },
} satisfies StoryDefault<TreeProps<unknown>>;

const icons = {
  eyeOpen: (
    <Icon fill='none' stroke='currentcolor'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        strokeWidth='1'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <title>Open Eye Icon</title>
        <path d='M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0' />
        <circle cx='12' cy='12' r='3' />
      </svg>
    </Icon>
  ),
  eyeClosed: (
    <Icon fill='none' stroke='currentcolor'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        strokeWidth='1'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <title>Closed Eye Icon</title>
        <path d='M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49' />
        <path d='M14.084 14.158a3 3 0 0 1-4.242-4.242' />
        <path d='M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143' />
        <path d='m2 2 20 20' />
      </svg>
    </Icon>
  ),
  lock: (
    <Icon>
      <svg
        className='MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1wmkh38'
        focusable='false'
        aria-hidden='true'
        viewBox='0 0 24 24'
        data-testid='LockIcon'
      >
        <path d='M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2m-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2m3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1z' />
      </svg>
    </Icon>
  ),
  chevronExpanded: (
    <Icon fill='none' stroke='currentcolor'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        strokeWidth='1'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <title>Chevron Down Icon</title>
        <path d='m6 9 6 6 6-6' />
      </svg>
    </Icon>
  ),
  chevronCollapsed: (
    <Icon fill='none' stroke='currentcolor'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        strokeWidth='1'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <title>Chevron Right Icon</title>
        <path d='m9 18 6-6-6-6' />
      </svg>
    </Icon>
  ),
  checkmark: (
    <Icon fill='none' stroke='currentColor'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        strokeWidth='1'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <title>Checkmark Icon</title>
        <path d='M20 6 9 17l-5-5' />
      </svg>
    </Icon>
  ),
  dragIcon: (
    <Icon fill='none' stroke='currentcolor'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        strokeWidth='1'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <title>Drag Icon</title>
        <circle cx='9' cy='12' r='1' />
        <circle cx='9' cy='5' r='1' />
        <circle cx='9' cy='19' r='1' />
        <circle cx='15' cy='12' r='1' />
        <circle cx='15' cy='5' r='1' />
        <circle cx='15' cy='19' r='1' />
      </svg>
    </Icon>
  ),
};

function Node() {
  return (
    <>
      <ToggleButton slot='visibility'>
        {({ isSelected, isDisabled }) => {
          if (isDisabled) {
            return icons.lock;
          }
          return isSelected ? icons.eyeOpen : icons.eyeClosed;
        }}
      </ToggleButton>
      <ToggleButton slot='expansion'>
        {({ isSelected }) =>
          isSelected ? icons.chevronExpanded : icons.chevronCollapsed
        }
      </ToggleButton>
      <AriaText slot='description' />
      <Checkbox slot='selection'>
        {({ isSelected }) => (isSelected ? icons.checkmark : null)}
      </Checkbox>
      <Button slot='drag'>{icons.dragIcon}</Button>
    </>
  );
}

// NOTE: Passing provider={false} is only necessary because of the spread of props and TS doesn't know which mode the Tree is in
export const BasicExample: Story<TreeProps<unknown>> = (props) => (
  <Tree
    {...props}
    {...actions<TreeProps<unknown>>(
      'onAction',
      'onScroll',
      'onSelectionChange',
      'onUpdate',
    )}
    provider={false}
    nodes={nodes}
    onUpdate={action('onUpdate')}
    aria-label='Tree'
  >
    <Node />
  </Tree>
);

BasicExample.storyName = 'Basic';

export const ProviderExample: Story<TreeProps<unknown>> = (props) => (
  <Tree
    {...props}
    {...actions<TreeProps<unknown>>(
      'onAction',
      'onScroll',
      'onSelectionChange',
      'onUpdate',
    )}
    provider // NOTE: Pass provider to enable Tree renderProps children with access to state context
    nodes={nodes}
    onUpdate={action('onUpdate')}
    aria-label='Tree'
  >
    {({
      actions: actionsProp,
      allowsExpansion,
      allowsVisibility,
      selectionMode,
      treeGroupProps,
    }: TreeRenderProps<unknown>) => (
      <>
        <Group context={ButtonContext} values={{ size: 'sm', variant: 'bare' }}>
          {allowsExpansion && (
            <>
              <Button onPress={() => actionsProp.toggleIsExpanded('all', true)}>
                Expand All
              </Button>
              <Button
                onPress={() => actionsProp.toggleIsExpanded('all', false)}
              >
                Collapse All
              </Button>
            </>
          )}
          {allowsVisibility && (
            <>
              <Button onPress={() => actionsProp.toggleIsViewable('all', true)}>
                Show All
              </Button>
              <Button
                onPress={() => actionsProp.toggleIsViewable('all', false)}
              >
                Hide All
              </Button>
            </>
          )}
          {selectionMode === 'multiple' && (
            <>
              <Button onPress={() => actionsProp.toggleIsSelected('all', true)}>
                Select All
              </Button>
              <Button
                onPress={() => actionsProp.toggleIsSelected('all', false)}
              >
                Select None
              </Button>
            </>
          )}
        </Group>
        <TreeGroup {...treeGroupProps}>
          <Node />
        </TreeGroup>
      </>
    )}
  </Tree>
);

ProviderExample.storyName = 'Provider';

const nodes = [
  {
    id: 3,
    label: 'Produce',
    isExpanded: true,
    isViewable: true,
    isReadOnly: true,
    types: ['produce'],
    nodes: [
      {
        id: 'a',
        label: 'Apple',
        type: 'produce',
        isViewable: true,
        isReadOnly: true,
      },
      {
        id: 'b',
        label: 'Banana',
        type: 'produce',
        isViewable: true,
        isReadOnly: false,
      },
      {
        id: 'c',
        label: 'Carrot',
        type: 'produce',
        isViewable: false,
        isReadOnly: false,
      },
    ],
  },
  {
    id: 4,
    label: 'Animals',
    types: ['animals'],
    nodes: [],
    isViewable: true,
  },
  {
    id: 6,
    label: 'Software',
    isViewable: true,
    types: ['software'],
    nodes: [
      {
        id: 1,
        label: 'Adobe Photoshop',
        type: 'software',
        isViewable: true,
      },
      {
        id: 2,
        label: 'Adobe XD',
        type: 'software',
        isViewable: true,
      },
    ],
  },
  {
    id: 5,
    label: 'Adobe Connect',
    type: 'software',
    isViewable: false,
  },
  {
    id: 7,
    label: 'Microsoft Teams',
    type: 'software',
    isViewable: false,
  },
  {
    id: 'foo',
    label: 'Anything',
    isExpanded: true,
    isViewable: false,
    nodes: [
      {
        id: 'z',
        label: 'Zebra',
        type: 'animals',
        isViewable: true,
      },
    ],
  },
  {
    id: 'bar',
    label: 'Alive',
    isExpanded: true,
    isViewable: true,
    types: ['produce', 'animals'],
    nodes: [],
  },
];
