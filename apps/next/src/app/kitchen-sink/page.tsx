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

'use client';
import {
  Button,
  Checkbox,
  Chip,
  DateField,
  Icon,
  Radio,
  Slider,
  Switch,
  Tabs,
  TextField,
} from '@accelint/design-toolkit';
import Placeholder from '@accelint/icons/placeholder';

const divider = <div className='h-px w-full bg-accent-primary-muted' />;

export default function KitchenSink() {
  return (
    <div className='flex w-full h-full gap-xxl p-l'>
      <div className='flex flex-col gap-s items-start w-[200px]'>
        <Button>Default</Button>
        <Button color='serious'>Serious</Button>
        <Button color='critical'>Critical</Button>
        <Button variant='outline'>Outline</Button>
        <Button variant='outline' color='serious'>
          Outline Serious
        </Button>
        <Button variant='outline' color='critical'>
          Outline Critical
        </Button>
        <Button variant='flat'>Flat</Button>
        <Button variant='flat' color='serious'>
          Flat Serious
        </Button>
        <Button variant='flat' color='critical'>
          Flat Critical
        </Button>
        <Button variant='icon'>
          <Icon>
            <Placeholder />
          </Icon>
        </Button>
        <Button variant='icon' color='serious'>
          <Icon>
            <Placeholder />
          </Icon>
        </Button>
        <Button variant='icon' color='critical'>
          <Icon>
            <Placeholder />
          </Icon>
        </Button>
      </div>
      <div className='flex flex-col gap-s items-start w-[200px]'>
        <Checkbox>Checkbox</Checkbox>
        <Checkbox isIndeterminate isSelected={false}>
          Indeterminate
        </Checkbox>
        <Checkbox isSelected>Selected</Checkbox>
        {divider}
        <Radio.Group defaultValue='1'>
          <Radio value='1'>Radio 1</Radio>
          <Radio value='2'>Radio 2</Radio>
          <Radio value='3'>Radio 3</Radio>
        </Radio.Group>
        {divider}
        <Switch labelPosition='start'>switch</Switch>
        <Switch labelPosition='start' isSelected>
          switch
        </Switch>
        <Switch labelPosition='end'>switch</Switch>
        <Switch labelPosition='end' isSelected>
          switch
        </Switch>
        {divider}
        <Chip.List>
          <Chip>chip</Chip>
          <Chip variant='normal'>chip</Chip>
          <Chip variant='advisory'>chip</Chip>
          <Chip variant='serious'>chip</Chip>
          <Chip variant='critical'>chip</Chip>
        </Chip.List>
        {divider}
        <Slider
          classNames={{
            slider: 'w-full',
          }}
          minValue={0}
          maxValue={100}
          defaultValue={50}
          label='Slider'
        />
      </div>
      <div className='flex flex-col gap-s items-start w-[200px]'>
        <TextField
          label='Text field'
          description='Helper text'
          isRequired
          inputProps={{
            placeholder: 'Placeholder',
          }}
        />
        {divider}
        <DateField label='Date field' description='Helper text' isRequired />
        {divider}
        <Tabs orientation='horizontal'>
          <Tabs.List>
            <Tabs.Tab id='uno'>Tab 1</Tabs.Tab>
            <Tabs.Tab id='dos'>Tab 2</Tabs.Tab>
            <Tabs.Tab id='tres' isDisabled>
              Tab 3
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>
        {divider}
        <Tabs orientation='vertical'>
          <Tabs.List>
            <Tabs.Tab id='uno'>Tab 1</Tabs.Tab>
            <Tabs.Tab id='dos'>Tab 2</Tabs.Tab>
            <Tabs.Tab id='tres' isDisabled>
              Tab 3
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </div>
    </div>
  );
}
