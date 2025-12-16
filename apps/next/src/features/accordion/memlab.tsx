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
  Accordion,
  AccordionHeader,
  AccordionPanel,
  AccordionTrigger,
  Button,
  Icon,
} from '@accelint/design-toolkit';
import PlaceholderIcon from '@accelint/icons/placeholder';
import { useState } from 'react';
import { useStressTest } from '~/memlab/hooks/use-stress-test';
import { getTestId } from '~/test/get-test-id';
import { PROP_COMBOS } from './variants';

/**
 * MemLab Test Page: Accordion Component
 *
 * This page provides test scenarios for memory leak detection in the Accordion component.
 * It supports three testing modes:
 * 1. Mount/Unmount - Single show/hide cycle
 * 2. User Flow - Expand/collapse interactions
 * 3. Stress Test - Rapid mount/unmount cycles
 */
export function AccordionExample() {
  const [expandCount, setExpandCount] = useState(0);

  const {
    isRunning: isStressTesting,
    currentCycle: stressTestCount,
    totalCycles,
    run: runStressTest,
    visible: showAccordions,
    toggle: toggleAccordions,
  } = useStressTest({ cycles: 20, delay: 25 });

  return (
    <div
      data-testid='memlab-accordion-test'
      className='flex h-screen flex-col items-center justify-center gap-8 bg-surface-muted p-8'
    >
      <h1 className='text-xl font-bold'>Accordion Memory Leak Test</h1>

      {/* Test Controls */}
      <div className='flex gap-4'>
        <Button data-testid='toggle-accordions' onPress={toggleAccordions}>
          {showAccordions ? 'Hide Accordions' : 'Show Accordions'}
        </Button>

        <Button
          data-testid='stress-test'
          onPress={runStressTest}
          isDisabled={isStressTesting}
        >
          {isStressTesting
            ? `Stress Testing (${stressTestCount}/${totalCycles})...`
            : `Stress Test (${totalCycles} cycles)`}
        </Button>
      </div>

      {/* Test Subject: Accordions */}
      {showAccordions && (
        <div
          data-testid='accordion-container'
          className='flex w-full max-w-md flex-col gap-4'
        >
          {PROP_COMBOS.map((props, k) => (
            <Accordion
              key={getTestId('accordion', props)}
              data-testid={getTestId('accordion', props)}
              {...props}
              onExpandedChange={(expanded) => {
                setExpandCount((c) => (expanded ? c + 1 : c - 1));
              }}
            >
              <AccordionHeader>
                <AccordionTrigger>
                  <Icon>
                    <PlaceholderIcon />
                  </Icon>
                  Accordion {k + 1} ({props.variant})
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionPanel>
                <p className='p-4'>
                  Content for accordion {k + 1}. This content should be properly
                  cleaned up when the accordion is unmounted.
                </p>
              </AccordionPanel>
            </Accordion>
          ))}
        </div>
      )}

      <p className='text-sm text-surface-inverse'>
        Expand count: {expandCount} | Accordions visible:{' '}
        {showAccordions ? 'Yes' : 'No'}
      </p>
    </div>
  );
}
