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

import Placeholder from '@accelint/icons/placeholder';
import {
  ComboBoxField,
  Icon,
  OptionsItem,
  OptionsItemContent,
  OptionsItemDescription,
  OptionsItemLabel,
  OptionsSection,
  ThemeProvider,
} from '@accelint/design-toolkit';
import { dash } from 'radashi';
import { describe, expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import {
  constrainBodyToContent,
  createVisualTestScenarios,
  fixVirtualizerItemWidths,
  insertModeInFilename,
  THEME_MODES,
} from '~/visual-regression/vitest';
import { type ComboboxScenario, SCENARIOS } from './variants';
import type { ReactNode } from 'react';

interface ItemData {
  id: number;
  name: string;
  description?: string;
  isDisabled?: boolean;
  prefixIcon?: ReactNode;
  children?: ItemData[];
}

const items: ItemData[] = [
  {
    id: 1,
    prefixIcon: <Placeholder />,
    name: 'Red Panda',
    description: 'Tree-dwelling mammal',
  },
  {
    id: 2,
    prefixIcon: <Placeholder />,
    name: 'Cat',
    description: 'Furry house pet',
  },
  {
    id: 3,
    prefixIcon: <Placeholder />,
    name: 'Dog',
    description: 'Loyal companion',
  },
  {
    id: 4,
    prefixIcon: <Placeholder />,
    name: 'Aardvark',
    description: 'Ant-eating nocturnal',
  },
  {
    id: 5,
    name: 'Kangaroo',
    description: 'Pouch-bearing jumper',
  },
  {
    id: 6,
    prefixIcon: <Placeholder />,
    name: 'Snake',
    description: 'Slithering reptile',
  },
];

const itemsWithDisabled: ItemData[] = items.map((item) =>
  item.id === 2 ? { ...item, isDisabled: true } : item
);

const sectionItems: ItemData[] = [
  {
    id: 100,
    name: 'North American Birds',
    children: [
      { id: 101, prefixIcon: <Placeholder />, name: 'Blue jay' },
      { id: 102, prefixIcon: <Placeholder />, name: 'Gray catbird' },
      { id: 103, prefixIcon: <Placeholder />, name: 'Black-capped chickadee' },
      { id: 104, prefixIcon: <Placeholder />, name: 'Song sparrow' },
    ],
  },
  {
    id: 200,
    name: 'African Birds',
    children: [
      {
        id: 201,
        prefixIcon: <Placeholder />,
        name: 'Lilac-breasted roller',
      },
      { id: 202, prefixIcon: <Placeholder />, name: 'Hornbill' },
    ],
  },
];

function ComboboxScenarioComponent({
  scenario,
}: {
  scenario: ComboboxScenario;
}) {
  const { size, props, useSections, hasDisabledItem } = scenario;
  const defaultItems = useSections
    ? sectionItems
    : hasDisabledItem
      ? itemsWithDisabled
      : items;

  if (useSections) {
    return (
      <ComboBoxField<ItemData>
        {...props}
        size={size}
        defaultItems={defaultItems}
        layoutOptions={props.layoutOptions ?? { estimatedRowHeight: 46 }}
      >
        {(section) => (
          <OptionsSection header={section.name} items={section.children}>
            {(item) => (
              <OptionsItem key={item.id} textValue={item.name}>
                {item.prefixIcon && <Icon>{item.prefixIcon}</Icon>}
                <OptionsItemContent>
                  <OptionsItemLabel>{item.name}</OptionsItemLabel>
                  {item.description && (
                    <OptionsItemDescription>
                      {item.description}
                    </OptionsItemDescription>
                  )}
                </OptionsItemContent>
              </OptionsItem>
            )}
          </OptionsSection>
        )}
      </ComboBoxField>
    );
  }

  return (
    <ComboBoxField<ItemData>
      {...props}
      size={size}
      defaultItems={defaultItems}
      layoutOptions={props.layoutOptions ?? { estimatedRowHeight: 46 }}
    >
      {(item) => (
        <OptionsItem
          key={item.id}
          textValue={item.name}
          isDisabled={item.isDisabled}
        >
          {item.prefixIcon && <Icon>{item.prefixIcon}</Icon>}
          <OptionsItemContent>
            <OptionsItemLabel>{item.name}</OptionsItemLabel>
            {item.description && (
              <OptionsItemDescription>
                {item.description}
              </OptionsItemDescription>
            )}
          </OptionsItemContent>
        </OptionsItem>
      )}
    </ComboBoxField>
  );
}

const closedScenarios = SCENARIOS.filter((s) => s.state === 'closed');
const openScenarios = SCENARIOS.filter((s) => s.state === 'open');

createVisualTestScenarios(
  'ComboBoxField',
  closedScenarios.map((scenario) => ({
    name: scenario.name,
    render: () => <ComboboxScenarioComponent scenario={scenario} />,
    screenshotName: `combobox-field-${scenario.state}-${dash(scenario.name)}.png`,
    className: 'inline-block',
  })),
);

describe('ComboBoxField Open States', () => {
  for (const scenario of openScenarios) {
    for (const mode of THEME_MODES) {
      const filename = insertModeInFilename(
        `combobox-field-open-${dash(scenario.name)}.png`,
        mode,
      );

      test(`${scenario.name} (${mode} mode)`, async () => {
        render(
          <ThemeProvider defaultMode={mode}>
            <ComboboxScenarioComponent scenario={scenario} />
          </ThemeProvider>,
        );

        await page.getByRole('combobox').click();
        await expect.element(page.getByRole('listbox')).toBeVisible();

        fixVirtualizerItemWidths(page.getByRole('listbox').element());

        const cleanup = constrainBodyToContent({ width: 460 });
        await expect
          .element(page.getByRole('option').first())
          .toBeVisible();

        await expect.element(document.body).toMatchScreenshot(filename);
        cleanup();
      });
    }
  }
});
