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

import { Accordion } from '@accelint/design-toolkit/components/accordion';
import { AccordionHeader } from '@accelint/design-toolkit/components/accordion/header';
import { AccordionPanel } from '@accelint/design-toolkit/components/accordion/panel';
import { AccordionTrigger } from '@accelint/design-toolkit/components/accordion/trigger';
import { Icon } from '@accelint/design-toolkit/components/icon';
import PlaceholderIcon from '@accelint/icons/placeholder';
import {
  createInteractiveVisualTests,
  generateVariantMatrix,
} from '~/visual-regression/vitest';
import type { AccordionProps } from '@accelint/design-toolkit/components/accordion/types';

// Generate variant matrix for collapsed accordion states
const collapsedVariants = generateVariantMatrix<AccordionProps>({
  dimensions: {
    variant: ['cozy', 'compact'],
  },
});

// Generate variant matrix for expanded accordion states
const expandedVariants = generateVariantMatrix<AccordionProps>({
  dimensions: {
    variant: ['cozy', 'compact'],
  },
  baseProps: {
    isExpanded: true,
  },
});

// Render function for accordion
const renderAccordion = (props: AccordionProps) => (
  <Accordion {...props}>
    <AccordionHeader>
      <AccordionTrigger>
        <Icon>
          <PlaceholderIcon />
        </Icon>
        Title
      </AccordionTrigger>
    </AccordionHeader>
    <AccordionPanel>
      <p>Details</p>
    </AccordionPanel>
  </Accordion>
);

// Test collapsed accordion variants with all interactive states
createInteractiveVisualTests({
  componentName: 'Accordion',
  renderComponent: renderAccordion,
  testId: 'test-accordion',
  variants: collapsedVariants,
  states: ['default', 'hover', 'focus', 'pressed', 'disabled'],
});

// Test expanded accordion variants with all interactive states
createInteractiveVisualTests({
  componentName: 'AccordionExpanded',
  renderComponent: renderAccordion,
  testId: 'test-accordion',
  variants: expandedVariants,
  states: ['default', 'hover', 'focus', 'pressed', 'disabled'],
});
