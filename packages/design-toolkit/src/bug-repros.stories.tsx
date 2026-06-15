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

/**
 * Temporary repro stories for candidate bugs tracked in /BUGS.md.
 * Each story isolates one suspected bug with the expected vs actual behavior
 * described in its JSDoc. Delete once the bugs are fixed or rejected.
 */

import { useEmit } from '@accelint/bus/react';
import { type UniqueId, uuid } from '@accelint/core';
import { ChevronLeft, Placeholder } from '@accelint/icons';
import { parseDate, parseZonedDateTime } from '@internationalized/date';
import { useState } from 'react';
import { Heading, Text } from 'react-aria-components';
import { Audio } from './components/audio';
import { Button } from './components/button';
import { ColorPicker } from './components/color-picker';
import { ComboBoxField } from './components/combobox-field';
import { DateField } from './components/date-field';
import { Drawer } from './components/drawer';
import { DrawerLayout } from './components/drawer/layout';
import { DrawerLayoutMain } from './components/drawer/layout-main';
import { DrawerMenu } from './components/drawer/menu';
import { DrawerMenuItem } from './components/drawer/menu-item';
import { DrawerPanel } from './components/drawer/panel';
import { DrawerView } from './components/drawer/view';
import { Icon } from './components/icon';
import { OptionsItem } from './components/options/item';
import { OptionsItemContent } from './components/options/item-content';
import { OptionsItemLabel } from './components/options/item-label';
import { Sidenav } from './components/sidenav';
import { SidenavContent } from './components/sidenav/content';
import { SidenavEventTypes } from './components/sidenav/events';
import { SidenavItem } from './components/sidenav/item';
import { SidenavTrigger } from './components/sidenav/trigger';
import { TimeField } from './components/time-field';
import { Tree } from './components/tree';
import { TreeItem } from './components/tree/item';
import { TreeItemContent } from './components/tree/item-content';
import { ViewStack } from './components/view-stack';
import { ViewStackTrigger } from './components/view-stack/trigger';
import { ViewStackView } from './components/view-stack/view';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type {
  SidenavCloseEvent,
  SidenavOpenEvent,
} from './components/sidenav/types';

const meta: Meta = {
  title: 'BugRepros',
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj;

/**
 * BUGS.md #14 — ViewStack loses batched actions.
 * Click "Push B", "Push C", then "Back x2".
 * Expected: View A. Bug: View B (only one pop applies).
 */
const vsIds = { stack: uuid(), a: uuid(), b: uuid(), c: uuid() };
export const ViewStackDoubleBack: Story = {
  render: () => (
    <ViewStack id={vsIds.stack} defaultView={vsIds.a}>
      <ViewStackView id={vsIds.a}>
        <h1 data-testid='current-view'>View A</h1>
        <ViewStackTrigger for={vsIds.b}>
          <Button>Push B</Button>
        </ViewStackTrigger>
      </ViewStackView>
      <ViewStackView id={vsIds.b}>
        <h1 data-testid='current-view'>View B</h1>
        <ViewStackTrigger for={vsIds.c}>
          <Button>Push C</Button>
        </ViewStackTrigger>
      </ViewStackView>
      <ViewStackView id={vsIds.c}>
        <h1 data-testid='current-view'>View C</h1>
        <ViewStackTrigger for={['back', 'back']}>
          <Button>
            <Icon>
              <ChevronLeft />
            </Icon>
            Back x2
          </Button>
        </ViewStackTrigger>
      </ViewStackView>
    </ViewStack>
  ),
};

/**
 * BUGS.md #21 — Sidenav open/close guards race against batched state.
 * Click "Open then Close (same tick)".
 * Expected: nav ends closed. Bug: close handler reads stale isOpen=false and
 * skips, so the nav stays open.
 */
const raceNavId = uuid();
function RaceButtons() {
  const emitOpen = useEmit<SidenavOpenEvent>(SidenavEventTypes.open);
  const emitClose = useEmit<SidenavCloseEvent>(SidenavEventTypes.close);
  return (
    <Button
      onPress={() => {
        emitOpen({ id: raceNavId });
        emitClose({ id: raceNavId });
      }}
    >
      Open then Close (same tick)
    </Button>
  );
}
export const SidenavOpenCloseRace: Story = {
  render: () => (
    <div className='h-[400px]'>
      <DrawerLayout push='left'>
        <DrawerLayoutMain>
          <RaceButtons />
        </DrawerLayoutMain>
        <Sidenav id={raceNavId}>
          <SidenavContent>
            <SidenavItem textValue='Item'>
              <Icon>
                <Placeholder />
              </Icon>
              <Text>Item</Text>
            </SidenavItem>
          </SidenavContent>
        </Sidenav>
      </DrawerLayout>
    </div>
  ),
};

/**
 * BUGS.md #22 — SidenavTrigger silently no-ops for non-UUID ids.
 * Click the trigger. Expected: nav toggles. Bug: nothing happens because the
 * trigger mis-parses the id and emits an undefined event type.
 */
const stringNavId = 'main-nav' as UniqueId;
export const SidenavTriggerStringId: Story = {
  render: () => (
    <div className='h-[400px]'>
      <DrawerLayout push='left'>
        <DrawerLayoutMain>
          <SidenavTrigger for={stringNavId}>
            <Button>Toggle nav (string id)</Button>
          </SidenavTrigger>
        </DrawerLayoutMain>
        <Sidenav id={stringNavId}>
          <SidenavContent>
            <SidenavItem textValue='Item'>
              <Icon>
                <Placeholder />
              </Icon>
              <Text>Item</Text>
            </SidenavItem>
          </SidenavContent>
        </Sidenav>
      </DrawerLayout>
    </div>
  ),
};

/**
 * BUGS.md #16 — ComboBoxField `defaultSelectedKey` renders an empty input.
 * Expected: input shows "Kangaroo" on mount. Bug: input is empty although the
 * option is selected.
 */
const comboItems = [
  { id: 1, name: 'Red Panda' },
  { id: 2, name: 'Cat' },
  { id: 5, name: 'Kangaroo' },
  { id: 6, name: 'Snake' },
];
export const ComboBoxDefaultSelectedKey: Story = {
  render: () => (
    <ComboBoxField
      label='Animal'
      defaultItems={comboItems}
      defaultSelectedKey={5}
    >
      {(item) => (
        <OptionsItem key={item.id} textValue={item.name}>
          <OptionsItemContent>
            <OptionsItemLabel>{item.name}</OptionsItemLabel>
          </OptionsItemContent>
        </OptionsItem>
      )}
    </ComboBoxField>
  ),
};

/**
 * BUGS.md #9 — Audio: changing `src` never switches media.
 * Click "Swap src", then play. Expected: the audio element loads the new URL.
 * Bug: `currentSrc` stays on the old URL because `src` lives on a `<source>`
 * child and the element never re-runs resource selection.
 */
export const AudioSrcSwap: Story = {
  render: () => {
    const [src, setSrc] = useState('/test.mp3?v=1');
    return (
      <div className='flex flex-col gap-m'>
        <Button
          onPress={() =>
            setSrc((s) =>
              s.endsWith('v=1') ? '/test.mp3?v=2' : '/test.mp3?v=1',
            )
          }
        >
          Swap src
        </Button>
        <p data-testid='expected-src'>prop src: {src}</p>
        <Audio src={src} />
      </div>
    );
  },
};

/**
 * BUGS.md #43 — DateField shows description when disabled+small.
 * Expected: small size hides the description in both fields.
 * Bug: the disabled small field shows its description.
 */
export const DateFieldDisabledSmallDescription: Story = {
  render: () => (
    <div className='flex flex-col gap-m'>
      <DateField
        label='Enabled small'
        size='small'
        description='SHOULD-BE-HIDDEN-1'
        defaultValue={parseDate('2026-01-15')}
      />
      <DateField
        label='Disabled small'
        size='small'
        isDisabled
        description='SHOULD-BE-HIDDEN-2'
        defaultValue={parseDate('2026-01-15')}
      />
    </div>
  ),
};

/**
 * BUGS.md #45 — TimeField hardcodes a "Z" suffix without UTC conversion.
 * Value is 12:00 in America/New_York (= 17:00 UTC).
 * Expected: shows 17:00 with Z (or local time without Z).
 * Bug: shows 12:00 labeled Z.
 */
export const TimeFieldZonedZ: Story = {
  render: () => (
    <TimeField
      label='Zoned time'
      defaultValue={parseZonedDateTime('2026-01-15T12:00[America/New_York]')}
    />
  ),
};

/**
 * BUGS.md #44 — ColorPicker drops alpha from RGBA tuples.
 * Items include [212,35,29,255] and [212,35,29,128] (same RGB, different alpha).
 * Expected: two visually different swatches. Bug: both render opaque and
 * collapse to duplicate React keys (console warning).
 */
export const ColorPickerAlpha: Story = {
  render: () => (
    <ColorPicker
      items={[
        [212, 35, 29, 255],
        [212, 35, 29, 128],
        [48, 210, 126, 64],
      ]}
    />
  ),
};

/**
 * BUGS.md #40 — Tree drops `onSelectionChange` for uncontrolled trees.
 * Click a row's checkbox. Expected: the counter increments.
 * Bug: callback is never wired because no `selectedKeys` prop was passed.
 */
export const TreeUncontrolledSelection: Story = {
  render: () => {
    const [count, setCount] = useState(0);
    return (
      <div className='flex flex-col gap-m'>
        <p data-testid='selection-count'>onSelectionChange calls: {count}</p>
        <Tree
          aria-label='Uncontrolled selection'
          selectionMode='multiple'
          style={{ width: 400 }}
          onSelectionChange={() => setCount((c) => c + 1)}
        >
          <TreeItem id='one' textValue='one'>
            <TreeItemContent>Item One</TreeItemContent>
          </TreeItem>
          <TreeItem id='two' textValue='two'>
            <TreeItemContent>Item Two</TreeItemContent>
          </TreeItem>
        </Tree>
      </div>
    );
  },
};

/**
 * BUGS.md #48 — Drawer open/toggle emits a spurious `onChange(null)`.
 * Switch between views via the menu. Expected log: "b" then "a" etc.
 * Bug: every switch logs "null" immediately before the view id.
 */
const drawerIds = {
  drawer: uuid(),
  a: uuid(),
  b: uuid(),
};
export const DrawerOnChangeNull: Story = {
  render: () => {
    const [log, setLog] = useState<string[]>([]);
    return (
      <div className='h-[400px]'>
        <DrawerLayout>
          <DrawerLayoutMain>
            <p data-testid='change-log'>
              onChange log: {log.join(' → ') || '(empty)'}
            </p>
          </DrawerLayoutMain>
          <Drawer
            id={drawerIds.drawer}
            placement='left'
            onChange={(view) =>
              setLog((l) => [
                ...l,
                view === null ? 'null' : view === drawerIds.a ? 'a' : 'b',
              ])
            }
          >
            <DrawerMenu>
              <DrawerMenuItem for={drawerIds.a} textValue='A'>
                <Placeholder />
              </DrawerMenuItem>
              <DrawerMenuItem for={drawerIds.b} textValue='B'>
                <Placeholder />
              </DrawerMenuItem>
            </DrawerMenu>
            <DrawerPanel>
              <DrawerView id={drawerIds.a}>
                <Heading>View A</Heading>
              </DrawerView>
              <DrawerView id={drawerIds.b}>
                <Heading>View B</Heading>
              </DrawerView>
            </DrawerPanel>
          </Drawer>
        </DrawerLayout>
      </div>
    );
  },
};
