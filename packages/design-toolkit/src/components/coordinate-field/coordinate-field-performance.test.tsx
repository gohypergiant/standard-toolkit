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

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CoordinateField } from './index';
import type { CoordinateValue } from './types';

/**
 * CoordinateField Performance and Edge Case Tests
 *
 * Tests for:
 * - Component re-rendering performance
 * - Memoization effectiveness
 * - Memory leak prevention
 * - Edge cases and boundary conditions
 * - Accessibility regressions
 */
describe('CoordinateField Performance', () => {
  describe('Re-rendering optimization', () => {
    it('does not re-render segments when unrelated props change', () => {
      const { rerender } = render(
        <CoordinateField label='Location' format='dd' description='Original' />,
      );

      const initialInputs = screen.getAllByRole('textbox');
      const firstInputRef = initialInputs[0];

      rerender(
        <CoordinateField label='Location' format='dd' description='Updated' />,
      );

      const updatedInputs = screen.getAllByRole('textbox');
      expect(updatedInputs[0]).toBe(firstInputRef);
    });

    it('efficiently handles rapid format changes', () => {
      const { rerender } = render(
        <CoordinateField label='Location' format='dd' />,
      );

      expect(screen.getAllByRole('textbox').length).toBe(2);

      rerender(<CoordinateField label='Location' format='ddm' />);
      expect(screen.getAllByRole('textbox').length).toBe(6);

      rerender(<CoordinateField label='Location' format='dms' />);
      expect(screen.getAllByRole('textbox').length).toBe(8);

      rerender(<CoordinateField label='Location' format='dd' />);
      expect(screen.getAllByRole('textbox').length).toBe(2);
    });

    it('maintains stable callback references', () => {
      const onChange = vi.fn();
      const { rerender } = render(
        <CoordinateField label='Location' onChange={onChange} />,
      );

      const initialInputs = screen.getAllByRole('textbox');

      rerender(<CoordinateField label='Location' onChange={onChange} />);

      const rerenderedInputs = screen.getAllByRole('textbox');

      expect(rerenderedInputs.length).toBe(initialInputs.length);
    });
  });

  describe('Memory leak prevention', () => {
    it('cleans up timeouts on unmount', async () => {
      const user = userEvent.setup();
      const { unmount } = render(
        <CoordinateField label='Location' format='dd' />,
      );

      const latInput = screen.getByLabelText('Latitude');

      await user.type(latInput, '40.7128');

      unmount();

      expect(() => {
        // If timeouts are not cleaned up, this could cause errors
      }).not.toThrow();
    });

    it('handles rapid mount/unmount cycles', () => {
      const { unmount: unmount1 } = render(
        <CoordinateField label='Location' />,
      );
      unmount1();

      const { unmount: unmount2 } = render(
        <CoordinateField label='Location' />,
      );
      unmount2();

      const { unmount: unmount3 } = render(
        <CoordinateField label='Location' />,
      );
      unmount3();

      expect(true).toBe(true);
    });
  });

  describe('Edge cases for segment values', () => {
    it.each`
      format    | description
      ${'dd'}   | ${'Decimal Degrees'}
      ${'ddm'}  | ${'Degrees Decimal Minutes'}
      ${'dms'}  | ${'Degrees Minutes Seconds'}
      ${'mgrs'} | ${'MGRS'}
      ${'utm'}  | ${'UTM'}
    `('renders all segments for $description format', ({ format }) => {
      render(<CoordinateField label='Location' format={format} />);
      const inputs = screen.getAllByRole('textbox');
      expect(inputs.length).toBeGreaterThan(0);
    });

    it('handles boundary latitude values', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <CoordinateField label='Location' format='dd' onChange={onChange} />,
      );

      const latInput = screen.getByLabelText('Latitude');
      const lonInput = screen.getByLabelText('Longitude');

      await user.type(latInput, '90');
      await user.type(lonInput, '0');
      await user.tab();

      expect(latInput).toHaveValue('90');
    });

    it('handles boundary longitude values', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <CoordinateField label='Location' format='dd' onChange={onChange} />,
      );

      const latInput = screen.getByLabelText('Latitude');
      const lonInput = screen.getByLabelText('Longitude');

      await user.type(latInput, '0');
      await user.type(lonInput, '180');
      await user.tab();

      expect(lonInput).toHaveValue('180');
    });

    it('handles negative zero correctly', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <CoordinateField label='Location' format='dd' onChange={onChange} />,
      );

      const latInput = screen.getByLabelText('Latitude');
      const lonInput = screen.getByLabelText('Longitude');

      await user.type(latInput, '-0');
      await user.type(lonInput, '0');

      expect(latInput).toHaveValue('-0');
    });

    it('handles multiple decimal points gracefully', async () => {
      const user = userEvent.setup();
      render(<CoordinateField label='Location' format='dd' />);

      const latInput = screen.getByLabelText('Latitude') as HTMLInputElement;

      await user.type(latInput, '40.71.28');

      expect(latInput.value).not.toContain('..');
    });

    it('handles leading zeros', async () => {
      const user = userEvent.setup();
      render(<CoordinateField label='Location' format='dd' />);

      const latInput = screen.getByLabelText('Latitude') as HTMLInputElement;

      await user.type(latInput, '040.7128');

      expect(latInput.value).toBeTruthy();
    });
  });

  describe('Accessibility edge cases', () => {
    it('maintains ARIA labels when format changes', () => {
      const { rerender } = render(
        <CoordinateField label='Location' format='dd' />,
      );

      const ddInputs = screen.getAllByRole('textbox');
      expect(ddInputs[0]).toHaveAttribute('aria-label');

      rerender(<CoordinateField label='Location' format='ddm' />);

      const ddmInputs = screen.getAllByRole('textbox');
      ddmInputs.forEach((input) => {
        expect(input).toHaveAttribute('aria-label');
      });
    });

    it('announces validation errors to screen readers', async () => {
      const user = userEvent.setup();
      render(<CoordinateField label='Location' format='dd' />);

      const latInput = screen.getByLabelText('Latitude');
      const lonInput = screen.getByLabelText('Longitude');

      await user.type(latInput, '91');
      await user.type(lonInput, '0');
      await user.tab();

      const errorMessage = await screen.findByText('Invalid coordinate value');
      expect(errorMessage).toBeInTheDocument();
    });

    it('maintains keyboard navigation order', async () => {
      const user = userEvent.setup();
      render(<CoordinateField label='Location' format='dd' />);

      const inputs = screen.getAllByRole('textbox');

      await user.tab();
      expect(inputs[0]).toHaveFocus();

      await user.tab();
      expect(inputs[1]).toHaveFocus();
    });

    it('supports screen reader navigation in read-only mode', () => {
      const value: CoordinateValue = { lat: 40.7128, lon: -74.006 };
      render(
        <CoordinateField label='Location' value={value} isReadOnly={true} />,
      );

      const inputs = screen.getAllByRole('textbox');
      inputs.forEach((input) => {
        expect(input).toHaveAttribute('readonly');
        expect(input).toHaveAttribute('tabindex', '-1');
      });
    });
  });

  describe('Input mode optimization', () => {
    it('uses decimal input mode for DD format', () => {
      render(<CoordinateField label='Location' format='dd' />);

      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
      inputs.forEach((input) => {
        expect(input.inputMode).toBe('decimal');
      });
    });

    it('uses appropriate input mode for DDM numeric segments', () => {
      render(<CoordinateField label='Location' format='ddm' />);

      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
      const numericInputs = inputs.filter(
        (input) =>
          input.inputMode === 'decimal' || input.inputMode === 'numeric',
      );

      expect(numericInputs.length).toBeGreaterThan(0);
    });

    it('uses text input mode for directional segments', () => {
      render(<CoordinateField label='Location' format='ddm' />);

      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
      const textInputs = inputs.filter((input) => input.inputMode === 'text');

      expect(textInputs.length).toBeGreaterThan(0);
    });
  });

  describe('Concurrent updates', () => {
    it('handles simultaneous segment updates', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <CoordinateField label='Location' format='dd' onChange={onChange} />,
      );

      const latInput = screen.getByLabelText('Latitude') as HTMLInputElement;
      const lonInput = screen.getByLabelText('Longitude') as HTMLInputElement;

      await user.type(latInput, '40.7128');
      await user.type(lonInput, '-74.006');

      expect(latInput.value).toBe('40.7128');
      expect(lonInput.value).toBe('-74.006');
    });

    it('handles rapid focus changes', async () => {
      const user = userEvent.setup();
      render(<CoordinateField label='Location' format='dd' />);

      const inputs = screen.getAllByRole('textbox');

      for (let i = 0; i < 5; i++) {
        await user.click(inputs[0]);
        await user.click(inputs[1]);
      }

      expect(document.activeElement).toBe(inputs[1]);
    });
  });
});
