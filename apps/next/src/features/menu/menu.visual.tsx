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
  Button,
  Hotkey,
  Icon,
  Menu,
  MenuItem,
  MenuItemDescription,
  MenuItemLabel,
  MenuSection,
  MenuSeparator,
  MenuTrigger,
} from '@accelint/design-toolkit';
import Placeholder from '@accelint/icons/placeholder';
import { setInteractionModality } from '@react-aria/interactions';
import {
  createInteractiveVisualTests,
  createVisualTestScenarios,
  generateVariantMatrix,
} from '~/visual-regression/vitest';
import { type MenuScenario, PROP_COMBOS } from './variants';

// Set React Aria's interaction modality to "pointer" before any rendering.
// This prevents data-focus-visible from being applied when menus auto-focus
// their first item on open, ensuring VRT screenshots capture pure selection
// state without focus-visible styling on the first item.
setInteractionModality('pointer');

// Prevent React Aria's FocusScope from focusing menu items. When a menu opens
// via isOpen, FocusScope auto-focuses the first item, which triggers the native
// CSS :focus-visible pseudo-class (the browser defaults to keyboard modality in
// a fresh page). This causes the first selected item to render with focus-visible
// styling (different background) rather than pure selection styling. Patching
// focus() to skip menu items prevents :focus-visible from ever matching.
//
// The patch allows calls with `focusVisible: true` through so that interactive
// VRT tests can explicitly trigger focus state via triggerState().
const originalFocus = HTMLElement.prototype.focus;
HTMLElement.prototype.focus = function (options?: FocusOptions) {
  if (
    this.getAttribute('role')?.startsWith('menuitem') &&
    !options?.focusVisible
  ) {
    return;
  }
  originalFocus.call(this, options);
};

function renderScenario(scenario: MenuScenario) {
  switch (scenario.name) {
    case 'Cozy - Basic items':
    case 'Compact - Basic items':
      return (
        <MenuTrigger isOpen>
          <Button>Trigger</Button>
          <Menu variant={scenario.variant}>
            <MenuItem id='new-file'>
              <Icon>
                <Placeholder />
              </Icon>
              <MenuItemLabel>New File</MenuItemLabel>
              <MenuItemDescription>Create a new file</MenuItemDescription>
              <Hotkey variant='flat'>⌘N</Hotkey>
            </MenuItem>
            <MenuItem id='open-file'>
              <Icon>
                <Placeholder />
              </Icon>
              <MenuItemLabel>Open File</MenuItemLabel>
              <MenuItemDescription>Open an existing file</MenuItemDescription>
              <Hotkey variant='flat'>⌘O</Hotkey>
            </MenuItem>
            <MenuItem id='save'>
              <Icon>
                <Placeholder />
              </Icon>
              <MenuItemLabel>Save</MenuItemLabel>
              <MenuItemDescription>Save current file</MenuItemDescription>
              <Hotkey variant='flat'>⌘S</Hotkey>
            </MenuItem>
          </Menu>
        </MenuTrigger>
      );

    case 'Color variants':
      return (
        <MenuTrigger isOpen>
          <Button>Trigger</Button>
          <Menu variant={scenario.variant}>
            <MenuItem id='info' color='info'>
              <Icon>
                <Placeholder />
              </Icon>
              <MenuItemLabel>Info</MenuItemLabel>
              <MenuItemDescription>Standard menu item</MenuItemDescription>
            </MenuItem>
            <MenuItem id='serious' color='serious'>
              <Icon>
                <Placeholder />
              </Icon>
              <MenuItemLabel>Serious</MenuItemLabel>
              <MenuItemDescription>
                Warning or important action
              </MenuItemDescription>
            </MenuItem>
            <MenuItem id='critical' color='critical'>
              <Icon>
                <Placeholder />
              </Icon>
              <MenuItemLabel>Critical</MenuItemLabel>
              <MenuItemDescription>
                Destructive or dangerous action
              </MenuItemDescription>
            </MenuItem>
          </Menu>
        </MenuTrigger>
      );

    case 'Disabled items':
      return (
        <MenuTrigger isOpen>
          <Button>Trigger</Button>
          <Menu variant={scenario.variant}>
            <MenuItem id='available'>
              <MenuItemLabel>Available Action</MenuItemLabel>
            </MenuItem>
            <MenuItem id='disabled-1' isDisabled>
              <MenuItemLabel>Disabled Action</MenuItemLabel>
              <MenuItemDescription>
                This action is not available
              </MenuItemDescription>
            </MenuItem>
            <MenuItem id='another-available'>
              <MenuItemLabel>Another Available Action</MenuItemLabel>
            </MenuItem>
            <MenuItem id='disabled-2' isDisabled>
              <MenuItemLabel>Also Disabled</MenuItemLabel>
            </MenuItem>
            <MenuItem id='delete' color='critical'>
              <MenuItemLabel>Delete (Available)</MenuItemLabel>
            </MenuItem>
          </Menu>
        </MenuTrigger>
      );

    case 'Sections and separators':
      return (
        <MenuTrigger isOpen>
          <Button>Trigger</Button>
          <Menu variant={scenario.variant}>
            <MenuItem id='songbirds'>
              <Icon>
                <Placeholder />
              </Icon>
              <MenuItemLabel>Songbirds</MenuItemLabel>
              <Hotkey variant='flat'>⌘A</Hotkey>
            </MenuItem>
            <MenuSeparator />
            <MenuSection title='Notable Species'>
              <MenuItem id='mallard' color='serious'>
                <Icon>
                  <Placeholder />
                </Icon>
                <MenuItemLabel>Mallard</MenuItemLabel>
                <MenuItemDescription>Anas platyrhynchos</MenuItemDescription>
              </MenuItem>
              <MenuItem id='swift' color='critical'>
                <Icon>
                  <Placeholder />
                </Icon>
                <MenuItemLabel>Chimney swift</MenuItemLabel>
                <MenuItemDescription>Chaetura pelagica</MenuItemDescription>
              </MenuItem>
              <MenuItem id='guillemot'>
                <Icon>
                  <Placeholder />
                </Icon>
                <MenuItemLabel>Guillemot</MenuItemLabel>
                <MenuItemDescription>
                  Dumetella carolinensis
                </MenuItemDescription>
              </MenuItem>
            </MenuSection>
          </Menu>
        </MenuTrigger>
      );

    case 'Simple menu':
      return (
        <MenuTrigger isOpen>
          <Button>Trigger</Button>
          <Menu variant={scenario.variant}>
            <MenuItem id='cut'>
              <MenuItemLabel>Cut</MenuItemLabel>
            </MenuItem>
            <MenuItem id='copy'>
              <MenuItemLabel>Copy</MenuItemLabel>
            </MenuItem>
            <MenuItem id='paste'>
              <MenuItemLabel>Paste</MenuItemLabel>
            </MenuItem>
          </Menu>
        </MenuTrigger>
      );

    case 'Single selection':
      return (
        <MenuTrigger isOpen>
          <Button>Trigger</Button>
          <Menu
            variant={scenario.variant}
            selectionMode={scenario.selectionMode}
            selectedKeys={scenario.selectedKeys}
          >
            <MenuItem id='small'>
              <MenuItemLabel>Small</MenuItemLabel>
            </MenuItem>
            <MenuItem id='medium'>
              <MenuItemLabel>Medium</MenuItemLabel>
            </MenuItem>
            <MenuItem id='large'>
              <MenuItemLabel>Large</MenuItemLabel>
            </MenuItem>
            <MenuItem id='extra-large'>
              <MenuItemLabel>Extra Large</MenuItemLabel>
            </MenuItem>
          </Menu>
        </MenuTrigger>
      );

    case 'Multiple selection':
      return (
        <MenuTrigger isOpen>
          <Button>Trigger</Button>
          <Menu
            variant={scenario.variant}
            selectionMode={scenario.selectionMode}
            selectedKeys={scenario.selectedKeys}
          >
            <MenuItem id='bold'>
              <MenuItemLabel>Bold</MenuItemLabel>
              <Hotkey variant='flat'>⌘B</Hotkey>
            </MenuItem>
            <MenuItem id='italic'>
              <MenuItemLabel>Italic</MenuItemLabel>
              <Hotkey variant='flat'>⌘I</Hotkey>
            </MenuItem>
            <MenuItem id='underline'>
              <MenuItemLabel>Underline</MenuItemLabel>
              <Hotkey variant='flat'>⌘U</Hotkey>
            </MenuItem>
            <MenuItem id='strikethrough'>
              <MenuItemLabel>Strikethrough</MenuItemLabel>
              <Hotkey variant='flat'>⇧⌘X</Hotkey>
            </MenuItem>
          </Menu>
        </MenuTrigger>
      );

    default: {
      const _exhaustive: never = scenario.name;
      throw new Error(`Unhandled scenario: ${_exhaustive}`);
    }
  }
}

createVisualTestScenarios(
  'Menu',
  PROP_COMBOS.map((scenario) => ({
    name: scenario.name,
    render: () => renderScenario(scenario),
    screenshotName: scenario.screenshotName,
    waitMs: 300,
    selector: '[role="menu"]',
  })),
);

// ---------------------------------------------------------------------------
// Interactive color tests
// ---------------------------------------------------------------------------

type ColorItemProps = {
  color: 'info' | 'serious' | 'critical';
};

const colorVariants = generateVariantMatrix<ColorItemProps>({
  dimensions: {
    color: ['info', 'serious', 'critical'],
  },
});

createInteractiveVisualTests({
  componentName: 'MenuItemColor',
  renderComponent: ({ color }: ColorItemProps) => (
    <MenuTrigger isOpen>
      <Button>Trigger</Button>
      <Menu variant='cozy'>
        <MenuItem id='item' color={color}>
          <MenuItemLabel>{`${color} Item`}</MenuItemLabel>
        </MenuItem>
      </Menu>
    </MenuTrigger>
  ),
  variants: colorVariants,
  states: ['default', 'hover', 'focus', 'pressed'],
  interactionTarget: '[role="menuitemradio"]',
  screenshotSelector: '[role="menu"]',
  waitMs: 300,
});

createInteractiveVisualTests({
  componentName: 'MenuItemColorSelected',
  renderComponent: ({ color }: ColorItemProps) => (
    <MenuTrigger isOpen>
      <Button>Trigger</Button>
      <Menu
        variant='cozy'
        selectionMode='single'
        selectedKeys={new Set(['item'])}
      >
        <MenuItem id='item' color={color}>
          <MenuItemLabel>{`${color} Item`}</MenuItemLabel>
        </MenuItem>
      </Menu>
    </MenuTrigger>
  ),
  variants: colorVariants,
  states: ['default', 'hover', 'focus', 'pressed'],
  interactionTarget: '[role="menuitemradio"]',
  screenshotSelector: '[role="menu"]',
  waitMs: 300,
});

// ---------------------------------------------------------------------------
// Interactive composition tests
// ---------------------------------------------------------------------------

type ContentComposition =
  | 'description'
  | 'prefix-icon'
  | 'prefix-icon-description'
  | 'hotkey'
  | 'prefix-icon-hotkey'
  | 'full';

type CompositionProps = {
  content: ContentComposition;
};

function renderMenuItemContent(content: ContentComposition) {
  switch (content) {
    case 'description':
      return (
        <>
          <MenuItemLabel>Label</MenuItemLabel>
          <MenuItemDescription>Description text</MenuItemDescription>
        </>
      );
    case 'prefix-icon':
      return (
        <>
          <Icon>
            <Placeholder />
          </Icon>
          <MenuItemLabel>Label</MenuItemLabel>
        </>
      );
    case 'prefix-icon-description':
      return (
        <>
          <Icon>
            <Placeholder />
          </Icon>
          <MenuItemLabel>Label</MenuItemLabel>
          <MenuItemDescription>Description text</MenuItemDescription>
        </>
      );
    case 'hotkey':
      return (
        <>
          <MenuItemLabel>Label</MenuItemLabel>
          <Hotkey variant='flat'>⌘K</Hotkey>
        </>
      );
    case 'prefix-icon-hotkey':
      return (
        <>
          <Icon>
            <Placeholder />
          </Icon>
          <MenuItemLabel>Label</MenuItemLabel>
          <Hotkey variant='flat'>⌘K</Hotkey>
        </>
      );
    case 'full':
      return (
        <>
          <Icon>
            <Placeholder />
          </Icon>
          <MenuItemLabel>Label</MenuItemLabel>
          <MenuItemDescription>Description text</MenuItemDescription>
          <Hotkey variant='flat'>⌘K</Hotkey>
        </>
      );
  }
}

const compositionVariants = generateVariantMatrix<CompositionProps>({
  dimensions: {
    content: [
      'description',
      'prefix-icon',
      'prefix-icon-description',
      'hotkey',
      'prefix-icon-hotkey',
      'full',
    ],
  },
});

createInteractiveVisualTests({
  componentName: 'MenuItemComposition',
  renderComponent: ({ content }: CompositionProps) => (
    <MenuTrigger isOpen>
      <Button>Trigger</Button>
      <Menu variant='cozy'>
        <MenuItem id='item'>{renderMenuItemContent(content)}</MenuItem>
      </Menu>
    </MenuTrigger>
  ),
  variants: compositionVariants,
  states: ['default', 'hover', 'focus', 'pressed'],
  interactionTarget: '[role="menuitemradio"]',
  screenshotSelector: '[role="menu"]',
  waitMs: 300,
});

createInteractiveVisualTests({
  componentName: 'MenuItemCompositionSelected',
  renderComponent: ({ content }: CompositionProps) => (
    <MenuTrigger isOpen>
      <Button>Trigger</Button>
      <Menu
        variant='cozy'
        selectionMode='single'
        selectedKeys={new Set(['item'])}
      >
        <MenuItem id='item'>{renderMenuItemContent(content)}</MenuItem>
      </Menu>
    </MenuTrigger>
  ),
  variants: compositionVariants,
  states: ['default', 'hover', 'focus', 'pressed'],
  interactionTarget: '[role="menuitemradio"]',
  screenshotSelector: '[role="menu"]',
  waitMs: 300,
});
