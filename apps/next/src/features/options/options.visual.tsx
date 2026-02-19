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
  Icon,
  Options,
  OptionsItem,
  OptionsItemContent,
  OptionsItemDescription,
  OptionsItemLabel,
  OptionsSection,
} from '@accelint/design-toolkit';
import Placeholder from '@accelint/icons/placeholder';
import {
  createInteractiveVisualTests,
  createVisualTestScenarios,
  generateVariantMatrix,
} from '~/visual-regression/vitest';
import { type OptionsVariant, PROP_COMBOS } from './variants';

type ContentComposition =
  | 'description'
  | 'prefix-icon'
  | 'suffix-icon'
  | 'prefix-suffix-icons'
  | 'prefix-icon-description'
  | 'full';

function renderItemContent(content: ContentComposition) {
  switch (content) {
    case 'description':
      return (
        <OptionsItemContent>
          <OptionsItemLabel>Option One</OptionsItemLabel>
          <OptionsItemDescription>
            First option description
          </OptionsItemDescription>
        </OptionsItemContent>
      );
    case 'prefix-icon':
      return (
        <>
          <Icon>
            <Placeholder />
          </Icon>
          <OptionsItemLabel>Option One</OptionsItemLabel>
        </>
      );
    case 'suffix-icon':
      return (
        <>
          <OptionsItemLabel>Option One</OptionsItemLabel>
          <Icon>
            <Placeholder />
          </Icon>
        </>
      );
    case 'prefix-suffix-icons':
      return (
        <>
          <Icon>
            <Placeholder />
          </Icon>
          <OptionsItemLabel>Option One</OptionsItemLabel>
          <Icon>
            <Placeholder />
          </Icon>
        </>
      );
    case 'prefix-icon-description':
      return (
        <>
          <Icon>
            <Placeholder />
          </Icon>
          <OptionsItemContent>
            <OptionsItemLabel>Option One</OptionsItemLabel>
            <OptionsItemDescription>
              First option description
            </OptionsItemDescription>
          </OptionsItemContent>
        </>
      );
    case 'full':
      return (
        <>
          <Icon>
            <Placeholder />
          </Icon>
          <OptionsItemContent>
            <OptionsItemLabel>Option One</OptionsItemLabel>
            <OptionsItemDescription>
              First option description
            </OptionsItemDescription>
          </OptionsItemContent>
          <Icon>
            <Placeholder />
          </Icon>
        </>
      );
  }
}

function BasicItems() {
  return (
    <>
      <OptionsItem id='opt-1' textValue='Option One'>
        <OptionsItemLabel>Option One</OptionsItemLabel>
      </OptionsItem>
      <OptionsItem id='opt-2' textValue='Option Two'>
        <OptionsItemLabel>Option Two</OptionsItemLabel>
      </OptionsItem>
      <OptionsItem id='opt-3' textValue='Option Three'>
        <OptionsItemLabel>Option Three</OptionsItemLabel>
      </OptionsItem>
      <OptionsItem id='opt-4' textValue='Option Four'>
        <OptionsItemLabel>Option Four</OptionsItemLabel>
      </OptionsItem>
      <OptionsItem id='opt-5' textValue='Option Five'>
        <OptionsItemLabel>Option Five</OptionsItemLabel>
      </OptionsItem>
    </>
  );
}

function SectionItems() {
  return (
    <>
      <OptionsSection header='Fruits'>
        <OptionsItem id='opt-1' textValue='Apple'>
          <OptionsItemLabel>Apple</OptionsItemLabel>
        </OptionsItem>
        <OptionsItem id='opt-2' textValue='Banana'>
          <OptionsItemLabel>Banana</OptionsItemLabel>
        </OptionsItem>
      </OptionsSection>
      <OptionsSection header='Vegetables'>
        <OptionsItem id='opt-3' textValue='Carrot'>
          <OptionsItemLabel>Carrot</OptionsItemLabel>
        </OptionsItem>
        <OptionsItem id='opt-4' textValue='Broccoli'>
          <OptionsItemLabel>Broccoli</OptionsItemLabel>
        </OptionsItem>
      </OptionsSection>
    </>
  );
}

function ColorItems() {
  return (
    <>
      <OptionsItem id='opt-1' textValue='Info Item' color='info'>
        <OptionsItemLabel>Info Item</OptionsItemLabel>
      </OptionsItem>
      <OptionsItem id='opt-2' textValue='Serious Item' color='serious'>
        <OptionsItemLabel>Serious Item</OptionsItemLabel>
      </OptionsItem>
      <OptionsItem id='opt-3' textValue='Critical Item' color='critical'>
        <OptionsItemLabel>Critical Item</OptionsItemLabel>
      </OptionsItem>
    </>
  );
}

function OptionsScenario({ variant }: { variant: OptionsVariant }) {
  const items = variant.useSections ? (
    <SectionItems />
  ) : variant.useColors ? (
    <ColorItems />
  ) : (
    <BasicItems />
  );

  return (
    <Options
      size={variant.size}
      selectionMode={variant.selectionMode}
      selectedKeys={
        variant.selectedKeys ? new Set(variant.selectedKeys) : undefined
      }
      disabledKeys={variant.disabledKeys}
      aria-label='Options'
    >
      {items}
    </Options>
  );
}

createVisualTestScenarios(
  'Options',
  PROP_COMBOS.map((variant) => ({
    name: variant.name,
    render: () => <OptionsScenario variant={variant} />,
    screenshotName: `options-${variant.name}.png`,
    className: 'inline-block',
  })),
);

type ColorItemProps = {
  color: 'info' | 'serious' | 'critical';
};

const colorVariants = generateVariantMatrix<ColorItemProps>({
  dimensions: {
    color: ['info', 'serious', 'critical'],
  },
});

createInteractiveVisualTests({
  componentName: 'OptionsItemColor',
  renderComponent: ({ color }: ColorItemProps) => (
    <Options size='large' selectionMode='none' aria-label='Options'>
      <OptionsItem id='opt-1' textValue={`${color} Item`} color={color}>
        <OptionsItemLabel>{`${color} Item`}</OptionsItemLabel>
      </OptionsItem>
    </Options>
  ),
  variants: colorVariants,
  states: ['default', 'hover', 'focus', 'pressed'],
});

createInteractiveVisualTests({
  componentName: 'OptionsItemColorSelected',
  renderComponent: ({ color }: ColorItemProps) => (
    <Options
      size='large'
      selectionMode='single'
      selectedKeys={new Set(['opt-1'])}
      aria-label='Options'
    >
      <OptionsItem id='opt-1' textValue={`${color} Item`} color={color}>
        <OptionsItemLabel>{`${color} Item`}</OptionsItemLabel>
      </OptionsItem>
    </Options>
  ),
  variants: colorVariants,
  states: ['default', 'hover', 'focus', 'pressed'],
});

type CompositionProps = {
  content: ContentComposition;
};

const compositionVariants = generateVariantMatrix<CompositionProps>({
  dimensions: {
    content: [
      'description',
      'prefix-icon',
      'suffix-icon',
      'prefix-suffix-icons',
      'prefix-icon-description',
      'full',
    ],
  },
});

createInteractiveVisualTests({
  componentName: 'OptionsItemComposition',
  renderComponent: ({ content }: CompositionProps) => (
    <Options size='large' selectionMode='none' aria-label='Options'>
      <OptionsItem id='opt-1' textValue='Option One'>
        {renderItemContent(content)}
      </OptionsItem>
    </Options>
  ),
  variants: compositionVariants,
  states: ['default', 'hover', 'focus', 'pressed'],
});

createInteractiveVisualTests({
  componentName: 'OptionsItemCompositionSelected',
  renderComponent: ({ content }: CompositionProps) => (
    <Options
      size='large'
      selectionMode='single'
      selectedKeys={new Set(['opt-1'])}
      aria-label='Options'
    >
      <OptionsItem id='opt-1' textValue='Option One'>
        {renderItemContent(content)}
      </OptionsItem>
    </Options>
  ),
  variants: compositionVariants,
  states: ['default', 'hover', 'focus', 'pressed'],
});
