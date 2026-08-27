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
/** biome-ignore-all lint/correctness/useUniqueElementIds: ids are unique for these stories */

import { useState } from 'react';
import { Button } from '@/components/button';
import { Input } from '../input';
import { StepperBack } from './back';
import { StepperList } from './list';
import { StepperNext } from './next';
import { StepperPanel } from './panel';
import { StepperStep } from './step';
import { Stepper } from './stepper';
import type { Key } from '@react-types/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * The `<Stepper>` component provides a multi-step workflow interface for guiding users
 * through sequential tasks like forms, onboarding, or checkout processes.
 *
 * ## Features
 *
 * - **Controlled & Uncontrolled**: Supports both controlled (`currentStep`/`onStepChange`) and uncontrolled (`defaultStep`) modes
 * - **Completion Tracking**: Automatically tracks completed steps as users navigate forward
 * - **Validation**: Block navigation with `onBeforeStepChange` callback for form validation
 * - **Keyboard Navigation**: Arrow keys navigate between steps (respects orientation)
 * - **Accessibility**: ARIA roles and focus management
 * - **Flexible Layout**: Horizontal or vertical orientation support
 *
 * ## Composition Requirements
 *
 * - `Stepper` must contain `StepperList` and `StepperPanel` components
 * - Each `StepperStep` must have a matching `StepperPanel` with the same `id` prop
 * - `StepperBack` and `StepperNext` are optional navigation helpers
 */
const meta = {
  title: 'Components/Stepper',
  component: Stepper,
  parameters: {
    docs: {
      subtitle:
        'Multi-step workflow component for wizards, forms, and onboarding',
    },
  },
} satisfies Meta<typeof Stepper>;

export default meta;

/**
 * Basic linear stepper with 3 steps. Shows uncontrolled mode with Next/Back navigation
 * buttons. Steps are completed automatically as the user navigates forward.
 */
export const BasicLinear: StoryObj<typeof meta> = {
  render: () => (
    <div className='flex w-full flex-col gap-l rounded-medium bg-surface-raised p-l outline outline-static'>
      <Stepper defaultStep='personal-info'>
        <StepperList className='mb-l flex gap-m'>
          <StepperStep
            id='personal-info'
            className='h-[3px] w-full bg-surface-muted p-0 transition-colors data-current:bg-accent-primary-bold data-visited:bg-accent-primary-muted'
          />
          <StepperStep
            id='payment'
            className='h-[3px] w-full bg-surface-muted p-0 transition-colors data-current:bg-accent-primary-bold data-visited:bg-accent-primary-muted'
          />
          <StepperStep
            id='confirmation'
            className='h-[3px] w-full bg-surface-muted p-0 transition-colors data-current:bg-accent-primary-bold data-visited:bg-accent-primary-muted'
          />
        </StepperList>

        <div className='rounded-m p-l'>
          <StepperPanel id='personal-info'>
            <h2 className='mb-m font-bold text-xl'>Personal Information</h2>
            <p className='mb-l text-gray-600'>
              Enter your personal details to continue.
            </p>
            <div className='mb-l flex flex-col gap-m'>
              <Input type='text' placeholder='Full Name' />
              <Input type='email' placeholder='Email' />
            </div>
            <div className='flex justify-end gap-m'>
              <StepperBack className='rounded bg-gray-200 px-l py-m hover:bg-gray-300'>
                Back
              </StepperBack>
              <StepperNext className='rounded bg-blue-500 px-l py-m text-white hover:bg-blue-600'>
                Next
              </StepperNext>
            </div>
          </StepperPanel>

          <StepperPanel id='payment'>
            <h2 className='mb-m font-bold text-xl'>Payment Details</h2>
            <p className='mb-l text-gray-600'>
              Provide your payment information.
            </p>
            <div className='mb-l flex flex-col gap-m'>
              <Input type='text' placeholder='Card Number' />
              <div className='flex gap-m'>
                <Input type='text' placeholder='MM/YY' />
                <Input type='text' placeholder='CVV' />
              </div>
            </div>
            <div className='flex justify-end gap-m'>
              <StepperBack className='rounded bg-gray-200 px-l py-m hover:bg-gray-300'>
                Back
              </StepperBack>
              <StepperNext className='rounded bg-blue-500 px-l py-m text-white hover:bg-blue-600'>
                Next
              </StepperNext>
            </div>
          </StepperPanel>

          <StepperPanel id='confirmation'>
            <h2 className='mb-m font-bold text-xl'>Confirmation</h2>
            <p className='mb-l text-gray-600'>Review and confirm your order.</p>
            <div className='mb-l rounded bg-gray-50 p-m'>
              <p className='font-semibold'>Order Summary</p>
              <p className='text-gray-600 text-sm'>
                Your information has been collected.
              </p>
            </div>
            <div className='flex justify-end gap-m'>
              <StepperBack className='rounded bg-gray-200 px-l py-m hover:bg-gray-300'>
                Back
              </StepperBack>
              <Button className='rounded bg-green-500 px-l py-m text-white hover:bg-green-600'>
                Submit
              </Button>
            </div>
          </StepperPanel>
        </div>
      </Stepper>
    </div>
  ),
};

/**
 * Controlled stepper showing external state management. Parent component controls
 * the current step and displays external step indicator.
 */
export const Controlled: StoryObj<typeof meta> = {
  render: () => {
    const [currentStep, setCurrentStep] = useState<Key>('step-1');

    return (
      <div className='flex w-full flex-col gap-l rounded-medium bg-surface-raised p-l outline outline-static'>
        <div className='rounded-m bg-blue-50 p-m text-center'>
          <p className='font-semibold'>External State</p>
          <p className='text-gray-600 text-sm'>
            Current Step:{' '}
            <code className='font-mono'>{String(currentStep)}</code>
          </p>
        </div>

        <Stepper currentStep={currentStep} onStepChange={setCurrentStep}>
          <StepperList className='mb-l flex gap-m'>
            <StepperStep
              id='step-1'
              className='h-[3px] w-full bg-surface-muted p-0 transition-colors data-current:bg-accent-primary-bold data-visited:bg-accent-primary-muted'
            />
            <StepperStep
              id='step-2'
              className='h-[3px] w-full bg-surface-muted p-0 transition-colors data-current:bg-accent-primary-bold data-visited:bg-accent-primary-muted'
            />
            <StepperStep
              id='step-3'
              className='h-[3px] w-full bg-surface-muted p-0 transition-colors data-current:bg-accent-primary-bold data-visited:bg-accent-primary-muted'
            />
          </StepperList>

          <div className='rounded-m p-l'>
            <StepperPanel id='step-1'>
              <h3 className='mb-m font-semibold text-lg'>Step 1 Content</h3>
              <p className='mb-m'>This is the first step in controlled mode.</p>
              <StepperNext className='rounded bg-blue-500 px-l py-m text-white hover:bg-blue-600'>
                Next
              </StepperNext>
            </StepperPanel>

            <StepperPanel id='step-2'>
              <h3 className='mb-m font-semibold text-lg'>Step 2 Content</h3>
              <p className='mb-m'>This is the second step.</p>
              <div className='flex gap-m'>
                <StepperBack className='rounded bg-gray-200 px-l py-m hover:bg-gray-300'>
                  Back
                </StepperBack>
                <StepperNext className='rounded bg-blue-500 px-l py-m text-white hover:bg-blue-600'>
                  Next
                </StepperNext>
              </div>
            </StepperPanel>

            <StepperPanel id='step-3'>
              <h3 className='mb-m font-semibold text-lg'>Step 3 Content</h3>
              <p className='mb-m'>This is the final step.</p>
              <StepperBack className='rounded bg-gray-200 px-l py-m hover:bg-gray-300'>
                Back
              </StepperBack>
            </StepperPanel>
          </div>
        </Stepper>

        <div className='flex justify-center gap-m'>
          <Button onPress={() => setCurrentStep('step-1')}>Go to Step 1</Button>
          <Button onPress={() => setCurrentStep('step-2')}>Go to Step 2</Button>
          <Button onPress={() => setCurrentStep('step-3')}>Go to Step 3</Button>
        </div>
      </div>
    );
  },
};

/**
 * Validation blocking: `onBeforeStepChange` callback blocks navigation when
 * form validation fails. Shows how to prevent users from proceeding without
 * completing required fields.
 */
export const ValidationBlocking: StoryObj<typeof meta> = {
  render: () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleBeforeStepChange = (fromKey: Key, _toKey: Key): boolean => {
      setErrorMessage('');

      if (fromKey === 'step-1') {
        if (!name.trim()) {
          setErrorMessage('Name is required');
          return false;
        }
        if (!(email.trim() && email.includes('@'))) {
          setErrorMessage('Valid email is required');
          return false;
        }
      }

      return true;
    };

    return (
      <div className='flex w-full flex-col gap-l rounded-medium bg-surface-raised p-l outline outline-static'>
        <div className='rounded-m bg-yellow-50 p-m'>
          <p className='font-semibold text-yellow-800'>Validation Demo</p>
          <p className='text-sm text-yellow-700'>
            Try clicking Next without filling the form. Navigation will be
            blocked.
          </p>
        </div>

        <Stepper
          defaultStep='step-1'
          onBeforeStepChange={handleBeforeStepChange}
        >
          <StepperList className='mb-l flex gap-m'>
            <StepperStep
              id='step-1'
              className='h-[3px] w-full bg-surface-muted p-0 transition-colors data-current:bg-accent-primary-bold data-visited:bg-accent-primary-muted'
            />
            <StepperStep
              id='step-2'
              className='h-[3px] w-full bg-surface-muted p-0 transition-colors data-current:bg-accent-primary-bold data-visited:bg-accent-primary-muted'
            />
          </StepperList>

          <div className='rounded-m p-l'>
            {errorMessage && (
              <div className='mb-m rounded-m bg-red-50 p-m text-red-700'>
                {errorMessage}
              </div>
            )}

            <StepperPanel id='step-1'>
              <h3 className='mb-m font-semibold text-lg'>
                Required Information
              </h3>
              <div className='mb-l flex flex-col gap-m'>
                <div>
                  <label
                    htmlFor='name-input'
                    className='mb-xs block font-medium text-sm'
                  >
                    Name *
                  </label>
                  <Input
                    id='name-input'
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='Enter your name'
                  />
                </div>
                <div>
                  <label
                    htmlFor='email-input'
                    className='mb-xs block font-medium text-sm'
                  >
                    Email *
                  </label>
                  <Input
                    id='email-input'
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Enter your email'
                  />
                </div>
              </div>
              <StepperNext className='rounded bg-blue-500 px-l py-m text-white hover:bg-blue-600'>
                Next
              </StepperNext>
            </StepperPanel>

            <StepperPanel id='step-2'>
              <h3 className='mb-m font-semibold text-lg'>Review</h3>
              <div className='mb-l rounded-m bg-gray-50 p-m'>
                <p>
                  <strong>Name:</strong> {name}
                </p>
                <p>
                  <strong>Email:</strong> {email}
                </p>
              </div>
              <StepperBack className='rounded bg-gray-200 px-l py-m hover:bg-gray-300'>
                Back
              </StepperBack>
            </StepperPanel>
          </div>
        </Stepper>
      </div>
    );
  },
};

/**
 * Non-linear stepper with dynamic disabled steps. Steps become enabled based on
 * completion of previous steps, demonstrating conditional navigation.
 */
export const NonLinear: StoryObj<typeof meta> = {
  render: () => {
    const [completedSteps, setCompletedSteps] = useState(new Set<Key>());

    const disabledKeys = new Set<Key>();
    if (!completedSteps.has('step-1')) {
      disabledKeys.add('step-2');
      disabledKeys.add('step-3');
    }
    if (!completedSteps.has('step-2')) {
      disabledKeys.add('step-3');
    }

    const handleComplete = (step: Key) => {
      setCompletedSteps((prev) => new Set(prev).add(step));
    };

    return (
      <div className='flex w-full flex-col gap-l rounded-medium bg-surface-raised p-l outline outline-static'>
        <div className='rounded-m bg-purple-50 p-m'>
          <p className='font-semibold text-purple-800'>Non-Linear Navigation</p>
          <p className='text-purple-700 text-sm'>
            Complete each step to unlock the next. Steps 2 and 3 are initially
            disabled.
          </p>
        </div>

        <Stepper
          defaultStep='step-1'
          completedSteps={completedSteps}
          disabledKeys={disabledKeys}
        >
          <StepperList className='mb-l flex gap-m'>
            <StepperStep
              id='step-1'
              className='h-[3px] w-full bg-surface-muted p-0 transition-colors data-current:bg-accent-primary-bold data-visited:bg-accent-primary-muted'
            />
            <StepperStep
              id='step-2'
              className='h-[3px] w-full bg-surface-muted p-0 transition-colors data-current:bg-accent-primary-bold data-visited:bg-accent-primary-muted'
            />
            <StepperStep
              id='step-3'
              className='h-[3px] w-full bg-surface-muted p-0 transition-colors data-current:bg-accent-primary-bold data-visited:bg-accent-primary-muted'
            />
          </StepperList>

          <div className='rounded-m p-l'>
            <StepperPanel id='step-1'>
              <h3 className='mb-m font-semibold text-lg'>Step 1: Setup</h3>
              <p className='mb-l'>Complete this step to unlock Step 2.</p>
              <Button
                onPress={() => handleComplete('step-1')}
                className='rounded bg-green-500 px-l py-m text-white hover:bg-green-600'
              >
                Mark Complete
              </Button>
            </StepperPanel>

            <StepperPanel id='step-2'>
              <h3 className='mb-m font-semibold text-lg'>
                Step 2: Configuration
              </h3>
              <p className='mb-l'>Complete this step to unlock Step 3.</p>
              <div className='flex gap-m'>
                <StepperBack className='rounded bg-gray-200 px-l py-m hover:bg-gray-300'>
                  Back
                </StepperBack>
                <Button
                  onPress={() => handleComplete('step-2')}
                  className='rounded bg-green-500 px-l py-m text-white hover:bg-green-600'
                >
                  Mark Complete
                </Button>
              </div>
            </StepperPanel>

            <StepperPanel id='step-3'>
              <h3 className='mb-m font-semibold text-lg'>Step 3: Finish</h3>
              <p className='mb-l'>All steps completed!</p>
              <StepperBack className='rounded bg-gray-200 px-l py-m hover:bg-gray-300'>
                Back
              </StepperBack>
            </StepperPanel>
          </div>
        </Stepper>
      </div>
    );
  },
};
