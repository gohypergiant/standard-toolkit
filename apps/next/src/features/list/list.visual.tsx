/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { Button } from '@accelint/design-toolkit/components/button';
import { Icon } from '@accelint/design-toolkit/components/icon';
import { List } from '@accelint/design-toolkit/components/list';
import { ListItem } from '@accelint/design-toolkit/components/list/item';
import { ListItemContent } from '@accelint/design-toolkit/components/list/item-content';
import { ListItemDescription } from '@accelint/design-toolkit/components/list/item-description';
import { ListItemTitle } from '@accelint/design-toolkit/components/list/item-title';
import Kebab from '@accelint/icons/kebab';
import Placeholder from '@accelint/icons/placeholder';
import {
  createInteractiveVisualTests,
  generateVariantMatrix,
} from '~/visual-regression/vitest';
import { LIST_VARIANTS } from './variants';
import type { ListItemVariant } from '@accelint/design-toolkit/components/list/types';
import type { ListScenarioProps } from './variants';

const WRAPPER_CLASS = 'inline-block p-s w-[300px]';

// ---------------------------------------------------------------------------
// List — variant x selectionMode matrix
// ---------------------------------------------------------------------------

const renderListScenario = (props: ListScenarioProps) => (
  <List {...props} aria-label='Test list'>
    <ListItem id='item-1' textValue='Item 1'>
      <Icon>
        <Placeholder />
      </Icon>
      <ListItemContent>
        <ListItemTitle>Item 1</ListItemTitle>
        <ListItemDescription>Description for item 1</ListItemDescription>
      </ListItemContent>
      <Button variant='icon' aria-label='Actions'>
        <Icon>
          <Kebab />
        </Icon>
      </Button>
    </ListItem>
    <ListItem id='item-2' textValue='Item 2' isDisabled>
      <Icon>
        <Placeholder />
      </Icon>
      <ListItemContent>
        <ListItemTitle>Item 2</ListItemTitle>
        <ListItemDescription>Description for item 2</ListItemDescription>
      </ListItemContent>
      <Icon>
        <Placeholder />
      </Icon>
    </ListItem>
    <ListItem id='item-3' textValue='Item 3'>
      <ListItemContent>
        <ListItemTitle>Item 3</ListItemTitle>
        <ListItemDescription>Description for item 3</ListItemDescription>
      </ListItemContent>
    </ListItem>
    <ListItem id='item-4' textValue='Item 4'>
      <Icon>
        <Placeholder />
      </Icon>
      <ListItemContent>
        <ListItemTitle>Item 4</ListItemTitle>
      </ListItemContent>
    </ListItem>
    <ListItem id='item-5' textValue='Item 5'>
      <ListItemContent>
        <ListItemTitle>Item 5</ListItemTitle>
      </ListItemContent>
    </ListItem>
  </List>
);

createInteractiveVisualTests({
  componentName: 'List',
  renderComponent: renderListScenario,
  testId: 'test-list',
  variants: LIST_VARIANTS,
  states: ['default'],
  className: WRAPPER_CLASS,
});

// ---------------------------------------------------------------------------
// ListItem — interactive states (unselected)
// ---------------------------------------------------------------------------

interface ListItemVisualProps {
  variant: ListItemVariant;
  isDisabled?: boolean;
}

const listItemVariants = generateVariantMatrix<ListItemVisualProps>({
  dimensions: {
    variant: ['cozy', 'compact'],
  },
});

const renderListItem = (props: ListItemVisualProps) => (
  <List variant={props.variant} selectionMode='single' aria-label='Test list'>
    <ListItem textValue='Test Item' isDisabled={props.isDisabled}>
      <Icon>
        <Placeholder />
      </Icon>
      <ListItemContent>
        <ListItemTitle>Test Item</ListItemTitle>
        <ListItemDescription>Description text</ListItemDescription>
      </ListItemContent>
    </ListItem>
  </List>
);

createInteractiveVisualTests({
  componentName: 'ListItem',
  renderComponent: renderListItem,
  testId: 'test-list-item',
  interactionTarget: '[role="row"]',
  variants: listItemVariants,
  states: ['default', 'hover', 'focus', 'pressed', 'disabled'],
  className: WRAPPER_CLASS,
});

// ---------------------------------------------------------------------------
// ListItem — interactive states (selected)
// ---------------------------------------------------------------------------

const renderSelectedListItem = (props: ListItemVisualProps) => (
  <List
    variant={props.variant}
    selectionMode='single'
    selectedKeys={new Set(['test-item'])}
    aria-label='Test list'
  >
    <ListItem
      id='test-item'
      textValue='Test Item'
      isDisabled={props.isDisabled}
    >
      <Icon>
        <Placeholder />
      </Icon>
      <ListItemContent>
        <ListItemTitle>Test Item</ListItemTitle>
        <ListItemDescription>Description text</ListItemDescription>
      </ListItemContent>
    </ListItem>
  </List>
);

createInteractiveVisualTests({
  componentName: 'ListItemSelected',
  renderComponent: renderSelectedListItem,
  testId: 'test-list-item-selected',
  interactionTarget: '[role="row"]',
  variants: listItemVariants,
  states: ['default', 'hover', 'focus', 'pressed', 'disabled'],
  className: WRAPPER_CLASS,
});
