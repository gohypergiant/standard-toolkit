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

import { useEmit } from '@accelint/bus/react';
import { uuid } from '@accelint/core';
import { Divider } from '@accelint/design-toolkit/components/divider';
import { DrawerLayout } from '@accelint/design-toolkit/components/drawer/layout';
import { DrawerLayoutMain } from '@accelint/design-toolkit/components/drawer/layout-main';
import { Icon } from '@accelint/design-toolkit/components/icon';
import { Sidenav } from '@accelint/design-toolkit/components/sidenav';
import { SidenavAvatar } from '@accelint/design-toolkit/components/sidenav/avatar';
import { SidenavContent } from '@accelint/design-toolkit/components/sidenav/content';
import { SidenavEventTypes } from '@accelint/design-toolkit/components/sidenav/events';
import { SidenavFooter } from '@accelint/design-toolkit/components/sidenav/footer';
import { SidenavHeader } from '@accelint/design-toolkit/components/sidenav/header';
import { SidenavItem } from '@accelint/design-toolkit/components/sidenav/item';
import { SidenavLink } from '@accelint/design-toolkit/components/sidenav/link';
import { SidenavMenu } from '@accelint/design-toolkit/components/sidenav/menu';
import { SidenavMenuItem } from '@accelint/design-toolkit/components/sidenav/menu-item';
import Placeholder from '@accelint/icons/placeholder';
import { useEffect, useMemo } from 'react';
import { Heading, Text } from 'react-aria-components';
import {
  createInteractiveVisualTests,
  createVisualTestScenarios,
  generateVariantMatrix,
} from '~/visual-regression/vitest';
import type { UniqueId } from '@accelint/core';
import type { SidenavOpenEvent } from '@accelint/design-toolkit/components/sidenav/types';
import { type SidenavScenario, PROP_COMBOS } from './variants';

// ---------------------------------------------------------------------------
// Helper: emit Sidenav:open on mount to programmatically expand the sidenav
// ---------------------------------------------------------------------------

function OpenSidenav({ id }: { id: UniqueId }) {
  const emit = useEmit<SidenavOpenEvent>(SidenavEventTypes.open);
  useEffect(() => {
    emit({ id });
  }, [emit, id]);
  return null;
}

// ---------------------------------------------------------------------------
// Shared render helpers
// ---------------------------------------------------------------------------

function SidenavShell({
  isOpen = false,
  isHiddenWhenClosed,
  children,
}: {
  isOpen?: boolean;
  isHiddenWhenClosed?: boolean;
  children?: React.ReactNode;
}) {
  const id = useMemo(() => uuid(), []);

  return (
    <DrawerLayout className='relative min-h-[400px] min-w-[300px]'>
      <Sidenav id={id} isHiddenWhenClosed={isHiddenWhenClosed}>
        {children}
      </Sidenav>
      <DrawerLayoutMain>
        <div className='flex h-full items-center justify-center'>Main</div>
      </DrawerLayoutMain>
      {isOpen && <OpenSidenav id={id} />}
    </DrawerLayout>
  );
}

function DefaultSidenavContent({
  hasDisabledItems,
}: {
  hasDisabledItems?: boolean;
}) {
  const ids = useMemo(
    () => ({
      item1: uuid(),
      item2: uuid(),
      item3: uuid(),
    }),
    [],
  );

  return (
    <>
      <SidenavHeader>
        <SidenavAvatar>
          <Icon>
            <Placeholder />
          </Icon>
          <Heading>App Name</Heading>
          <Text>Subtitle</Text>
        </SidenavAvatar>
      </SidenavHeader>
      <SidenavContent>
        <Heading>Navigation</Heading>
        <SidenavItem
          id={ids.item1}
          textValue='Dashboard'
          isDisabled={hasDisabledItems}
        >
          <Icon>
            <Placeholder />
          </Icon>
          <Text>Dashboard</Text>
        </SidenavItem>
        <SidenavItem id={ids.item2} textValue='Settings' isSelected>
          <Icon>
            <Placeholder />
          </Icon>
          <Text>Settings</Text>
        </SidenavItem>
        <Divider />
        <Heading>External</Heading>
        <SidenavLink
          href='#'
          textValue='Documentation'
          isDisabled={hasDisabledItems}
        >
          <Icon>
            <Placeholder />
          </Icon>
          <Text>Documentation</Text>
        </SidenavLink>
        <Divider />
        <Heading>Menu</Heading>
        <SidenavMenu
          icon={
            <Icon>
              <Placeholder />
            </Icon>
          }
          title='More Options'
        >
          <SidenavMenuItem>
            <Text>Sub item A</Text>
          </SidenavMenuItem>
          <SidenavMenuItem isDisabled={hasDisabledItems}>
            <Text>Sub item B</Text>
          </SidenavMenuItem>
        </SidenavMenu>
      </SidenavContent>
      <SidenavFooter>
        <SidenavItem id={ids.item3} textValue='User'>
          <SidenavAvatar>
            <Icon>
              <Placeholder />
            </Icon>
            <Heading>User Name</Heading>
            <Text>user@example.com</Text>
          </SidenavAvatar>
        </SidenavItem>
      </SidenavFooter>
    </>
  );
}

// ---------------------------------------------------------------------------
// Builder 1: Static scenarios (createVisualTestScenarios)
// ---------------------------------------------------------------------------

function SidenavScenarioComponent({ scenario }: { scenario: SidenavScenario }) {
  return (
    <SidenavShell
      isOpen={scenario.isOpen}
      isHiddenWhenClosed={scenario.isHiddenWhenClosed}
    >
      <DefaultSidenavContent hasDisabledItems={scenario.hasDisabledItems} />
    </SidenavShell>
  );
}

createVisualTestScenarios(
  'Sidenav',
  PROP_COMBOS.map((scenario) => ({
    name: scenario.name,
    screenshotName: scenario.screenshotName,
    waitMs: 200,
    render: () => <SidenavScenarioComponent scenario={scenario} />,
  })),
);

// ---------------------------------------------------------------------------
// Builder 2: SidenavItem interactive states
// ---------------------------------------------------------------------------

type SidenavItemVariantProps = {
  isSelected: boolean;
  isDisabled?: boolean;
};

const sidenavItemVariants = generateVariantMatrix<SidenavItemVariantProps>({
  dimensions: {
    isSelected: [true, false],
  },
});

createInteractiveVisualTests({
  componentName: 'SidenavItem',
  renderComponent: ({ isSelected, isDisabled }: SidenavItemVariantProps) => (
    <SidenavShell isOpen>
      <SidenavContent>
        <SidenavItem
          textValue='Dashboard'
          isSelected={isSelected}
          isDisabled={isDisabled}
        >
          <Icon>
            <Placeholder />
          </Icon>
          <Text>Dashboard</Text>
        </SidenavItem>
      </SidenavContent>
    </SidenavShell>
  ),
  variants: sidenavItemVariants,
  states: ['default', 'hover', 'focus', 'pressed', 'disabled'],
  interactionTarget: 'button',
  waitMs: 300,
});

// ---------------------------------------------------------------------------
// Builder 3: SidenavLink interactive states
// ---------------------------------------------------------------------------

createInteractiveVisualTests({
  componentName: 'SidenavLink',
  renderComponent: () => (
    <SidenavShell isOpen>
      <SidenavContent>
        <SidenavLink href='#' textValue='Documentation'>
          <Icon>
            <Placeholder />
          </Icon>
          <Text>Documentation</Text>
        </SidenavLink>
      </SidenavContent>
    </SidenavShell>
  ),
  variants: [{ id: 'default', name: 'default', props: {} }],
  states: ['default', 'hover', 'focus'],
  interactionTarget: 'a',
  waitMs: 200,
});

// ---------------------------------------------------------------------------
// Builder 4: SidenavMenuItem interactive states (standalone — no SidenavMenu)
// ---------------------------------------------------------------------------

createInteractiveVisualTests({
  componentName: 'SidenavMenuItem',
  renderComponent: ({ isDisabled }: { isDisabled?: boolean }) => (
    <SidenavShell isOpen>
      <SidenavContent>
        <SidenavMenuItem isDisabled={isDisabled}>
          <Text>Sub item</Text>
        </SidenavMenuItem>
      </SidenavContent>
    </SidenavShell>
  ),
  variants: [{ id: 'default', name: 'default', props: {} }],
  states: ['default', 'hover', 'focus', 'pressed', 'disabled'],
  interactionTarget: 'button',
  waitMs: 200,
});
