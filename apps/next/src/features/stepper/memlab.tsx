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
'use client';

import {
  Button,
  Stepper,
  StepperBack,
  StepperList,
  StepperNext,
  StepperPanel,
  StepperStep,
} from '@accelint/design-toolkit';
import { useState } from 'react';
import { useStressTest } from '~/memlab/hooks/use-stress-test';

/**
 * MemLab Test Page: Stepper Component
 *
 * This page provides test scenarios for memory leak detection in the Stepper component.
 * It exercises step registration/unregistration, panel switching, and full subtree teardown.
 */
export function StepperExample() {
  const [showOptionalStep, setShowOptionalStep] = useState(true);

  const {
    isRunning: isStressTesting,
    currentCycle: stressTestCount,
    totalCycles,
    run: runStressTest,
    visible: showStepper,
    toggle: toggleStepper,
  } = useStressTest({ cycles: 10, delay: 100 });

  return (
    <div
      data-testid='memlab-stepper-test'
      className='flex h-screen flex-col items-center justify-center gap-8 bg-surface-muted p-8'
    >
      <h1 className='text-xl font-bold'>Stepper Memory Leak Test</h1>

      <div className='flex flex-wrap justify-center gap-4'>
        <Button data-testid='toggle-stepper' onPress={toggleStepper}>
          {showStepper ? 'Unmount Stepper' : 'Mount Stepper'}
        </Button>

        <Button
          data-testid='toggle-optional-step'
          onPress={() => setShowOptionalStep((value) => !value)}
          isDisabled={!showStepper}
        >
          {showOptionalStep ? 'Remove Optional Step' : 'Add Optional Step'}
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

      {showStepper ? (
        <div
          data-testid='stepper-container'
          className='w-full max-w-2xl rounded-lg border border-surface-inverse p-6'
        >
          <Stepper defaultStep='step-1'>
            <StepperList aria-label='MemLab stepper'>
              <StepperStep id='step-1'>Step 1</StepperStep>
              {showOptionalStep ? (
                <StepperStep id='step-2'>Step 2</StepperStep>
              ) : null}
              <StepperStep id='step-3'>Step 3</StepperStep>
            </StepperList>

            <StepperPanel id='step-1'>
              <div className='mt-6 flex flex-col gap-4'>
                <p>Step 1 content</p>
                <StepperNext data-testid='stepper-next'>Next</StepperNext>
              </div>
            </StepperPanel>

            {showOptionalStep ? (
              <StepperPanel id='step-2'>
                <div className='mt-6 flex flex-col gap-4'>
                  <p>Optional step content</p>
                  <div className='flex gap-4'>
                    <StepperBack>Back</StepperBack>
                    <StepperNext>Next</StepperNext>
                  </div>
                </div>
              </StepperPanel>
            ) : null}

            <StepperPanel id='step-3'>
              <div className='mt-6 flex flex-col gap-4'>
                <p>Final step content</p>
                <StepperBack>Back</StepperBack>
              </div>
            </StepperPanel>
          </Stepper>
        </div>
      ) : null}

      <div className='flex gap-8 text-sm text-surface-inverse'>
        <p>Stepper mounted: {showStepper ? 'Yes' : 'No'}</p>
        <p>Optional step mounted: {showOptionalStep ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
}
