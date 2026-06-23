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

'use client';

import {
  Accordion,
  AccordionPanel,
  AccordionTrigger,
  Button,
  Checkbox,
  CheckboxGroup,
  ColorPicker,
  ComboBoxField,
  CoordinateField,
  DateField,
  OptionsItem,
  OptionsItemLabel,
  OptionsSection,
  Radio,
  RadioGroup,
  SelectField,
  Slider,
  Switch,
  TextAreaField,
  TextField,
  ToggleButton,
} from '@accelint/design-toolkit';

export function FormsExampleClient() {
  return (
    <div className="mx-auto max-w-6xl p-xl">
      <div className="mb-8">
        <div className="flex gap-xs">
          <div>
            <TextField
              label="TextField"
              inputProps={{
                placeholder: 'Placeholder text',
                type: 'text',
                isClearable: true,
              }}
              description="Helper text"
            />
          </div>
          <div>
            <SelectField
              label="SelectField"
              placeholder="Select option..."
              description="Helper text"
            >
              <OptionsSection>
                <OptionsItem textValue="Option 1">
                  <OptionsItemLabel>Option 1</OptionsItemLabel>
                </OptionsItem>
                <OptionsItem textValue="Option 2">
                  <OptionsItemLabel>Option 2</OptionsItemLabel>
                </OptionsItem>
                <OptionsItem textValue="Option 3">
                  <OptionsItemLabel>Option 3</OptionsItemLabel>
                </OptionsItem>
              </OptionsSection>
            </SelectField>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-m">

        {/* ComboBoxField */}
        <ComboBoxField
          label="Label"
          inputProps={{
            placeholder: 'Search or select...',
          }}
          description="Helper text"
        >
          <OptionsSection>
            <OptionsItem textValue="Item 1">
              <OptionsItemLabel>Item 1</OptionsItemLabel>
            </OptionsItem>
            <OptionsItem textValue="Item 2">
              <OptionsItemLabel>Item 2</OptionsItemLabel>
            </OptionsItem>
            <OptionsItem textValue="Item 3">
              <OptionsItemLabel>Item 3</OptionsItemLabel>
            </OptionsItem>
          </OptionsSection>
        </ComboBoxField>

        {/* DateField */}
        <DateField
          label="Label"
          description="Helper text"
        />

        {/* CoordinateField */}
        <CoordinateField
          label="Label"
          description="Helper text"
        />

        {/* ColorPicker */}
        <ColorPicker
          label="Label"
          items={[
            '#ECECE6',
            '#898989',
            '#62a6ff',
            '#30D27E',
            '#FCA400',
            '#D4231D',
          ]}
        />

        {/* TextAreaField */}
        <div className="md:col-span-2">
          <TextAreaField
            label="Label"
            inputProps={{
              placeholder: 'Enter text here...',
              rows: 3,
            }}
            description="Helper text"
          />
        </div>

        {/* RadioGroup */}
        <RadioGroup label="Label">
          <Radio value="option1">Option 1</Radio>
          <Radio value="option2">Option 2</Radio>
          <Radio value="option3">Option 3</Radio>
        </RadioGroup>

        {/* CheckboxGroup */}
        <CheckboxGroup label="Label">
          <Checkbox value="item1">Item 1</Checkbox>
          <Checkbox value="item2">Item 2</Checkbox>
          <Checkbox value="item3">Item 3</Checkbox>
        </CheckboxGroup>

        {/* Slider */}
        <Slider
          label="Label"
        />

        {/* Switch */}
        <div className="flex items-center gap-3 py-2">
          <Switch>Label text</Switch>
        </div>

        {/* Accordion */}
        <div className="md:col-span-2">
          <Accordion>
            <AccordionTrigger>Accordion Label</AccordionTrigger>
            <AccordionPanel>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </AccordionPanel>
          </Accordion>
        </div>

        {/* Buttons */}
        <div className="md:col-span-2 flex gap-3">
          <Button variant="filled" color="accent">
            Button
          </Button>
          <ToggleButton variant="outline">
            Toggle Button
          </ToggleButton>
        </div>
      </div>
    </div>
  );
}
