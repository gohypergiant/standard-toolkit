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
import { uuid } from '@accelint/core';
import {
  Button,
  Checkbox,
  Chip,
  DateField,
  Drawer,
  Icon,
  Options,
  Radio,
  SelectField,
  Slider,
  Switch,
  Tabs,
  TextField,
  useTheme,
} from '@accelint/design-toolkit';
import Placeholder from '@accelint/icons/placeholder';

const drawerIds = {
  drawer: uuid(),
  a: uuid(),
  b: uuid(),
  c: uuid(),
};

const divider = <div className='h-px w-full bg-accent-primary-muted' />;

export default function KitchenSink() {
  const theme = useTheme();
  return (
    <div className='w-full h-full'>
      <Drawer.Layout>
        <Drawer.Layout.Main className='flex gap-xxl p-l'>
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
            <SelectField isRequired label='Select field'>
              <Options.Section header='North American Birds'>
                <Options.Item textValue='Blue Jay'>
                  <Icon>
                    <Placeholder />
                  </Icon>
                  <Options.Item.Label>Blue Jay</Options.Item.Label>
                </Options.Item>
                <Options.Item textValue='Gray catbird'>
                  <Icon>
                    <Placeholder />
                  </Icon>
                  <Options.Item.Label>Gray catbird</Options.Item.Label>
                </Options.Item>
                <Options.Item textValue='Black-capped chickadee'>
                  <Icon>
                    <Placeholder />
                  </Icon>
                  <Options.Item.Label>
                    Black-capped chickadee
                  </Options.Item.Label>
                </Options.Item>
                <Options.Item textValue='Song Sparrow'>
                  <Icon>
                    <Placeholder />
                  </Icon>
                  <Options.Item.Label>Song Sparrow</Options.Item.Label>
                </Options.Item>
              </Options.Section>
              <Options.Section header='African Birds'>
                <Options.Item textValue='Lilac-breasted roller'>
                  <Icon>
                    <Placeholder />
                  </Icon>
                  <Options.Item.Label>Lilac-breasted roller</Options.Item.Label>
                </Options.Item>
                <Options.Item textValue='Hornbill'>
                  <Icon>
                    <Placeholder />
                  </Icon>
                  <Options.Item.Label>Hornbill</Options.Item.Label>
                </Options.Item>
              </Options.Section>
            </SelectField>
            {divider}
            <DateField
              label='Date field'
              description='Helper text'
              isRequired
            />
            {divider}
            <Tabs orientation='horizontal'>
              <Tabs.List>
                <Tabs.List.Tab id='uno'>Tab 1</Tabs.List.Tab>
                <Tabs.List.Tab id='dos'>Tab 2</Tabs.List.Tab>
                <Tabs.List.Tab id='tres' isDisabled>
                  Tab 3
                </Tabs.List.Tab>
              </Tabs.List>
            </Tabs>
            {divider}
            <Tabs orientation='vertical'>
              <Tabs.List>
                <Tabs.List.Tab id='uno'>Tab 1</Tabs.List.Tab>
                <Tabs.List.Tab id='dos'>Tab 2</Tabs.List.Tab>
                <Tabs.List.Tab id='tres' isDisabled>
                  Tab 3
                </Tabs.List.Tab>
              </Tabs.List>
            </Tabs>
          </div>
          <div>
            <h2 className='fg-primary-bold'>Javascript token override test</h2>
            <p className='fg-primary-muted'>
              The two boxes should be the same color
            </p>
            <div className='flex gap-m'>
              <div className='size-xxl rounded-medium bg-accent-primary-bold' />
              <div
                className='size-xxl rounded-medium'
                style={{
                  backgroundColor: `rgba(${theme.tokens.bg.accent.primary.bold.join(',')})`,
                }}
              />
            </div>
          </div>
        </Drawer.Layout.Main>
        <Drawer id={drawerIds.drawer} placement='right' size='large'>
          <Drawer.Menu>
            <Drawer.Menu.Item toggle for={drawerIds.a}>
              A
            </Drawer.Menu.Item>
            <Drawer.Menu.Item toggle for={drawerIds.b}>
              B
            </Drawer.Menu.Item>
            <Drawer.Menu.Item toggle for={drawerIds.c}>
              C
            </Drawer.Menu.Item>
          </Drawer.Menu>
          <Drawer.Panel>
            <Drawer.Header>
              <Drawer.Header.Title>Title</Drawer.Header.Title>
              <Drawer.Trigger for='close'>
                <Button>Close</Button>
              </Drawer.Trigger>
            </Drawer.Header>
            <Drawer.Content>
              <Drawer.View id={drawerIds.a}>View A</Drawer.View>
              <Drawer.View id={drawerIds.b}>View B</Drawer.View>
              <Drawer.View id={drawerIds.c}>View C</Drawer.View>
            </Drawer.Content>
            <Drawer.Footer>Footer</Drawer.Footer>
          </Drawer.Panel>
        </Drawer>
      </Drawer.Layout>
    </div>
  );
}
