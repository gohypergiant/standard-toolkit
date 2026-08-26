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

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { StepperBack } from './back';
import { StepperList } from './list';
import { StepperNext } from './next';
import { StepperPanel } from './panel';
import { StepperStep } from './step';
import { Stepper } from './stepper';
import type { Key } from '@react-types/shared';

function renderStepper(props?: Partial<React.ComponentProps<typeof Stepper>>) {
  return render(
    <Stepper defaultStep='step-1' {...props}>
      <StepperList aria-label='Registration steps'>
        <StepperStep id='step-1'>Step 1</StepperStep>
        <StepperStep id='step-2'>Step 2</StepperStep>
        <StepperStep id='step-3'>Step 3</StepperStep>
      </StepperList>
      <StepperPanel id='step-1'>Panel 1</StepperPanel>
      <StepperPanel id='step-2'>Panel 2</StepperPanel>
      <StepperPanel id='step-3'>Panel 3</StepperPanel>
    </Stepper>,
  );
}

function getStepButton(name: string) {
  return screen.getByRole('button', { name });
}

describe('Stepper', () => {
  describe('rendering', () => {
    it('should render stepper with steps and panels', () => {
      renderStepper();

      expect(getStepButton('Step 1 of 3')).toHaveTextContent('Step 1');
      expect(getStepButton('Step 2 of 3')).toHaveTextContent('Step 2');
      expect(getStepButton('Step 3 of 3')).toHaveTextContent('Step 3');
      expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel 1');
    });

    it('should render only active panel by default', () => {
      renderStepper();

      expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel 1');
      expect(screen.queryByText('Panel 2')).not.toBeInTheDocument();
    });

    it('should render stepper container', () => {
      render(
        <Stepper defaultStep='step-1' className='custom-stepper'>
          <StepperList>
            <StepperStep id='step-1'>Step 1</StepperStep>
          </StepperList>
        </Stepper>,
      );

      expect(screen.getByRole('navigation').parentElement).toHaveClass(
        'custom-stepper',
      );
    });

    it('should render navigation region with aria-label', () => {
      render(
        <Stepper defaultStep='step-1'>
          <StepperList aria-label='Registration steps'>
            <StepperStep id='step-1'>Step 1</StepperStep>
          </StepperList>
        </Stepper>,
      );

      const navigation = screen.getByRole('navigation', {
        name: 'Registration steps',
      });
      expect(navigation).toBeInTheDocument();
    });
  });

  describe('step states', () => {
    it('should mark current step with aria-current', () => {
      render(
        <Stepper defaultStep='step-2'>
          <StepperList>
            <StepperStep id='step-1'>Step 1</StepperStep>
            <StepperStep id='step-2'>Step 2</StepperStep>
            <StepperStep id='step-3'>Step 3</StepperStep>
          </StepperList>
        </Stepper>,
      );

      const step2 = getStepButton('Step 2 of 3');
      expect(step2).toHaveAttribute('aria-current', 'step');
      expect(step2).toHaveAttribute('data-current');
    });

    it('should mark completed steps with data-visited', async () => {
      const user = userEvent.setup();
      render(
        <Stepper defaultStep='step-1'>
          <StepperList>
            <StepperStep id='step-1'>Step 1</StepperStep>
            <StepperStep id='step-2'>Step 2</StepperStep>
          </StepperList>
          <StepperPanel id='step-1'>
            <StepperNext>Next</StepperNext>
          </StepperPanel>
        </Stepper>,
      );

      await user.click(screen.getByRole('button', { name: 'Go to next step' }));

      expect(getStepButton('Step 1 of 2')).toHaveAttribute('data-visited');
    });

    it('should remove visited state when navigating backward', async () => {
      const user = userEvent.setup();
      render(
        <Stepper defaultStep='step-1'>
          <StepperList>
            <StepperStep id='step-1'>Step 1</StepperStep>
            <StepperStep id='step-2'>Step 2</StepperStep>
            <StepperStep id='step-3'>Step 3</StepperStep>
          </StepperList>
          <StepperPanel id='step-1'>
            <StepperNext>Next</StepperNext>
          </StepperPanel>
          <StepperPanel id='step-2'>
            <StepperBack>Back</StepperBack>
            <StepperNext>Next</StepperNext>
          </StepperPanel>
          <StepperPanel id='step-3'>
            <StepperBack>Back</StepperBack>
          </StepperPanel>
        </Stepper>,
      );

      await user.click(screen.getByRole('button', { name: 'Go to next step' }));

      expect(getStepButton('Step 2 of 3')).toHaveAttribute('data-current');

      await user.click(screen.getByRole('button', { name: 'Go to next step' }));

      expect(getStepButton('Step 1 of 3')).toHaveAttribute('data-visited');
      expect(getStepButton('Step 2 of 3')).toHaveAttribute('data-visited');
      expect(getStepButton('Step 3 of 3')).toHaveAttribute('data-current');

      await user.click(
        screen.getByRole('button', { name: 'Go to previous step' }),
      );

      expect(getStepButton('Step 1 of 3')).toHaveAttribute('data-visited');
      expect(getStepButton('Step 2 of 3')).toHaveAttribute('data-current');
      expect(getStepButton('Step 2 of 3')).not.toHaveAttribute('data-visited');
      expect(getStepButton('Step 3 of 3')).not.toHaveAttribute('data-visited');
    });

    it('should mark disabled steps with aria-disabled', () => {
      const disabledKeys = new Set<Key>(['step-2']);
      render(
        <Stepper defaultStep='step-1' disabledKeys={disabledKeys}>
          <StepperList>
            <StepperStep id='step-1'>Step 1</StepperStep>
            <StepperStep id='step-2'>Step 2</StepperStep>
          </StepperList>
        </Stepper>,
      );

      const step2 = getStepButton('Step 2 of 2');
      expect(step2).toHaveAttribute('aria-disabled', 'true');
      expect(step2).toHaveAttribute('data-disabled');
    });
  });

  describe('navigation - clicking steps', () => {
    it('should navigate to clicked step', async () => {
      const user = userEvent.setup();
      render(
        <Stepper defaultStep='step-1'>
          <StepperList>
            <StepperStep id='step-1'>Step 1</StepperStep>
            <StepperStep id='step-2'>Step 2</StepperStep>
            <StepperStep id='step-3'>Step 3</StepperStep>
          </StepperList>
          <StepperPanel id='step-1'>Panel 1</StepperPanel>
          <StepperPanel id='step-2'>Panel 2</StepperPanel>
          <StepperPanel id='step-3'>Panel 3</StepperPanel>
        </Stepper>,
      );

      await user.click(getStepButton('Step 3 of 3'));

      expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel 3');
    });

    it('should not navigate to disabled step', async () => {
      const user = userEvent.setup();
      const disabledKeys = new Set<Key>(['step-3']);

      render(
        <Stepper defaultStep='step-1' disabledKeys={disabledKeys}>
          <StepperList>
            <StepperStep id='step-1'>Step 1</StepperStep>
            <StepperStep id='step-2'>Step 2</StepperStep>
            <StepperStep id='step-3'>Step 3</StepperStep>
          </StepperList>
          <StepperPanel id='step-1'>Panel 1</StepperPanel>
          <StepperPanel id='step-2'>Panel 2</StepperPanel>
          <StepperPanel id='step-3'>Panel 3</StepperPanel>
        </Stepper>,
      );

      await user.click(getStepButton('Step 3 of 3'));

      expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel 1');
      expect(screen.queryByText('Panel 3')).not.toBeInTheDocument();
    });

    it('should respect onBeforeStepChange validation', async () => {
      const user = userEvent.setup();
      const onBeforeStepChange = vi.fn(() => false);

      render(
        <Stepper defaultStep='step-1' onBeforeStepChange={onBeforeStepChange}>
          <StepperList>
            <StepperStep id='step-1'>Step 1</StepperStep>
            <StepperStep id='step-2'>Step 2</StepperStep>
          </StepperList>
          <StepperPanel id='step-1'>Panel 1</StepperPanel>
          <StepperPanel id='step-2'>Panel 2</StepperPanel>
        </Stepper>,
      );

      await user.click(getStepButton('Step 2 of 2'));

      expect(onBeforeStepChange).toHaveBeenCalledWith('step-1', 'step-2');
      expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel 1');
      expect(screen.queryByText('Panel 2')).not.toBeInTheDocument();
    });
  });

  describe('navigation - Next/Back buttons', () => {
    it('should navigate forward with StepperNext', async () => {
      const user = userEvent.setup();
      render(
        <Stepper defaultStep='step-1'>
          <StepperList>
            <StepperStep id='step-1'>Step 1</StepperStep>
            <StepperStep id='step-2'>Step 2</StepperStep>
          </StepperList>
          <StepperPanel id='step-1'>
            <StepperNext>Next</StepperNext>
          </StepperPanel>
          <StepperPanel id='step-2'>Panel 2</StepperPanel>
        </Stepper>,
      );

      await user.click(screen.getByRole('button', { name: 'Go to next step' }));

      expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel 2');
    });

    it('should navigate backward with StepperBack', async () => {
      const user = userEvent.setup();
      render(
        <Stepper defaultStep='step-2'>
          <StepperList>
            <StepperStep id='step-1'>Step 1</StepperStep>
            <StepperStep id='step-2'>Step 2</StepperStep>
          </StepperList>
          <StepperPanel id='step-1'>Panel 1</StepperPanel>
          <StepperPanel id='step-2'>
            <StepperBack>Back</StepperBack>
          </StepperPanel>
        </Stepper>,
      );

      await user.click(
        screen.getByRole('button', { name: 'Go to previous step' }),
      );

      expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel 1');
    });

    it('should disable StepperBack at first step', () => {
      render(
        <Stepper defaultStep='step-1'>
          <StepperList>
            <StepperStep id='step-1'>Step 1</StepperStep>
            <StepperStep id='step-2'>Step 2</StepperStep>
          </StepperList>
          <StepperPanel id='step-1'>
            <StepperBack>Back</StepperBack>
          </StepperPanel>
        </Stepper>,
      );

      expect(
        screen.getByRole('button', { name: 'Go to previous step' }),
      ).toBeDisabled();
    });

    it('should disable StepperNext at last step', () => {
      render(
        <Stepper defaultStep='step-2'>
          <StepperList>
            <StepperStep id='step-1'>Step 1</StepperStep>
            <StepperStep id='step-2'>Step 2</StepperStep>
          </StepperList>
          <StepperPanel id='step-2'>
            <StepperNext>Next</StepperNext>
          </StepperPanel>
        </Stepper>,
      );

      expect(
        screen.getByRole('button', { name: 'Go to next step' }),
      ).toBeDisabled();
    });
  });

  describe('keyboard navigation', () => {
    it('should navigate with arrow keys in horizontal mode', async () => {
      const user = userEvent.setup();

      renderStepper({ orientation: 'horizontal' });

      await user.click(getStepButton('Step 1 of 3'));
      await user.keyboard('{ArrowRight}');

      expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel 2');
    });

    it('should navigate with arrow keys in vertical mode', async () => {
      const user = userEvent.setup();

      render(
        <Stepper defaultStep='step-1' orientation='vertical'>
          <StepperList>
            <StepperStep id='step-1'>Step 1</StepperStep>
            <StepperStep id='step-2'>Step 2</StepperStep>
          </StepperList>
          <StepperPanel id='step-1'>Panel 1</StepperPanel>
          <StepperPanel id='step-2'>Panel 2</StepperPanel>
        </Stepper>,
      );

      await user.click(getStepButton('Step 1 of 2'));
      await user.keyboard('{ArrowDown}');

      expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel 2');
    });

    it('should wrap focus at boundaries', async () => {
      const user = userEvent.setup();

      render(
        <Stepper defaultStep='step-3' orientation='horizontal'>
          <StepperList>
            <StepperStep id='step-1'>Step 1</StepperStep>
            <StepperStep id='step-2'>Step 2</StepperStep>
            <StepperStep id='step-3'>Step 3</StepperStep>
          </StepperList>
          <StepperPanel id='step-1'>Panel 1</StepperPanel>
          <StepperPanel id='step-2'>Panel 2</StepperPanel>
          <StepperPanel id='step-3'>Panel 3</StepperPanel>
        </Stepper>,
      );

      await user.click(getStepButton('Step 3 of 3'));
      await user.keyboard('{ArrowRight}');

      expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel 1');
    });

    it('should skip disabled steps during keyboard navigation', async () => {
      const user = userEvent.setup();
      const disabledKeys = new Set<Key>(['step-2']);

      render(
        <Stepper
          defaultStep='step-1'
          orientation='horizontal'
          disabledKeys={disabledKeys}
        >
          <StepperList>
            <StepperStep id='step-1'>Step 1</StepperStep>
            <StepperStep id='step-2'>Step 2</StepperStep>
            <StepperStep id='step-3'>Step 3</StepperStep>
          </StepperList>
          <StepperPanel id='step-1'>Panel 1</StepperPanel>
          <StepperPanel id='step-2'>Panel 2</StepperPanel>
          <StepperPanel id='step-3'>Panel 3</StepperPanel>
        </Stepper>,
      );

      await user.click(getStepButton('Step 1 of 3'));
      await user.keyboard('{ArrowRight}');

      expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel 3');
    });

    it('should activate step with Enter key', async () => {
      const user = userEvent.setup();

      render(
        <Stepper defaultStep='step-1'>
          <StepperList>
            <StepperStep id='step-1'>Step 1</StepperStep>
            <StepperStep id='step-2'>Step 2</StepperStep>
          </StepperList>
          <StepperPanel id='step-1'>Panel 1</StepperPanel>
          <StepperPanel id='step-2'>Panel 2</StepperPanel>
        </Stepper>,
      );

      getStepButton('Step 2 of 2').focus();
      await user.keyboard('{Enter}');

      expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel 2');
    });

    it('should activate step with Space key', async () => {
      const user = userEvent.setup();

      render(
        <Stepper defaultStep='step-1'>
          <StepperList>
            <StepperStep id='step-1'>Step 1</StepperStep>
            <StepperStep id='step-2'>Step 2</StepperStep>
          </StepperList>
          <StepperPanel id='step-1'>Panel 1</StepperPanel>
          <StepperPanel id='step-2'>Panel 2</StepperPanel>
        </Stepper>,
      );

      getStepButton('Step 2 of 2').focus();
      await user.keyboard(' ');

      expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel 2');
    });
  });

  describe('controlled mode', () => {
    it('should work in controlled mode', async () => {
      const user = userEvent.setup();

      function ControlledStepper() {
        const [currentStep, setCurrentStep] = useState<Key>('step-1');

        return (
          <div>
            <output aria-label='Current step'>{String(currentStep)}</output>
            <Stepper currentStep={currentStep} onStepChange={setCurrentStep}>
              <StepperList>
                <StepperStep id='step-1'>Step 1</StepperStep>
                <StepperStep id='step-2'>Step 2</StepperStep>
              </StepperList>
              <StepperPanel id='step-1'>
                <StepperNext>Next</StepperNext>
              </StepperPanel>
              <StepperPanel id='step-2'>Panel 2</StepperPanel>
            </Stepper>
          </div>
        );
      }

      render(<ControlledStepper />);

      await user.click(screen.getByRole('button', { name: 'Go to next step' }));

      expect(
        screen.getByRole('status', { name: 'Current step' }),
      ).toHaveTextContent('step-2');
    });

    it('should invoke onStepChange callback', async () => {
      const user = userEvent.setup();
      const onStepChange = vi.fn();

      render(
        <Stepper currentStep='step-1' onStepChange={onStepChange}>
          <StepperList>
            <StepperStep id='step-1'>Step 1</StepperStep>
            <StepperStep id='step-2'>Step 2</StepperStep>
          </StepperList>
          <StepperPanel id='step-1'>
            <StepperNext>Next</StepperNext>
          </StepperPanel>
        </Stepper>,
      );

      await user.click(screen.getByRole('button', { name: 'Go to next step' }));

      expect(onStepChange).toHaveBeenCalledWith('step-2');
    });
  });

  describe('panel unmounting', () => {
    it('should only render the active panel', () => {
      render(
        <Stepper defaultStep='step-1'>
          <StepperList>
            <StepperStep id='step-1'>Step 1</StepperStep>
            <StepperStep id='step-2'>Step 2</StepperStep>
          </StepperList>
          <StepperPanel id='step-1'>Panel 1</StepperPanel>
          <StepperPanel id='step-2'>Panel 2</StepperPanel>
        </Stepper>,
      );

      expect(screen.getByText('Panel 1')).toBeInTheDocument();
      expect(screen.queryByText('Panel 2')).not.toBeInTheDocument();
    });

    it('should unmount inactive panels from DOM', async () => {
      const user = userEvent.setup();

      render(
        <Stepper defaultStep='step-1'>
          <StepperList>
            <StepperStep id='step-1'>Step 1</StepperStep>
            <StepperStep id='step-2'>Step 2</StepperStep>
          </StepperList>
          <StepperPanel id='step-1'>
            <div data-testid='panel-1'>Panel 1</div>
            <StepperNext>Next</StepperNext>
          </StepperPanel>
          <StepperPanel id='step-2'>
            <div data-testid='panel-2'>Panel 2</div>
          </StepperPanel>
        </Stepper>,
      );

      expect(screen.getByTestId('panel-1')).toBeInTheDocument();
      expect(screen.queryByTestId('panel-2')).not.toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Go to next step' }));

      expect(screen.queryByTestId('panel-1')).not.toBeInTheDocument();
      expect(screen.getByTestId('panel-2')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have navigation region', () => {
      render(
        <Stepper defaultStep='step-1'>
          <StepperList>
            <StepperStep id='step-1'>Step 1</StepperStep>
          </StepperList>
        </Stepper>,
      );

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('should have correct tabpanel role on panels', () => {
      render(
        <Stepper defaultStep='step-1'>
          <StepperList>
            <StepperStep id='step-1'>Step 1</StepperStep>
          </StepperList>
          <StepperPanel id='step-1'>Panel 1</StepperPanel>
        </Stepper>,
      );

      const panel = screen.getByRole('tabpanel');
      expect(panel).toBeInTheDocument();
    });

    it('should link panel to step with aria-labelledby', () => {
      render(
        <Stepper defaultStep='step-1'>
          <StepperList>
            <StepperStep id='step-1'>Step 1</StepperStep>
          </StepperList>
          <StepperPanel id='step-1'>Panel 1</StepperPanel>
        </Stepper>,
      );

      const panel = screen.getByRole('tabpanel');
      expect(panel).toHaveAttribute('aria-labelledby');
    });
  });

  describe('styling', () => {
    it('should support className on StepperStep', () => {
      render(
        <Stepper defaultStep='step-1'>
          <StepperList>
            <StepperStep id='step-1' className='custom-step'>
              Step 1
            </StepperStep>
          </StepperList>
        </Stepper>,
      );

      expect(getStepButton('Step 1 of 1')).toHaveClass('custom-step');
    });

    it('should support className on StepperList', () => {
      render(
        <Stepper defaultStep='step-1'>
          <StepperList className='custom-list'>
            <StepperStep id='step-1'>Step 1</StepperStep>
            <StepperStep id='step-2'>Step 2</StepperStep>
          </StepperList>
        </Stepper>,
      );

      const list = screen.getByRole('navigation');
      expect(list).toHaveClass('custom-list');
    });

    it('should support className on Stepper', () => {
      render(
        <Stepper defaultStep='step-1' className='custom-stepper'>
          <StepperList>
            <StepperStep id='step-1'>Step 1</StepperStep>
            <StepperStep id='step-2'>Step 2</StepperStep>
          </StepperList>
        </Stepper>,
      );

      const stepper = screen.getByRole('navigation').closest('div');
      expect(stepper).toHaveClass('custom-stepper');
    });
  });

  describe('dynamic steps', () => {
    it('should handle conditional step rendering', async () => {
      const user = userEvent.setup();

      function DynamicStepsStepper() {
        const [showOptional, setShowOptional] = useState(false);

        return (
          <div>
            <button type='button' onClick={() => setShowOptional(true)}>
              Show Optional
            </button>
            <Stepper defaultStep='step-1'>
              <StepperList>
                <StepperStep id='step-1'>Step 1</StepperStep>
                {showOptional && <StepperStep id='step-2'>Step 2</StepperStep>}
                <StepperStep id='step-3'>Step 3</StepperStep>
              </StepperList>
            </Stepper>
          </div>
        );
      }

      render(<DynamicStepsStepper />);

      expect(screen.queryByText('Step 2')).not.toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Show Optional' }));

      expect(getStepButton('Step 2 of 3')).toBeInTheDocument();
    });
  });
});
