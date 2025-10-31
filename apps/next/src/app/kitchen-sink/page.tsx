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
/** biome-ignore-all lint/correctness/useUniqueElementIds: ids are unique for each element */

'use client';
import { uuid } from '@accelint/core';
import {
  Button,
  Checkbox,
  Chip,
  ChipList,
  DateField,
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerHeaderTitle,
  DrawerLayout,
  DrawerLayoutMain,
  DrawerMenu,
  DrawerMenuItem,
  DrawerPanel,
  DrawerTrigger,
  DrawerView,
  Icon,
  OptionsItem,
  OptionsItemLabel,
  OptionsSection,
  Radio,
  RadioGroup,
  SelectField,
  Slider,
  Switch,
  Tab,
  TabList,
  TabPanel,
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
      <DrawerLayout>
        <DrawerLayoutMain className='flex gap-xxl p-l'>
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
            <RadioGroup defaultValue='1'>
              <Radio value='1'>Radio 1</Radio>
              <Radio value='2'>Radio 2</Radio>
              <Radio value='3'>Radio 3</Radio>
            </RadioGroup>
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
            <ChipList>
              <Chip>chip</Chip>
              <Chip variant='normal'>chip</Chip>
              <Chip variant='advisory'>chip</Chip>
              <Chip variant='serious'>chip</Chip>
              <Chip variant='critical'>chip</Chip>
            </ChipList>
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
              <OptionsSection header='North American Birds'>
                <OptionsItem textValue='Blue Jay'>
                  <Icon>
                    <Placeholder />
                  </Icon>
                  <OptionsItemLabel>Blue Jay</OptionsItemLabel>
                </OptionsItem>
                <OptionsItem textValue='Gray catbird'>
                  <Icon>
                    <Placeholder />
                  </Icon>
                  <OptionsItemLabel>Gray catbird</OptionsItemLabel>
                </OptionsItem>
                <OptionsItem textValue='Black-capped chickadee'>
                  <Icon>
                    <Placeholder />
                  </Icon>
                  <OptionsItemLabel>Black-capped chickadee</OptionsItemLabel>
                </OptionsItem>
                <OptionsItem textValue='Song Sparrow'>
                  <Icon>
                    <Placeholder />
                  </Icon>
                  <OptionsItemLabel>Song Sparrow</OptionsItemLabel>
                </OptionsItem>
              </OptionsSection>
              <OptionsSection header='African Birds'>
                <OptionsItem textValue='Lilac-breasted roller'>
                  <Icon>
                    <Placeholder />
                  </Icon>
                  <OptionsItemLabel>Lilac-breasted roller</OptionsItemLabel>
                </OptionsItem>
                <OptionsItem textValue='Hornbill'>
                  <Icon>
                    <Placeholder />
                  </Icon>
                  <OptionsItemLabel>Hornbill</OptionsItemLabel>
                </OptionsItem>
              </OptionsSection>
            </SelectField>
            {divider}
            <DateField
              label='Date field'
              description='Helper text'
              isRequired
            />
            {divider}
            <Tabs orientation='horizontal'>
              <TabList>
                <Tab id='uno'>Tab 1</Tab>
                <Tab id='dos'>Tab 2</Tab>
                <Tab id='tres' isDisabled>
                  Tab 3
                </Tab>
              </TabList>
              <TabPanel id='uno'>Content 1</TabPanel>
              <TabPanel id='dos'>Content 2</TabPanel>
              <TabPanel id='tres'>Content 3</TabPanel>
            </Tabs>
            {divider}
            <Tabs orientation='vertical'>
              <TabList>
                <Tab id='uno'>Tab 1</Tab>
                <Tab id='dos'>Tab 2</Tab>
                <Tab id='tres' isDisabled>
                  Tab 3
                </Tab>
              </TabList>
              <TabPanel id='uno'>Content 1</TabPanel>
              <TabPanel id='dos'>Content 2</TabPanel>
              <TabPanel id='tres'>Content 3</TabPanel>
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
        </DrawerLayoutMain>
        <Drawer id={drawerIds.drawer} placement='right' size='large'>
          <DrawerMenu>
            <DrawerMenuItem toggle for={drawerIds.a} textValue='Menu A'>
              A
            </DrawerMenuItem>
            <DrawerMenuItem toggle for={drawerIds.b} textValue='Menu B'>
              B
            </DrawerMenuItem>
            <DrawerMenuItem toggle for={drawerIds.c} textValue='Menu C'>
              C
            </DrawerMenuItem>
          </DrawerMenu>
          <DrawerPanel>
            <DrawerHeader>
              <DrawerHeaderTitle>Title</DrawerHeaderTitle>
              <DrawerTrigger for='close'>
                <Button>Close</Button>
              </DrawerTrigger>
            </DrawerHeader>
            <DrawerContent>
              <DrawerView id={drawerIds.a}>View A</DrawerView>
              <DrawerView id={drawerIds.b}>View B</DrawerView>
              <DrawerView id={drawerIds.c}>View C</DrawerView>
            </DrawerContent>
            <DrawerFooter>Footer</DrawerFooter>
          </DrawerPanel>
        </Drawer>
      </DrawerLayout>
    </div>
  );
}
