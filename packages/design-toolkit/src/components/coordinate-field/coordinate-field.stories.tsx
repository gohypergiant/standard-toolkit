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

import { useState } from 'react';
import { Button } from '../button';
import { Label } from '../label';
import { OptionsItem } from '../options/item';
import { OptionsItemLabel } from '../options/item-label';
import { SelectField } from '../select-field';
import { CoordinateField } from './index';
import {
  COORDINATE_SYSTEMS,
  type CoordinateSystem,
  type CoordinateValue,
} from './types';
import type { Key } from '@react-types/shared';
import type { Meta, StoryObj } from '@storybook/react';

/**
 * CoordinateField Storybook Stories
 *
 * Comprehensive documentation and interactive examples for the CoordinateField component.
 *
 * Features:
 * - Basic component structure with segmented input
 * - Keyboard navigation between segments
 * - All coordinate system formats (DD, DDM, DMS, MGRS, UTM)
 * - Value conversion and validation with @accelint/geo
 * - Error handling via onError callback with error messages
 * - Format conversion popover with copy functionality
 * - Paste handling with parser disambiguation
 * - Comprehensive test coverage
 * - Complete Storybook documentation
 */
const meta = {
  title: 'Components/CoordinateField',
  component: CoordinateField,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A comprehensive coordinate input field supporting multiple coordinate systems (DD, DDM, DMS, MGRS, UTM) with validation, format conversion, and intelligent paste handling. All values are normalized to Decimal Degrees internally for consistency.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    label: 'Coordinates',
    description: 'Enter location coordinates',
    errorMessage: '',
    format: 'dd',
    size: 'medium',
    isDisabled: false,
    isInvalid: false,
    isRequired: false,
  },
  argTypes: {
    format: {
      control: 'select',
      options: [...COORDINATE_SYSTEMS],
      description: 'The coordinate system format for display and input',
      table: {
        type: { summary: 'CoordinateSystem' },
        defaultValue: { summary: 'dd' },
      },
    },
    size: {
      control: 'radio',
      options: ['small', 'medium'],
      description: 'The size variant of the field',
      table: {
        type: { summary: 'small | medium' },
        defaultValue: { summary: 'medium' },
      },
    },
    showFormatButton: {
      control: 'boolean',
      description:
        'Whether to show the format button for copying coordinates in different formats',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    label: {
      control: 'text',
      description: 'Label text displayed above the field (medium size only)',
      table: {
        type: { summary: 'string' },
      },
    },
    description: {
      control: 'text',
      description: 'Helper text displayed below the field',
      table: {
        type: { summary: 'string' },
      },
    },
    errorMessage: {
      control: 'text',
      description: 'Error message to display when field is invalid',
      table: {
        type: { summary: 'string' },
      },
    },
    isDisabled: {
      control: 'boolean',
      description: 'Whether the field is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    isRequired: {
      control: 'boolean',
      description: 'Whether the field is required',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    isInvalid: {
      control: 'boolean',
      description: 'Whether the field is in an invalid state',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    value: {
      control: 'object',
      description:
        'Controlled value in Decimal Degrees format { lat: number, lon: number }',
      table: {
        type: { summary: 'CoordinateValue' },
      },
    },
    defaultValue: {
      control: 'object',
      description: 'Default uncontrolled value in Decimal Degrees format',
      table: {
        type: { summary: 'CoordinateValue' },
      },
    },
    onChange: {
      action: 'onChange',
      description:
        'Callback when coordinate value changes (receives DD format or null)',
      table: {
        type: { summary: '(value: CoordinateValue | null) => void' },
      },
    },
  },
} satisfies Meta<typeof CoordinateField>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default story - Basic usage with Decimal Degrees format
 *
 * Demonstrates the most common use case: a simple coordinate field with
 * label, description, and DD format input.
 */
export const Default: Story = {
  args: {
    label: 'Location',
    description: 'Enter a coordinate in Decimal Degrees format',
    format: 'dd',
    size: 'medium',
  },
  parameters: {
    docs: {
      description: {
        story:
          'The default configuration provides a labeled field with DD format. This is the recommended starting point for most use cases.',
      },
    },
  },
};

/**
 * Small size variant
 * Label is hidden in small size
 */
export const SmallSize: Story = {
  args: {
    size: 'small',
  },
  render: (args) => <CoordinateField {...args} />,
};

/**
 * With Copy Button Disabled
 *
 * The copy button can be hidden by setting showFormatButton to false.
 * This works for both medium and small sizes.
 */
export const WithoutCopyButton: Story = {
  args: {
    showFormatButton: false,
    value: { lat: 40.7128, lon: -74.006 },
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <CoordinateField {...args} label='Medium without copy' size='medium' />
      <CoordinateField {...args} label='Small without copy' size='small' />
    </div>
  ),
};

/**
 * Decimal Degrees format (default)
 *
 * Format: [lat], [lon]
 * Example: 40.7128, -74.0060 (New York City)
 *
 * Segments:
 * - Latitude: -90 to 90 (decimal degrees)
 * - Longitude: -180 to 180 (decimal degrees)
 *
 * Total: 2 editable segments
 */
export const DecimalDegrees: Story = {
  args: {
    format: 'dd',
    description: 'Example: 40.7128, -74.0060 (New York City)',
  },
  render: (args) => <CoordinateField {...args} />,
};

/**
 * Degrees Decimal Minutes format
 *
 * Format: [lat_deg]° [lat_min]' [lat_dir], [lon_deg]° [lon_min]' [lon_dir]
 * Example: 40° 42.768' N, 74° 0.360' W (New York City)
 *
 * Segments:
 * - Latitude degrees: 0-90 (whole number)
 * - Latitude minutes: 0-59.9999 (decimal allowed)
 * - Latitude direction: N or S
 * - Longitude degrees: 0-180 (whole number)
 * - Longitude minutes: 0-59.9999 (decimal allowed)
 * - Longitude direction: E or W
 *
 * Total: 6 editable segments
 */
export const DegreesDecimalMinutes: Story = {
  args: {
    format: 'ddm',
    description: "Example: 40° 42.768' N, 74° 0.360' W (New York City)",
  },
  render: (args) => <CoordinateField {...args} />,
};

/**
 * Degrees Minutes Seconds format
 *
 * Format: [lat_deg]° [lat_min]' [lat_sec]" [lat_dir], [lon_deg]° [lon_min]' [lon_sec]" [lon_dir]
 * Example: 40° 42' 46.08" N, 74° 0' 21.60" W (New York City)
 *
 * Segments:
 * - Latitude degrees: 0-90 (whole number)
 * - Latitude minutes: 0-59 (whole number)
 * - Latitude seconds: 0-59.99 (decimal allowed)
 * - Latitude direction: N or S
 * - Longitude degrees: 0-180 (whole number)
 * - Longitude minutes: 0-59 (whole number)
 * - Longitude seconds: 0-59.99 (decimal allowed)
 * - Longitude direction: E or W
 *
 * Total: 8 editable segments
 */
export const DegreesMinutesSeconds: Story = {
  args: {
    format: 'dms',
    description: 'Example: 40° 42\' 46.08" N, 74° 0\' 21.60" W (New York City)',
  },
  render: (args) => <CoordinateField {...args} />,
};

/**
 * MGRS (Military Grid Reference System) format
 *
 * Format: [zone][band] [grid_100km] [easting] [northing]
 * Example: 18T WL 80654 06346 (New York City)
 *
 * Segments:
 * - Zone: 1-60 (2 digits)
 * - Band: C-X, excluding I and O (1 letter)
 * - Grid 100km: 2 letters (A-Z, excluding I and O)
 * - Easting: 5 digits (can be 1-5 based on precision)
 * - Northing: 5 digits (can be 1-5 based on precision)
 *
 * Total: 5 editable segments
 */
export const MGRS: Story = {
  args: {
    format: 'mgrs',
    description: 'Example: 18T WL 80654 06346 (New York City)',
  },
  render: (args) => <CoordinateField {...args} />,
};

/**
 * UTM (Universal Transverse Mercator) format
 *
 * Format: [zone][hemisphere] [easting] [northing]
 * Example: 18N 585628 4511644 (New York City)
 *
 * Segments:
 * - Zone: 1-60 (2 digits)
 * - Hemisphere: N or S (1 letter)
 * - Easting: 6-7 digits
 * - Northing: 7 digits
 *
 * Total: 4 editable segments
 */
export const UTM: Story = {
  args: {
    format: 'utm',
    description: 'Example: 18N 585628 4511644 (New York City)',
  },
  render: (args) => <CoordinateField {...args} />,
};

/**
 * Field with error state
 */
export const WithError: Story = {
  args: {
    isInvalid: true,
    errorMessage: 'Invalid coordinate format',
    description: undefined, // Description is hidden when error is shown
  },
  render: (args) => <CoordinateField {...args} />,
};

/**
 * Disabled field
 */
export const Disabled: Story = {
  args: {
    isDisabled: true,
    description: 'This field is disabled',
  },
  render: (args) => <CoordinateField {...args} />,
};

/**
 * Required field
 */
export const Required: Story = {
  args: {
    isRequired: true,
    description: 'This field is required',
  },
  render: (args) => <CoordinateField {...args} />,
};

/**
 * Controlled component example
 * Demonstrates controlled component with external state and validation
 */
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<{ lat: number; lon: number } | null>(
      null,
    );

    return (
      <div className='flex flex-col gap-m'>
        <CoordinateField
          label='Controlled Coordinates'
          description='Enter valid coordinates to see the value update'
          value={value || undefined}
          onChange={setValue}
        />
        <div className='fg-primary-muted rounded border border-outline-neutral bg-surface-primary p-s text-body-s'>
          <div className='mb-2xs font-semibold'>Current Value:</div>
          {value ? (
            <>
              <div>Latitude: {value.lat.toFixed(6)}</div>
              <div>Longitude: {value.lon.toFixed(6)}</div>
            </>
          ) : (
            <div>
              No value yet - enter coordinates to see validation in action
            </div>
          )}
        </div>
      </div>
    );
  },
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Validation Demo
 *
 * Demonstrates real-time validation using @accelint/geo with the onError callback.
 *
 * Try entering invalid coordinates to see validation errors:
 * - Latitude > 90 or < -90 → "Invalid coordinate value"
 * - Longitude > 180 or < -180 → "Invalid coordinate value"
 * - Minutes > 59 (for DDM/DMS) → "Invalid coordinate value"
 * - Seconds > 59 (for DMS) → "Invalid coordinate value"
 *
 * Error handling uses the onError callback with isInvalid/errorMessage props
 * for implementor-controlled display.
 */
export const ValidationDemo: Story = {
  render: () => {
    const [value, setValue] = useState<{ lat: number; lon: number } | null>(
      null,
    );
    const [validationError, setValidationError] = useState<string>('');

    const handleError = (
      message: string,
      context?: Record<string, unknown>,
    ) => {
      setValidationError(message);
      console.error('Validation error:', message, context);
    };

    const handleChange = (newValue: { lat: number; lon: number } | null) => {
      setValue(newValue);
      setValidationError('');
    };

    return (
      <CoordinateField
        label='Test Validation'
        description='Try entering 181, 91'
        format='dd'
        value={value || undefined}
        onChange={handleChange}
        onError={handleError}
        isInvalid={!!validationError}
        errorMessage={validationError}
      />
    );
  },
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Pre-filled Value Demo
 *
 * Demonstrates initializing the component with a value prop.
 * The coordinate is automatically converted to the display format.
 *
 * New York City coordinates: { lat: 40.7128, lon: -74.006 }
 */
export const WithInitialValue: Story = {
  render: () => {
    const newYorkCity = { lat: 40.7128, lon: -74.006 };
    const [value, setValue] = useState<{ lat: number; lon: number } | null>(
      newYorkCity,
    );

    return (
      <div className='flex flex-col gap-m'>
        <CoordinateField
          label='New York City'
          description='Pre-filled with NYC coordinates'
          format='dd'
          value={value}
          onChange={setValue}
        />
        <div className='fg-primary-muted text-body-s'>
          {value
            ? `Lat: ${value.lat.toFixed(6)}, Lon: ${value.lon.toFixed(6)}`
            : 'No value'}
        </div>
      </div>
    );
  },
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Format Conversion Demo
 *
 * Demonstrates automatic conversion between formats while preserving the coordinate value.
 * The internal DD value is maintained and converted to the selected display format.
 *
 * Try switching formats - the coordinate value is preserved!
 */
export const FormatConversionDemo: Story = {
  render: () => {
    const newYorkCity = { lat: 40.7128, lon: -74.006 };
    const [value, setValue] = useState<{ lat: number; lon: number } | null>(
      newYorkCity,
    );
    const [format, setFormat] = useState<'dd' | 'ddm' | 'dms' | 'mgrs' | 'utm'>(
      'dd',
    );

    const handleFormatChange = (key: Key | null) => {
      if (key) {
        setFormat(key as CoordinateSystem);
      }
    };

    return (
      <div className='flex flex-col gap-m'>
        <div className='flex gap-s'>
          <SelectField
            label='Select Format'
            value={format}
            onChange={handleFormatChange}
            size='small'
          >
            <OptionsItem id='dd' textValue='Decimal Degrees (DD)'>
              <OptionsItemLabel>Decimal Degrees (DD)</OptionsItemLabel>
            </OptionsItem>
            <OptionsItem id='ddm' textValue='Degrees Decimal Minutes (DDM)'>
              <OptionsItemLabel>Degrees Decimal Minutes (DDM)</OptionsItemLabel>
            </OptionsItem>
            <OptionsItem id='dms' textValue='Degrees Minutes Seconds (DMS)'>
              <OptionsItemLabel>Degrees Minutes Seconds (DMS)</OptionsItemLabel>
            </OptionsItem>
            <OptionsItem id='mgrs' textValue='MGRS'>
              <OptionsItemLabel>MGRS</OptionsItemLabel>
            </OptionsItem>
            <OptionsItem id='utm' textValue='UTM'>
              <OptionsItemLabel>UTM</OptionsItemLabel>
            </OptionsItem>
          </SelectField>
        </div>

        <CoordinateField
          label='New York City Coordinates'
          description='Same coordinate displayed in different formats'
          format={format}
          value={value}
          onChange={setValue}
        />

        <div className='fg-primary-muted rounded border border-outline-neutral bg-surface-primary p-s text-body-s'>
          <div className='mb-2xs font-semibold'>Internal Value (DD):</div>
          {value ? (
            <>
              <div>Latitude: {value.lat.toFixed(6)}</div>
              <div>Longitude: {value.lon.toFixed(6)}</div>
            </>
          ) : (
            <div>No value</div>
          )}
        </div>
      </div>
    );
  },
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Format Popover Demo
 *
 * Demonstrates the format conversion popover that shows all coordinate formats.
 * Click the globe icon button to see the coordinate in all 5 formats.
 * Each format has a copy button to copy the value to the clipboard.
 *
 * Features:
 * - Shows current coordinate in DD, DDM, DMS, MGRS, and UTM formats
 * - Copy to clipboard functionality for each format
 * - Visual feedback when a format is copied (checkmark icon)
 * - Only available for medium size (small size doesn't show the button)
 * - Button disabled when no valid coordinate is entered
 *
 * Try it:
 * 1. Enter a valid coordinate (e.g., 40.7128, -74.006)
 * 2. Click the globe icon button to open the popover
 * 3. Click any copy button to copy that format to clipboard
 * 4. See the checkmark appear for 2 seconds as confirmation
 */
export const FormatPopoverDemo: Story = {
  render: () => {
    const newYorkCity = { lat: 40.7128, lon: -74.006 };
    const [value, setValue] = useState<{ lat: number; lon: number } | null>(
      newYorkCity,
    );

    return (
      <div className='flex flex-col gap-m'>
        <CoordinateField
          label='Coordinate with Format Popover'
          description='Click the globe icon to see all format conversions'
          format='dd'
          value={value}
          onChange={setValue}
        />

        <div className='fg-primary-muted rounded border border-outline-neutral bg-surface-primary p-s text-body-s'>
          <div className='mb-2xs font-semibold'>Instructions:</div>
          <ul className='list-inside list-disc space-y-2xs'>
            <li>Click the globe icon to open the format conversion popover</li>
            <li>All 5 coordinate formats are displayed</li>
            <li>Click the copy icon next to any format to copy it</li>
            <li>The icon changes to a checkmark for 2 seconds after copying</li>
            <li>The button is disabled when no valid coordinate is entered</li>
          </ul>
        </div>
      </div>
    );
  },
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Paste Handling Demo
 *
 * Demonstrates all paste-related functionality including automatic format detection,
 * parsing, conversion, disambiguation, and error handling.
 *
 * Features:
 * - Auto-detection of complete coordinates vs. single values
 * - Parsing of all 5 coordinate formats (DD, DDM, DMS, MGRS, UTM)
 * - Automatic application when only one format matches
 * - Disambiguation modal when multiple formats match
 * - Error handling with onError callback ("Invalid coordinate format" for paste errors)
 * - Format conversion to selected display format
 * - Implementor-controlled error display
 *
 * This story combines all paste functionality into a single interactive demo,
 * allowing you to test both successful parsing and error handling in one place.
 */
export const PasteHandling: Story = {
  render: () => {
    const [value, setValue] = useState<{ lat: number; lon: number } | null>(
      null,
    );
    const [format, setFormat] = useState<'dd' | 'ddm' | 'dms' | 'mgrs' | 'utm'>(
      'dd',
    );
    const [pasteError, setPasteError] = useState<string>('');

    const handleFormatChange = (key: Key | null) => {
      if (key) {
        setFormat(key as 'dd' | 'ddm' | 'dms' | 'mgrs' | 'utm');
      }
    };

    const handleChange = (newValue: { lat: number; lon: number } | null) => {
      setValue(newValue);
      // Clear paste error when valid value is entered
      if (newValue && pasteError) {
        setPasteError('');
      }
    };

    const handleError = (
      message: string,
      context?: Record<string, unknown>,
    ) => {
      setPasteError(message);
      // eslint-disable-next-line no-console
      console.error('Paste error:', message, context);
    };

    return (
      <div className='flex max-w-2xl flex-col gap-m'>
        <SelectField
          label='Display Format'
          value={format}
          onChange={handleFormatChange}
          size='small'
        >
          <OptionsItem id='dd' textValue='Decimal Degrees (DD)'>
            <OptionsItemLabel>Decimal Degrees (DD)</OptionsItemLabel>
          </OptionsItem>
          <OptionsItem id='ddm' textValue='Degrees Decimal Minutes (DDM)'>
            <OptionsItemLabel>Degrees Decimal Minutes (DDM)</OptionsItemLabel>
          </OptionsItem>
          <OptionsItem id='dms' textValue='Degrees Minutes Seconds (DMS)'>
            <OptionsItemLabel>Degrees Minutes Seconds (DMS)</OptionsItemLabel>
          </OptionsItem>
          <OptionsItem id='mgrs' textValue='MGRS'>
            <OptionsItemLabel>MGRS</OptionsItemLabel>
          </OptionsItem>
          <OptionsItem id='utm' textValue='UTM'>
            <OptionsItemLabel>UTM</OptionsItemLabel>
          </OptionsItem>
        </SelectField>

        <CoordinateField
          label='Paste Coordinates Here'
          description='Paste any coordinate format to see parsing, conversion, and error handling'
          format={format}
          value={value || undefined}
          onChange={handleChange}
          onError={handleError}
          isInvalid={!!pasteError}
          errorMessage={pasteError}
        />

        <div className='fg-primary-muted rounded border border-outline-neutral bg-surface-primary p-s text-body-s'>
          <div className='mb-xs font-semibold'>How Paste Handling Works:</div>
          <ol className='mb-m list-inside list-decimal space-y-2xs'>
            <li>Click in the coordinate field above</li>
            <li>Paste one of the example coordinates below</li>
            <li>The field automatically detects and parses the format</li>
            <li>
              If multiple formats match, a modal lets you choose the correct one
            </li>
            <li>The coordinate converts to the selected display format</li>
            <li>If parsing fails, the onError callback displays an error</li>
          </ol>

          <div className='mb-xs font-semibold'>Valid Coordinates to Paste:</div>
          <div className='mb-m space-y-2xs rounded bg-surface-subtle p-xs font-mono text-body-xs'>
            <div className='flex gap-xs'>
              <span className='w-[60px] font-bold'>DD:</span>
              <span>40.7128, -74.006</span>
            </div>
            <div className='flex gap-xs'>
              <span className='w-[60px] font-bold'>DDM:</span>
              <span>40° 42.768' N, 74° 0.360' W</span>
            </div>
            <div className='flex gap-xs'>
              <span className='w-[60px] font-bold'>DMS:</span>
              <span>40° 42' 46.08" N, 74° 0' 21.60" W</span>
            </div>
            <div className='flex gap-xs'>
              <span className='w-[60px] font-bold'>MGRS:</span>
              <span>18T WL 80654 06346</span>
            </div>
            <div className='flex gap-xs'>
              <span className='w-[60px] font-bold'>UTM:</span>
              <span>18N 585628 4511644</span>
            </div>
          </div>

          <div className='mb-xs font-semibold'>Error Testing Examples:</div>
          <div className='space-y-2xs rounded bg-surface-subtle p-xs font-mono text-body-xs'>
            <div className='flex gap-xs'>
              <span className='w-[80px] font-bold'>Invalid:</span>
              <span>9999, 9999</span>
            </div>
          </div>
        </div>

        {pasteError && (
          <div className='rounded border border-outline-negative bg-surface-negative p-s text-body-s'>
            <div className='fg-negative mb-xs font-semibold'>Paste Error:</div>
            <div>{pasteError}</div>
            <div className='fg-primary-muted mt-xs text-body-xs'>
              The onError callback captured this error. Error display is
              controlled by the implementor.
            </div>
          </div>
        )}

        {value && !pasteError && (
          <div className='rounded border border-outline-positive bg-surface-positive p-s text-body-s'>
            <div className='fg-positive mb-xs font-semibold'>
              Successfully Parsed (DD):
            </div>
            <div>Latitude: {value.lat.toFixed(6)}°</div>
            <div>Longitude: {value.lon.toFixed(6)}°</div>
          </div>
        )}
      </div>
    );
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Comprehensive demonstration of paste handling including automatic format detection, disambiguation, format conversion, and error handling with the onError callback. Test both successful parsing and error cases in a single interactive demo.',
      },
    },
  },
};

/**
 * All Coordinate Formats - Side-by-side comparison
 *
 * Shows all 5 supported coordinate systems displaying the same location
 * (New York City) to illustrate how different formats represent the same point.
 *
 * This story helps users understand:
 * - The visual differences between formats
 * - Segment count and structure variations
 * - How the same coordinate looks in each system
 */
export const AllFormats: Story = {
  render: () => {
    const newYorkCity = { lat: 40.7128, lon: -74.006 };

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          width: '600px',
        }}
      >
        <CoordinateField
          label='Decimal Degrees (DD)'
          description='Format: lat, lon - Example: 40.7128, -74.0060'
          format='dd'
          defaultValue={newYorkCity}
        />
        <CoordinateField
          label='Degrees Decimal Minutes (DDM)'
          description="Format: deg° min' dir - Example: 40° 42.768' N, 74° 0.360' W"
          format='ddm'
          defaultValue={newYorkCity}
        />
        <CoordinateField
          label='Degrees Minutes Seconds (DMS)'
          description={`Format: deg° min' sec" dir - Example: 40° 42' 46.08" N`}
          format='dms'
          defaultValue={newYorkCity}
        />
        <CoordinateField
          label='Military Grid Reference System (MGRS)'
          description='Format: zone band grid easting northing - Example: 18T WL 80654 06346'
          format='mgrs'
          defaultValue={newYorkCity}
        />
        <CoordinateField
          label='Universal Transverse Mercator (UTM)'
          description='Format: zone hemisphere easting northing - Example: 18N 585628 4511644'
          format='utm'
          defaultValue={newYorkCity}
        />
      </div>
    );
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Compare all coordinate formats side-by-side. All fields show New York City coordinates (40.7128, -74.006) in their respective formats.',
      },
    },
  },
};

/**
 * Accessibility Demo - Keyboard navigation and screen reader support
 *
 * Demonstrates the comprehensive keyboard accessibility features:
 * - Tab / Shift+Tab: Navigate between segments
 * - Arrow Left/Right: Move between segments at boundaries
 * - Home: Jump to first segment
 * - End: Jump to last segment
 * - Backspace: Delete character or jump to previous segment when empty
 * - Auto-advance: Automatically move to next segment when current is full
 *
 * The component includes proper ARIA labels, descriptions, and error announcements
 * for screen reader users.
 */
export const AccessibilityDemo: Story = {
  render: () => {
    return (
      <div className='flex max-w-2xl flex-col gap-m'>
        <CoordinateField
          label='Try Keyboard Navigation'
          description='Use the keyboard shortcuts above to navigate between segments'
          format='dd'
          size='medium'
        />
        <div className='rounded border border-outline-neutral bg-surface-primary p-m'>
          <h3 className='fg-primary mt-0 mb-m font-semibold text-heading-s'>
            Keyboard Navigation
          </h3>
          <div className='flex flex-col gap-xs text-body-s'>
            <div>Tab: to next segment</div>
            <div>Shift+Tab: to previous segment</div>
            <div>
              Arrow Left/Right: Move between segments at field boundaries
            </div>
            <div>Home: Jump to first segment</div>
            <div>End: Jump to last segment</div>
            <div>
              Backspace: Delete character or jump to previous segment when empty
            </div>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The CoordinateField is fully keyboard accessible with intuitive navigation between segments. ARIA labels and descriptions ensure screen reader compatibility.',
      },
    },
  },
};

/**
 * Form Integration - Complete form example
 *
 * Demonstrates integration with a standard HTML form, including:
 * - Form submission handling
 * - Validation on submit
 * - Combining with other form fields
 * - Required field validation
 */
export const FormIntegration: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      locationName: '',
      coordinates: null as CoordinateValue | null,
      notes: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleCoordinateChange = (value: CoordinateValue | null) => {
      setFormData((prev) => ({ ...prev, coordinates: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitted(true);
    };

    return (
      <div style={{ maxWidth: '500px' }}>
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div>
            <Label
              htmlFor='location-name'
              style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}
            >
              Location Name
            </Label>
            <input
              id='location-name'
              type='text'
              value={formData.locationName}
              onChange={(e) =>
                setFormData({ ...formData, locationName: e.target.value })
              }
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
              required
            />
          </div>

          <CoordinateField
            label='Location Coordinates'
            description='Enter the coordinates for this location'
            format='dd'
            isRequired
            onChange={handleCoordinateChange}
          />

          <div>
            <Label
              htmlFor='notes'
              style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}
            >
              Notes (Optional)
            </Label>
            <textarea
              id='notes'
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                minHeight: '80px',
              }}
            />
          </div>

          <Button type='submit'>Submit Form</Button>
        </form>

        {submitted && (
          <div
            style={{
              marginTop: '24px',
              padding: '16px',
              background: '#e8f5e9',
              border: '1px solid #4caf50',
              borderRadius: '4px',
            }}
          >
            <strong>Form Submitted!</strong>
            <pre style={{ marginTop: '8px', fontSize: '13px' }}>
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Example of CoordinateField integrated in a form with other inputs. Values are in DD format for easy storage and processing.',
      },
    },
  },
};

/**
 * Real World Locations - Pre-filled examples
 *
 * Demonstrates the field with real-world coordinates from famous locations.
 * Useful for testing and showing how different locations look in different formats.
 */
export const RealWorldLocations: Story = {
  render: () => {
    const locations = {
      nyc: { lat: 40.7128, lon: -74.006 },
      london: { lat: 51.5074, lon: -0.1278 },
      tokyo: { lat: 35.6762, lon: 139.6503 },
      sydney: { lat: -33.8688, lon: 151.2093 },
      paris: { lat: 48.8566, lon: 2.3522 },
    };

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          maxWidth: '500px',
        }}
      >
        <CoordinateField
          label='New York City, USA'
          description='Times Square area'
          format='dd'
          defaultValue={locations.nyc}
        />
        <CoordinateField
          label='London, United Kingdom'
          description='Near Westminster'
          format='ddm'
          defaultValue={locations.london}
        />
        <CoordinateField
          label='Tokyo, Japan'
          description='Shibuya district'
          format='dms'
          defaultValue={locations.tokyo}
        />
        <CoordinateField
          label='Sydney, Australia'
          description='Opera House area'
          format='utm'
          defaultValue={locations.sydney}
        />
        <CoordinateField
          label='Paris, France'
          description='Eiffel Tower vicinity'
          format='mgrs'
          defaultValue={locations.paris}
        />
      </div>
    );
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Real-world coordinates from major cities, each shown in a different format. Notice how southern hemisphere coordinates (Sydney) use negative latitude.',
      },
    },
  },
};
