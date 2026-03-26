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

import {
  OptionsItem,
  OptionsItemContent,
  OptionsItemDescription,
  OptionsItemLabel,
  OptionsSection,
  SelectField,
} from '@accelint/design-toolkit';
import { Icon } from '@accelint/design-toolkit/components/icon';
import PlaceholderIcon from '@accelint/icons/placeholder';
import {
  createInteractiveVisualTests,
  createVisualTestScenarios,
  type VisualTestScenario,
} from '~/visual-regression/vitest';
import { BASE_PROPS, type SelectFieldScenarioProps } from './variants';

function flatOptions() {
  return (
    <>
      <OptionsItem id='blue-jay' textValue='Blue Jay'>
        <OptionsItemLabel>Blue Jay</OptionsItemLabel>
      </OptionsItem>
      <OptionsItem id='cardinal' textValue='Cardinal'>
        <OptionsItemLabel>Cardinal</OptionsItemLabel>
      </OptionsItem>
      <OptionsItem id='sparrow' textValue='Song Sparrow'>
        <OptionsItemLabel>Song Sparrow</OptionsItemLabel>
      </OptionsItem>
      <OptionsItem id='robin' textValue='Robin'>
        <OptionsItemLabel>Robin</OptionsItemLabel>
      </OptionsItem>
    </>
  );
}

function sectionOptions() {
  return (
    <>
      <OptionsSection header='North American Birds'>
        <OptionsItem id='blue-jay' textValue='Blue Jay'>
          <OptionsItemLabel>Blue Jay</OptionsItemLabel>
        </OptionsItem>
        <OptionsItem id='cardinal' textValue='Cardinal'>
          <OptionsItemLabel>Cardinal</OptionsItemLabel>
        </OptionsItem>
      </OptionsSection>
      <OptionsSection header='African Birds'>
        <OptionsItem id='roller' textValue='Lilac-breasted roller'>
          <OptionsItemLabel>Lilac-breasted roller</OptionsItemLabel>
        </OptionsItem>
        <OptionsItem id='hornbill' textValue='Hornbill'>
          <OptionsItemLabel>Hornbill</OptionsItemLabel>
        </OptionsItem>
      </OptionsSection>
    </>
  );
}

function disabledItemOptions() {
  return (
    <>
      <OptionsItem id='blue-jay' textValue='Blue Jay'>
        <OptionsItemLabel>Blue Jay</OptionsItemLabel>
      </OptionsItem>
      <OptionsItem id='cardinal' textValue='Cardinal' isDisabled>
        <OptionsItemLabel>Cardinal</OptionsItemLabel>
      </OptionsItem>
      <OptionsItem id='sparrow' textValue='Song Sparrow'>
        <OptionsItemLabel>Song Sparrow</OptionsItemLabel>
      </OptionsItem>
      <OptionsItem id='robin' textValue='Robin' isDisabled>
        <OptionsItemLabel>Robin</OptionsItemLabel>
      </OptionsItem>
    </>
  );
}

function coloredItemOptions() {
  return (
    <>
      <OptionsItem id='blue-jay' textValue='Blue Jay'>
        <OptionsItemLabel>Blue Jay</OptionsItemLabel>
      </OptionsItem>
      <OptionsItem id='cardinal' textValue='Cardinal' color='info'>
        <OptionsItemLabel>Cardinal</OptionsItemLabel>
      </OptionsItem>
      <OptionsItem id='sparrow' textValue='Song Sparrow' color='serious'>
        <OptionsItemLabel>Song Sparrow</OptionsItemLabel>
      </OptionsItem>
      <OptionsItem id='robin' textValue='Robin' color='critical'>
        <OptionsItemLabel>Robin</OptionsItemLabel>
      </OptionsItem>
    </>
  );
}

function descriptionOptions() {
  return (
    <>
      <OptionsItem id='blue-jay' textValue='Blue Jay'>
        <OptionsItemContent>
          <OptionsItemLabel>Blue Jay</OptionsItemLabel>
          <OptionsItemDescription>Corvid songbird</OptionsItemDescription>
        </OptionsItemContent>
      </OptionsItem>
      <OptionsItem id='cardinal' textValue='Cardinal'>
        <OptionsItemContent>
          <OptionsItemLabel>Cardinal</OptionsItemLabel>
          <OptionsItemDescription>Bright red finch</OptionsItemDescription>
        </OptionsItemContent>
      </OptionsItem>
      <OptionsItem id='sparrow' textValue='Song Sparrow'>
        <OptionsItemContent>
          <OptionsItemLabel>Song Sparrow</OptionsItemLabel>
          <OptionsItemDescription>Small passerine</OptionsItemDescription>
        </OptionsItemContent>
      </OptionsItem>
      <OptionsItem id='robin' textValue='Robin'>
        <OptionsItemContent>
          <OptionsItemLabel>Robin</OptionsItemLabel>
          <OptionsItemDescription>Migratory thrush</OptionsItemDescription>
        </OptionsItemContent>
      </OptionsItem>
    </>
  );
}

function iconOptions() {
  return (
    <>
      <OptionsItem id='blue-jay' textValue='Blue Jay'>
        <Icon>
          <PlaceholderIcon />
        </Icon>
        <OptionsItemLabel>Blue Jay</OptionsItemLabel>
      </OptionsItem>
      <OptionsItem id='cardinal' textValue='Cardinal'>
        <Icon>
          <PlaceholderIcon />
        </Icon>
        <OptionsItemLabel>Cardinal</OptionsItemLabel>
      </OptionsItem>
      <OptionsItem id='sparrow' textValue='Song Sparrow'>
        <Icon>
          <PlaceholderIcon />
        </Icon>
        <OptionsItemLabel>Song Sparrow</OptionsItemLabel>
      </OptionsItem>
      <OptionsItem id='robin' textValue='Robin'>
        <Icon>
          <PlaceholderIcon />
        </Icon>
        <OptionsItemLabel>Robin</OptionsItemLabel>
      </OptionsItem>
    </>
  );
}

function fullCompositionOptions() {
  return (
    <>
      <OptionsItem id='blue-jay' textValue='Blue Jay'>
        <Icon>
          <PlaceholderIcon />
        </Icon>
        <OptionsItemContent>
          <OptionsItemLabel>Blue Jay</OptionsItemLabel>
          <OptionsItemDescription>Corvid songbird</OptionsItemDescription>
        </OptionsItemContent>
      </OptionsItem>
      <OptionsItem id='cardinal' textValue='Cardinal'>
        <Icon>
          <PlaceholderIcon />
        </Icon>
        <OptionsItemContent>
          <OptionsItemLabel>Cardinal</OptionsItemLabel>
          <OptionsItemDescription>Bright red finch</OptionsItemDescription>
        </OptionsItemContent>
      </OptionsItem>
      <OptionsItem id='sparrow' textValue='Song Sparrow'>
        <Icon>
          <PlaceholderIcon />
        </Icon>
        <OptionsItemContent>
          <OptionsItemLabel>Song Sparrow</OptionsItemLabel>
          <OptionsItemDescription>Small passerine</OptionsItemDescription>
        </OptionsItemContent>
      </OptionsItem>
      <OptionsItem id='robin' textValue='Robin'>
        <Icon>
          <PlaceholderIcon />
        </Icon>
        <OptionsItemContent>
          <OptionsItemLabel>Robin</OptionsItemLabel>
          <OptionsItemDescription>Migratory thrush</OptionsItemDescription>
        </OptionsItemContent>
      </OptionsItem>
    </>
  );
}

const SCENARIOS: VisualTestScenario[] = [
  // Closed states
  {
    name: 'closed empty',
    className: 'inline-block p-s',
    screenshotName: 'select-field-closed-empty.png',
    render: () => <SelectField {...BASE_PROPS}>{flatOptions()}</SelectField>,
  },
  {
    name: 'closed with selected value',
    className: 'inline-block p-s',
    screenshotName: 'select-field-closed-selected.png',
    render: () => (
      <SelectField {...BASE_PROPS} defaultSelectedKey='blue-jay'>
        {flatOptions()}
      </SelectField>
    ),
  },
  // Open states
  {
    name: 'open default',
    className: 'inline-block',
    screenshotName: 'select-field-open-default.png',
    render: () => (
      <SelectField {...BASE_PROPS} isOpen>
        {flatOptions()}
      </SelectField>
    ),
    selector: '[role="listbox"]',
    waitMs: 300,
  },
  {
    name: 'open full component',
    className: 'inline-block min-h-80 p-s',
    screenshotName: 'select-field-open-full.png',
    render: () => (
      <SelectField {...BASE_PROPS} isOpen>
        {flatOptions()}
      </SelectField>
    ),
    waitMs: 300,
  },
  {
    name: 'open with sections',
    className: 'inline-block',
    screenshotName: 'select-field-open-sections.png',
    render: () => (
      <SelectField {...BASE_PROPS} isOpen>
        {sectionOptions()}
      </SelectField>
    ),
    selector: '[role="listbox"]',
    waitMs: 300,
  },
  {
    name: 'open with disabled items',
    className: 'inline-block',
    screenshotName: 'select-field-open-disabled-items.png',
    render: () => (
      <SelectField {...BASE_PROPS} isOpen>
        {disabledItemOptions()}
      </SelectField>
    ),
    selector: '[role="listbox"]',
    waitMs: 300,
  },
  {
    name: 'open with colored items',
    className: 'inline-block',
    screenshotName: 'select-field-open-colored-items.png',
    render: () => (
      <SelectField {...BASE_PROPS} isOpen>
        {coloredItemOptions()}
      </SelectField>
    ),
    selector: '[role="listbox"]',
    waitMs: 300,
  },
  {
    name: 'open with colored selected item',
    className: 'inline-block',
    screenshotName: 'select-field-open-colored-selected.png',
    render: () => (
      <SelectField {...BASE_PROPS} isOpen defaultSelectedKey='sparrow'>
        {coloredItemOptions()}
      </SelectField>
    ),
    selector: '[role="listbox"]',
    waitMs: 300,
  },
  {
    name: 'open with descriptions',
    className: 'inline-block',
    screenshotName: 'select-field-open-descriptions.png',
    render: () => (
      <SelectField {...BASE_PROPS} isOpen>
        {descriptionOptions()}
      </SelectField>
    ),
    selector: '[role="listbox"]',
    waitMs: 300,
  },
  {
    name: 'open with icons',
    className: 'inline-block',
    screenshotName: 'select-field-open-icons.png',
    render: () => (
      <SelectField {...BASE_PROPS} isOpen>
        {iconOptions()}
      </SelectField>
    ),
    selector: '[role="listbox"]',
    waitMs: 300,
  },
  {
    name: 'open with full composition',
    className: 'inline-block',
    screenshotName: 'select-field-open-full-composition.png',
    render: () => (
      <SelectField {...BASE_PROPS} isOpen>
        {fullCompositionOptions()}
      </SelectField>
    ),
    selector: '[role="listbox"]',
    waitMs: 300,
  },
  // Form states
  {
    name: 'disabled',
    className: 'inline-block p-s',
    screenshotName: 'select-field-disabled.png',
    render: () => (
      <SelectField {...BASE_PROPS} isDisabled>
        {flatOptions()}
      </SelectField>
    ),
  },
  {
    name: 'invalid with error',
    className: 'inline-block p-s',
    screenshotName: 'select-field-invalid-error.png',
    render: () => (
      <SelectField
        {...BASE_PROPS}
        description={undefined}
        isInvalid
        errorMessage='A bird selection is required'
      >
        {flatOptions()}
      </SelectField>
    ),
  },
  {
    name: 'readonly',
    className: 'inline-block p-s',
    screenshotName: 'select-field-readonly.png',
    render: () => (
      <SelectField {...BASE_PROPS} isReadOnly defaultSelectedKey='blue-jay'>
        {flatOptions()}
      </SelectField>
    ),
  },
  {
    name: 'required',
    className: 'inline-block p-s',
    screenshotName: 'select-field-required.png',
    render: () => (
      <SelectField {...BASE_PROPS} isRequired>
        {flatOptions()}
      </SelectField>
    ),
  },
  // Size variants
  {
    name: 'small closed',
    className: 'inline-block p-s',
    screenshotName: 'select-field-small-closed.png',
    render: () => (
      <SelectField {...BASE_PROPS} size='small'>
        {flatOptions()}
      </SelectField>
    ),
  },
  {
    name: 'small open',
    className: 'inline-block',
    screenshotName: 'select-field-small-open.png',
    render: () => (
      <SelectField {...BASE_PROPS} size='small' isOpen>
        {flatOptions()}
      </SelectField>
    ),
    selector: '[role="listbox"]',
    waitMs: 300,
  },
];

createVisualTestScenarios('SelectField', SCENARIOS);

createInteractiveVisualTests<SelectFieldScenarioProps>({
  componentName: 'SelectField',
  renderComponent: (props) => (
    <SelectField {...props}>{flatOptions()}</SelectField>
  ),
  interactionTarget: 'button',
  className: 'p-s',
  variants: [
    { id: 'default', name: 'Default', props: BASE_PROPS },
    {
      id: 'selected',
      name: 'Selected',
      props: { ...BASE_PROPS, selectedKey: 'blue-jay' },
    },
    {
      id: 'invalid',
      name: 'Invalid',
      props: {
        ...BASE_PROPS,
        isInvalid: true,
        errorMessage: 'A bird selection is required',
      },
    },
    { id: 'small', name: 'Small', props: { ...BASE_PROPS, size: 'small' } },
    {
      id: 'readonly',
      name: 'Readonly',
      props: { ...BASE_PROPS, isReadOnly: true, selectedKey: 'blue-jay' },
    },
    {
      id: 'required',
      name: 'Required',
      props: { ...BASE_PROPS, isRequired: true },
    },
  ],
  states: ['default', 'hover', 'focus', 'pressed', 'disabled'],
});
