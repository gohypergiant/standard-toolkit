'use client';

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

import { uuid } from '@accelint/core';
import {
  Button,
  ComboBoxField,
  Drawer,
  Icon,
  Options,
} from '@accelint/design-toolkit';
import {
  Add,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from '@accelint/icons';
import { useCallback, useMemo, useState } from 'react';

// Types for our test data
interface ComboBoxItem {
  id: string;
  name: string;
  description?: string;
}

const PerformanceTest = () => {
  // State for controlling component counts
  const [buttonCount, setButtonCount] = useState<number>(50);
  const [comboBoxOptionCount, setComboBoxOptionCount] = useState<number>(50);

  // Generate unique IDs for drawer components
  const drawerIds = useMemo(
    () => ({
      top: {
        drawer: uuid(),
        views: { a: uuid() },
      },
      bottom: {
        drawer: uuid(),
        views: { a: uuid() },
      },
      left: {
        drawer: uuid(),
        views: { a: uuid() },
      },
      right: {
        drawer: uuid(),
        views: { a: uuid() },
      },
    }),
    [],
  );

  // Generate buttons based on count
  const buttons = useMemo(() => {
    return Array.from({ length: buttonCount }, (_, index) => ({
      id: `button-${index}`,
      label: `Button ${index + 1}`,
      variant:
        index % 5 === 0
          ? 'outline'
          : index % 5 === 1
            ? 'flat'
            : index % 5 === 2
              ? 'icon'
              : index % 5 === 3
                ? 'floating'
                : 'filled',
      color:
        index % 5 === 0
          ? 'mono-muted'
          : index % 5 === 1
            ? 'mono-bold'
            : index % 5 === 2
              ? 'accent'
              : index % 5 === 3
                ? 'serious'
                : 'critical',
      size:
        index % 4 === 0
          ? 'large'
          : index % 4 === 1
            ? 'medium'
            : index % 4 === 2
              ? 'small'
              : 'xsmall',
    }));
  }, [buttonCount]);

  // Generate combobox options based on count
  const comboBoxOptions = useMemo(() => {
    return Array.from({ length: comboBoxOptionCount }, (_, index) => ({
      id: `option-${index}`,
      name: `Option ${index + 1}`,
      description:
        index % 3 === 0 ? `Description for option ${index + 1}` : undefined,
    }));
  }, [comboBoxOptionCount]);

  // Handlers for count adjustments
  const handleButtonCountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseInt(e.target.value, 10);
      if (!isNaN(value) && value >= 0) {
        setButtonCount(value);
      }
    },
    [],
  );

  const handleComboBoxOptionCountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseInt(e.target.value, 10);
      if (!isNaN(value) && value >= 0) {
        setComboBoxOptionCount(value);
      }
    },
    [],
  );

  return (
    <Drawer.Layout extend='left right' push='left right'>
      <Drawer.Layout.Main>
        <div className='p-6 h-full overflow-auto'>
          <div className='mb-6'>
            <h1 className='text-2xl font-bold mb-4'>
              UI Framework Performance Test
            </h1>
            <p className='mb-4'>
              This page is designed to test the performance of the UI framework
              components under load. You can adjust the number of components
              rendered using the controls below.
            </p>

            <div className='flex gap-4 mb-6'>
              <div>
                <label htmlFor='buttonCount' className='block mb-2'>
                  Number of Buttons:
                </label>
                <input
                  id='buttonCount'
                  type='number'
                  value={buttonCount}
                  onChange={handleButtonCountChange}
                  className='border rounded px-3 py-2'
                  min='0'
                />
              </div>

              <div>
                <label htmlFor='comboBoxOptionCount' className='block mb-2'>
                  Number of ComboBox Options:
                </label>
                <input
                  id='comboBoxOptionCount'
                  type='number'
                  value={comboBoxOptionCount}
                  onChange={handleComboBoxOptionCountChange}
                  className='border rounded px-3 py-2'
                  min='0'
                />
              </div>
            </div>
          </div>

          <div className='mb-8'>
            <h2 className='text-xl font-bold mb-4'>Buttons ({buttonCount})</h2>
            <div className='grid grid-cols-5 gap-4'>
              {buttons.map((button) => (
                <Button
                  key={button.id}
                  variant={button.variant as any}
                  color={button.color as any}
                  size={button.size as any}
                >
                  {button.variant === 'icon' ||
                  button.variant === 'floating' ? (
                    <Icon>
                      <Add />
                    </Icon>
                  ) : (
                    button.label
                  )}
                </Button>
              ))}
            </div>
          </div>

          <div className='mb-8'>
            <h2 className='text-xl font-bold mb-4'>
              ComboBox with {comboBoxOptionCount} options
            </h2>
            <div className='max-w-md'>
              <ComboBoxField<ComboBoxItem>
                label='Select an option'
                defaultItems={comboBoxOptions}
                layoutOptions={{ estimatedRowHeight: 46 }}
              >
                {(item) => (
                  <Options.Item key={item.id} textValue={item.name}>
                    <Options.Item.Content>
                      <Options.Item.Label>{item.name}</Options.Item.Label>
                      {item.description && (
                        <Options.Item.Description>
                          {item.description}
                        </Options.Item.Description>
                      )}
                    </Options.Item.Content>
                  </Options.Item>
                )}
              </ComboBoxField>
            </div>
          </div>
        </div>
      </Drawer.Layout.Main>

      {/* Top Drawer */}
      <Drawer id={drawerIds.top.drawer} placement='top' size='medium'>
        <Drawer.Menu>
          <Drawer.Menu.Item
            toggle
            for={drawerIds.top.views.a}
            textValue='Toggle Top Drawer'
          >
            <ChevronDown className='fg-primary-bold cursor-pointer group-open/drawer:rotate-180' />
          </Drawer.Menu.Item>
        </Drawer.Menu>
        <Drawer.Panel>
          <Drawer.Header>
            <Drawer.Header.Title>Top Drawer</Drawer.Header.Title>
          </Drawer.Header>
          <Drawer.Content>
            <Drawer.View id={drawerIds.top.views.a}>
              <div className='p-4'>
                <p>This is the top drawer content area.</p>
              </div>
            </Drawer.View>
          </Drawer.Content>
        </Drawer.Panel>
      </Drawer>

      {/* Bottom Drawer */}
      <Drawer id={drawerIds.bottom.drawer} placement='bottom'>
        <Drawer.Menu>
          <Drawer.Menu.Item
            toggle
            for={drawerIds.bottom.views.a}
            textValue='Toggle Bottom Drawer'
          >
            <ChevronUp className='fg-primary-bold cursor-pointer group-open/drawer:rotate-180' />
          </Drawer.Menu.Item>
        </Drawer.Menu>
        <Drawer.Panel>
          <Drawer.Header>
            <Drawer.Header.Title>Bottom Drawer</Drawer.Header.Title>
          </Drawer.Header>
          <Drawer.Content>
            <Drawer.View id={drawerIds.bottom.views.a}>
              <div className='p-4'>
                <p>This is the bottom drawer content area.</p>
              </div>
            </Drawer.View>
          </Drawer.Content>
        </Drawer.Panel>
      </Drawer>

      {/* Left Drawer */}
      <Drawer id={drawerIds.left.drawer} placement='left'>
        <Drawer.Menu>
          <Drawer.Menu.Item
            toggle
            for={drawerIds.left.views.a}
            textValue='Toggle Left Drawer'
          >
            <ChevronRight className='fg-primary-bold cursor-pointer group-open/drawer:rotate-180' />
          </Drawer.Menu.Item>
        </Drawer.Menu>
        <Drawer.Panel>
          <Drawer.Header>
            <Drawer.Header.Title>Left Drawer</Drawer.Header.Title>
          </Drawer.Header>
          <Drawer.Content>
            <Drawer.View id={drawerIds.left.views.a}>
              <div className='p-4'>
                <p>This is the left drawer content area.</p>
              </div>
            </Drawer.View>
          </Drawer.Content>
        </Drawer.Panel>
      </Drawer>

      {/* Right Drawer */}
      <Drawer id={drawerIds.right.drawer} placement='right'>
        <Drawer.Menu>
          <Drawer.Menu.Item
            toggle
            for={drawerIds.right.views.a}
            textValue='Toggle Right Drawer'
          >
            <ChevronLeft className='fg-primary-bold cursor-pointer group-open/drawer:rotate-180' />
          </Drawer.Menu.Item>
        </Drawer.Menu>
        <Drawer.Panel>
          <Drawer.Header>
            <Drawer.Header.Title>Right Drawer</Drawer.Header.Title>
          </Drawer.Header>
          <Drawer.Content>
            <Drawer.View id={drawerIds.right.views.a}>
              <div className='p-4'>
                <p>This is the right drawer content area.</p>
              </div>
            </Drawer.View>
          </Drawer.Content>
        </Drawer.Panel>
      </Drawer>
    </Drawer.Layout>
  );
};

export default PerformanceTest;
