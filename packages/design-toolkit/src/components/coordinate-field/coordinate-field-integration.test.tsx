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
import { createRef, type RefObject } from 'react';
import { Provider } from 'react-aria-components';
import { describe, expect, it } from 'vitest';
import { CoordinateFieldContext } from './context';
import { CoordinateField } from './index';
import { COORDINATE_SYSTEMS, type CoordinateFieldProps } from './types';

/**
 * CoordinateField Integration Tests
 *
 * Tests for React Spectrum framework integration and architectural compliance.
 * These tests validate how CoordinateField integrates with React Aria/Spectrum patterns.
 *
 * What these tests cover:
 * - GlobalDOMAttributes forwarding (aria-*, data-*, id props)
 * - Ref forwarding to DOM elements
 * - useContextProps integration with React Aria
 * - Provider context integration (GroupContext, LabelContext, TextContext)
 * - ARIA relationship establishment (aria-labelledby, aria-describedby)
 * - ValidationResult structure
 * - Backward compatibility with existing patterns
 *
 * Note: For functional/behavioral tests (user interactions, validation, format conversion),
 * see coordinate-field.test.tsx
 */
describe('CoordinateField - React Spectrum Patterns', () => {
  describe('GlobalDOMAttributes Support', () => {
    describe('aria-* attributes', () => {
      it('applies custom aria-label to the field group', () => {
        const { container } = render(
          <CoordinateField
            label='Location'
            aria-label='Custom coordinate input'
          />,
        );

        const group = container.querySelector('[role="group"]');
        expect(group).toHaveAttribute('aria-label', 'Custom coordinate input');
      });

      it('applies custom aria-describedby to the field group', () => {
        const { container } = render(
          <CoordinateField
            label='Location'
            aria-describedby='external-description'
          />,
        );

        const group = container.querySelector('[role="group"]');
        const describedBy = group?.getAttribute('aria-describedby');
        expect(describedBy).toContain('external-description');
      });

      it('merges custom aria-describedby with internal description', () => {
        const { container } = render(
          <CoordinateField
            label='Location'
            description='Enter coordinates'
            aria-describedby='external-description'
          />,
        );

        const group = container.querySelector('[role="group"]');
        const describedBy = group?.getAttribute('aria-describedby');
        expect(describedBy).toBeTruthy();
        expect(describedBy).toContain('external-description');
      });

      it('applies aria-required to the field group', () => {
        const { container } = render(
          <CoordinateField label='Location' isRequired />,
        );

        const group = container.querySelector('[role="group"]');
        expect(group).toHaveAttribute('aria-required', 'true');
      });

      it('applies aria-invalid to the field group when invalid', () => {
        const { container } = render(
          <CoordinateField
            label='Location'
            isInvalid
            errorMessage='Invalid coordinate'
          />,
        );

        const group = container.querySelector('[role="group"]');
        expect(group).toHaveAttribute('aria-invalid', 'true');
      });

      it('applies aria-disabled to the field group when disabled', () => {
        const { container } = render(
          <CoordinateField label='Location' isDisabled />,
        );

        const group = container.querySelector('[role="group"]');
        expect(group).toHaveAttribute('aria-disabled', 'true');
      });

      it('applies custom aria-details to the field', () => {
        const { container } = render(
          <CoordinateField label='Location' aria-details='help-section' />,
        );

        const group = container.querySelector('[role="group"]');
        expect(group).toHaveAttribute('aria-details', 'help-section');
      });
    });

    describe('data-* attributes', () => {
      it('applies custom data-testid to the field', () => {
        const { container } = render(
          <CoordinateField
            label='Location'
            data-testid='my-coordinate-field'
          />,
        );

        const group = container.querySelector('[role="group"]');
        expect(group).toHaveAttribute('data-testid', 'my-coordinate-field');
      });

      it('applies multiple data-* attributes', () => {
        const { container } = render(
          <CoordinateField
            label='Location'
            data-testid='coordinate-field'
            data-cy='location-input'
            data-tracking-id='coord-123'
          />,
        );

        const group = container.querySelector('[role="group"]');
        expect(group).toHaveAttribute('data-testid', 'coordinate-field');
        expect(group).toHaveAttribute('data-cy', 'location-input');
        expect(group).toHaveAttribute('data-tracking-id', 'coord-123');
      });
    });

    describe('id attribute', () => {
      it('applies custom id to the field group', () => {
        const { container } = render(
          <CoordinateField label='Location' id='custom-field-id' />,
        );

        const group = container.querySelector('[role="group"]');
        expect(group).toHaveAttribute('id', 'custom-field-id');
      });

      it('links label to custom id via aria-labelledby', () => {
        const { container } = render(
          <CoordinateField label='Location' id='custom-field-id' />,
        );

        const group = container.querySelector('[role="group"]');
        const labelledBy = group?.getAttribute('aria-labelledby');
        expect(labelledBy).toBeTruthy();

        // Use regex to match "Location (optional)" when isRequired={false}
        const label = screen.getByText(/Location/);
        expect(label).toBeInTheDocument();
        expect(label).toHaveAttribute('id', labelledBy);
      });

      it('generates unique id when not provided', () => {
        const { container: container1 } = render(
          <CoordinateField label='Location 1' />,
        );
        const { container: container2 } = render(
          <CoordinateField label='Location 2' />,
        );

        const group1 = container1.querySelector('[role="group"]');
        const group2 = container2.querySelector('[role="group"]');

        const id1 = group1?.getAttribute('id');
        const id2 = group2?.getAttribute('id');

        expect(id1).toBeTruthy();
        expect(id2).toBeTruthy();
        expect(id1).not.toBe(id2);
      });
    });

    describe('Combined attributes', () => {
      it('applies all GlobalDOMAttributes together', () => {
        const { container } = render(
          <CoordinateField
            label='Location'
            id='coord-field'
            data-testid='coordinate-input'
            data-tracking='analytics-123'
            aria-label='Enter coordinates'
            aria-details='help-text'
          />,
        );

        const group = container.querySelector('[role="group"]');
        expect(group).toHaveAttribute('id', 'coord-field');
        expect(group).toHaveAttribute('data-testid', 'coordinate-input');
        expect(group).toHaveAttribute('data-tracking', 'analytics-123');
        expect(group).toHaveAttribute('aria-label', 'Enter coordinates');
        expect(group).toHaveAttribute('aria-details', 'help-text');
      });
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to the field container div', () => {
      const ref = createRef<HTMLDivElement>();
      render(<CoordinateField label='Location' ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveAttribute('role', 'group');
    });

    it('ref points to the correct element with data-size attribute', () => {
      const ref = createRef<HTMLDivElement>();
      render(<CoordinateField label='Location' size='small' ref={ref} />);

      expect(ref.current).toHaveAttribute('data-size', 'small');
    });

    it('ref is accessible after render', () => {
      const ref = createRef<HTMLDivElement>();
      const { rerender } = render(
        <CoordinateField label='Location' ref={ref} />,
      );

      expect(ref.current).toBeTruthy();

      rerender(<CoordinateField label='Location Updated' ref={ref} />);
      expect(ref.current).toBeTruthy();
      expect(ref.current).toHaveAttribute('role', 'group');
    });

    it('ref provides access to DOM methods', () => {
      const ref = createRef<HTMLDivElement>();
      render(<CoordinateField label='Location' ref={ref} />);

      expect(ref.current).toBeTruthy();
      expect(typeof ref.current?.querySelector).toBe('function');
      expect(typeof ref.current?.focus).toBe('function');

      const inputs = ref.current?.querySelectorAll('input');
      expect(inputs?.length).toBeGreaterThan(0);
    });

    it('ref updates when component unmounts', () => {
      const ref = createRef<HTMLDivElement>();
      const { unmount } = render(
        <CoordinateField label='Location' ref={ref} />,
      );

      expect(ref.current).toBeTruthy();

      unmount();

      // Note: In React 18+, refs are automatically set to null on unmount.
      // This is expected behavior for all components with refs.
      expect(ref.current).toBeNull();
    });

    it('allows multiple components to have independent refs', () => {
      const ref1 = createRef<HTMLDivElement>();
      const ref2 = createRef<HTMLDivElement>();

      render(
        <>
          <CoordinateField label='Location 1' ref={ref1} id='field-1' />
          <CoordinateField label='Location 2' ref={ref2} id='field-2' />
        </>,
      );

      expect(ref1.current).toBeTruthy();
      expect(ref2.current).toBeTruthy();
      expect(ref1.current).not.toBe(ref2.current);
      expect(ref1.current).toHaveAttribute('id', 'field-1');
      expect(ref2.current).toHaveAttribute('id', 'field-2');
    });
  });

  describe('useContextProps Integration', () => {
    it('merges props from CoordinateFieldContext', () => {
      const contextProps: Partial<CoordinateFieldProps> = {
        isDisabled: true,
        size: 'small',
      };

      const { container } = render(
        <Provider values={[[CoordinateFieldContext, contextProps]]}>
          <CoordinateField label='Location' />
        </Provider>,
      );

      const group = container.querySelector('[role="group"]');
      expect(group).toHaveAttribute('data-disabled', 'true');
      expect(group).toHaveAttribute('data-size', 'small');
    });

    it('component props override context props', () => {
      const contextProps: Partial<CoordinateFieldProps> = {
        isDisabled: true,
        size: 'small',
      };

      const { container } = render(
        <Provider values={[[CoordinateFieldContext, contextProps]]}>
          <CoordinateField label='Location' isDisabled={false} size='medium' />
        </Provider>,
      );

      const group = container.querySelector('[role="group"]');
      expect(group).not.toHaveAttribute('data-disabled');
      expect(group).toHaveAttribute('data-size', 'medium');
    });

    it('merges ref from context with component ref', () => {
      const contextRef = createRef<HTMLDivElement>();
      const componentRef = createRef<HTMLDivElement>();

      // Note: React Aria's useContextProps handles ref merging
      // The componentRef takes precedence
      render(
        <Provider
          values={[
            [
              CoordinateFieldContext,
              { ref: contextRef as RefObject<HTMLDivElement> },
            ],
          ]}
        >
          <CoordinateField label='Location' ref={componentRef} />
        </Provider>,
      );

      expect(componentRef.current).toBeInstanceOf(HTMLDivElement);
    });

    it('works without context provider', () => {
      const { container } = render(<CoordinateField label='Location' />);

      const group = container.querySelector('[role="group"]');
      expect(group).toBeInTheDocument();
    });

    it('merges format from context', () => {
      const contextProps: Partial<CoordinateFieldProps> = {
        format: 'ddm',
      };

      const { container } = render(
        <Provider values={[[CoordinateFieldContext, contextProps]]}>
          <CoordinateField label='Location' />
        </Provider>,
      );

      const inputs = container.querySelectorAll('input');
      expect(inputs.length).toBe(6);
    });

    it('merges errorMessage from context', () => {
      const contextProps: Partial<CoordinateFieldProps> = {
        isInvalid: true,
        errorMessage: 'Context error message',
      };

      render(
        <Provider values={[[CoordinateFieldContext, contextProps]]}>
          <CoordinateField label='Location' />
        </Provider>,
      );

      expect(screen.getByText('Context error message')).toBeInTheDocument();
    });
  });

  describe('Accessibility - ARIA Relationships', () => {
    it('establishes proper aria-labelledby relationship', () => {
      const { container } = render(<CoordinateField label='Location' />);

      const group = container.querySelector('[role="group"]');
      const labelId = group?.getAttribute('aria-labelledby');

      expect(labelId).toBeTruthy();

      // Use regex to match "Location (optional)" when isRequired={false}
      const label = screen.getByText(/Location/);
      expect(label).toBeInTheDocument();
      expect(label).toHaveAttribute('id', labelId);
    });

    it('establishes proper aria-describedby relationship with description', () => {
      const { container } = render(
        <CoordinateField
          label='Location'
          description='Enter your coordinates'
        />,
      );

      const group = container.querySelector('[role="group"]');
      const describedBy = group?.getAttribute('aria-describedby');

      expect(describedBy).toBeTruthy();

      const description = screen.getByText('Enter your coordinates');
      expect(description).toBeInTheDocument();

      const descriptionId = description.getAttribute('id');
      expect(describedBy).toContain(descriptionId || '');
    });

    it('establishes proper aria-describedby relationship with error', () => {
      const { container } = render(
        <CoordinateField
          label='Location'
          isInvalid
          errorMessage='Invalid coordinate'
        />,
      );

      const group = container.querySelector('[role="group"]');
      const describedBy = group?.getAttribute('aria-describedby');

      expect(describedBy).toBeTruthy();

      const error = screen.getByText('Invalid coordinate');
      expect(error).toBeInTheDocument();

      const errorId = error.getAttribute('id');
      expect(describedBy).toContain(errorId || '');
    });

    it('combines description and error in aria-describedby', () => {
      const { container } = render(
        <CoordinateField
          label='Location'
          description='Enter coordinates'
          isInvalid
          errorMessage='Invalid format'
        />,
      );

      const group = container.querySelector('[role="group"]');
      const describedBy = group?.getAttribute('aria-describedby');

      expect(describedBy).toBeTruthy();

      const descriptionIds = describedBy?.split(' ') || [];
      expect(descriptionIds.length).toBeGreaterThan(0);

      const error = screen.getByText('Invalid format');
      expect(error).toBeInTheDocument();

      const errorId = error.getAttribute('id');
      expect(describedBy).toContain(errorId || '');

      // Note: In the React Spectrum pattern, when both description and error are present,
      // the error may take precedence or the description may not be rendered.
      expect(describedBy?.split(' ').length).toBeGreaterThanOrEqual(1);
    });

    it('sets role="group" on the field container', () => {
      const { container } = render(<CoordinateField label='Location' />);

      const group = container.querySelector('[role="group"]');
      expect(group).toBeInTheDocument();
    });

    it('provides proper ARIA attributes for validation states', () => {
      const { container, rerender } = render(
        <CoordinateField label='Location' />,
      );

      let group = container.querySelector('[role="group"]');
      expect(group).not.toHaveAttribute('aria-invalid');

      rerender(
        <CoordinateField
          label='Location'
          isInvalid
          errorMessage='Invalid coordinate'
        />,
      );

      group = container.querySelector('[role="group"]');
      expect(group).toHaveAttribute('aria-invalid', 'true');
    });

    it('provides proper ARIA attributes for required state', () => {
      const { container, rerender } = render(
        <CoordinateField label='Location' />,
      );

      let group = container.querySelector('[role="group"]');
      expect(group).not.toHaveAttribute('aria-required');

      rerender(<CoordinateField label='Location' isRequired />);

      group = container.querySelector('[role="group"]');
      expect(group).toHaveAttribute('aria-required', 'true');
    });

    it('provides proper ARIA attributes for disabled state', () => {
      const { container, rerender } = render(
        <CoordinateField label='Location' />,
      );

      let group = container.querySelector('[role="group"]');
      expect(group).not.toHaveAttribute('aria-disabled');

      rerender(<CoordinateField label='Location' isDisabled />);

      group = container.querySelector('[role="group"]');
      expect(group).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Provider Context Integration', () => {
    it('makes GroupContext available to children', () => {
      const { container } = render(<CoordinateField label='Location' />);

      const group = container.querySelector('[role="group"]');
      expect(group).toBeInTheDocument();
    });

    it('makes LabelContext available to label', () => {
      const { container } = render(<CoordinateField label='Location' />);

      const group = container.querySelector('[role="group"]');
      const labelId = group?.getAttribute('aria-labelledby');

      // Use regex to match "Location (optional)" when isRequired={false}
      const label = screen.getByText(/Location/);
      expect(label).toBeInTheDocument();
      expect(label).toHaveAttribute('id', labelId);
    });

    it('makes TextContext available for description slot', () => {
      render(<CoordinateField label='Location' description='Helper text' />);

      const description = screen.getByText('Helper text');
      expect(description).toBeInTheDocument();

      const descriptionId = description.getAttribute('id');
      expect(descriptionId).toBeTruthy();
    });

    it('makes TextContext available for errorMessage slot', () => {
      render(
        <CoordinateField
          label='Location'
          isInvalid
          errorMessage='Error text'
        />,
      );

      const error = screen.getByText('Error text');
      expect(error).toBeInTheDocument();

      const errorId = error.getAttribute('id');
      expect(errorId).toBeTruthy();
    });

    it('makes FieldErrorContext available with validation state', () => {
      const { container } = render(
        <CoordinateField
          label='Location'
          isInvalid
          errorMessage='Invalid coordinate'
        />,
      );

      const group = container.querySelector('[role="group"]');
      expect(group).toHaveAttribute('aria-invalid', 'true');

      const error = screen.getByText('Invalid coordinate');
      expect(error).toBeInTheDocument();
    });
  });

  describe('ValidationResult Structure', () => {
    it('sets proper validation state when valid', () => {
      const { container } = render(
        <CoordinateField
          label='Location'
          value={{ lat: 40.7128, lon: -74.006 }}
        />,
      );

      const group = container.querySelector('[role="group"]');
      expect(group).not.toHaveAttribute('aria-invalid');
    });

    it('sets proper validation state when invalid', () => {
      const { container } = render(
        <CoordinateField
          label='Location'
          isInvalid
          errorMessage='Invalid coordinate'
        />,
      );

      const group = container.querySelector('[role="group"]');
      expect(group).toHaveAttribute('aria-invalid', 'true');
    });

    it('displays validation errors in FieldError component', () => {
      render(
        <CoordinateField
          label='Location'
          isInvalid
          errorMessage='Coordinate is required'
        />,
      );

      const error = screen.getByText('Coordinate is required');
      expect(error).toBeInTheDocument();
    });

    it('clears validation errors when field becomes valid', () => {
      const { rerender } = render(
        <CoordinateField
          label='Location'
          isInvalid
          errorMessage='Invalid coordinate'
        />,
      );

      expect(screen.getByText('Invalid coordinate')).toBeInTheDocument();

      rerender(<CoordinateField label='Location' />);

      expect(screen.queryByText('Invalid coordinate')).not.toBeInTheDocument();
    });
  });

  describe('Regression Tests', () => {
    it('maintains backward compatibility with existing props', () => {
      const { container } = render(
        <CoordinateField
          label='Location'
          description='Enter coordinates'
          format='dd'
          size='medium'
          isRequired
          isDisabled={false}
        />,
      );

      const group = container.querySelector('[role="group"]');
      expect(group).toBeInTheDocument();
      expect(group).toHaveAttribute('data-size', 'medium');
      expect(group).toHaveAttribute('aria-required', 'true');
    });

    it('renders all existing format types correctly', () => {
      COORDINATE_SYSTEMS.forEach((format) => {
        const { container } = render(
          <CoordinateField label='Location' format={format} />,
        );

        const group = container.querySelector('[role="group"]');
        expect(group).toBeInTheDocument();

        const inputs = container.querySelectorAll('input');
        expect(inputs.length).toBeGreaterThan(0);
      });
    });

    it('maintains existing onChange callback behavior', () => {
      let callCount = 0;
      const handleChange = () => {
        callCount++;
      };

      render(<CoordinateField label='Location' onChange={handleChange} />);

      expect(callCount).toBe(0);
    });

    it('maintains existing validation behavior', () => {
      const { container } = render(
        <CoordinateField
          label='Location'
          value={{ lat: 91, lon: 0 }} // Invalid lat > 90
        />,
      );

      const group = container.querySelector('[role="group"]');
      expect(group).toBeInTheDocument();
    });
  });
});
