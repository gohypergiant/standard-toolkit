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
  AccordionGroup,
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
 * MemLab Test Page: AccordionGroup Component
 *
 * This page provides test scenarios for memory leak detection in the AccordionGroup component.
 * It supports three testing modes:
 * 1. Mount/Unmount - Single show/hide cycle
 * 2. User Flow - Expand/collapse interactions within group
 * 3. Stress Test - Rapid mount/unmount cycles
 */
export function AccordionGroupExample() {
  const [expandCount, setExpandCount] = useState(0);

  const {
    isRunning: isStressTesting,
    currentCycle: stressTestCount,
    totalCycles,
    run: runStressTest,
    visible: showGroups,
    toggle: toggleGroups,
  } = useStressTest({ cycles: 20, delay: 25 });

  return (
    <div
      data-testid='memlab-accordion-group-test'
      className='flex min-h-screen flex-col items-center gap-8 overflow-auto bg-surface-muted p-8'
    >
      <h1 className='text-xl font-bold'>AccordionGroup Memory Leak Test</h1>

      {/* Test Controls */}
      <div className='flex gap-4'>
        <Button data-testid='toggle-groups' onPress={toggleGroups}>
          {showGroups ? 'Hide Groups' : 'Show Groups'}
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

      {/* Test Subject: AccordionGroups */}
      {showGroups && (
        <div
          data-testid='accordion-group-container'
          className='flex w-full max-w-2xl flex-col gap-8'
        >
          {PROP_COMBOS.map((props, groupIndex) => (
            <div key={getTestId('group', props)} className='border-b pb-4'>
              <h2 className='mb-2 text-sm font-semibold'>
                Group {groupIndex + 1}: {props.variant}
                {props.allowsMultipleExpanded ? ' (multiple)' : ''}
                {props.isDisabled ? ' (disabled)' : ''}
              </h2>
              <AccordionGroup
                data-testid={getTestId('accordion-group', props)}
                {...props}
              >
                {['a', 'b'].map((id, accordionIndex) => (
                  <Accordion
                    key={id}
                    id={id}
                    data-testid={`accordion-${groupIndex}-${id}`}
                    onExpandedChange={(expanded) => {
                      setExpandCount((c) => (expanded ? c + 1 : c - 1));
                    }}
                  >
                    <AccordionHeader>
                      <AccordionTrigger>
                        <Icon>
                          <PlaceholderIcon />
                        </Icon>
                        Section {accordionIndex + 1}
                      </AccordionTrigger>
                    </AccordionHeader>
                    <AccordionPanel>
                      <p className='p-4'>
                        Content for section {accordionIndex + 1} in group{' '}
                        {groupIndex + 1}. This content should be properly
                        cleaned up when unmounted.
                      </p>
                    </AccordionPanel>
                  </Accordion>
                ))}
              </AccordionGroup>
            </div>
          ))}
        </div>
      )}

      <p className='text-sm text-surface-inverse'>
        Expand count: {expandCount} | Groups visible:{' '}
        {showGroups ? 'Yes' : 'No'}
      </p>
    </div>
  );
}
