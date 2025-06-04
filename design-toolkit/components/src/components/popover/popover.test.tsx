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

import { Information } from '@accelint/icons';
import { render, screen } from '@testing-library/react';
import { DialogTrigger } from 'react-aria-components';
import { describe, expect, it } from 'vitest';
import { IconButton } from '../icon-button';
import { Popover, type PopoverProps } from './';

function setup({
  children = 'Popover content',
  showArrow = true,
  ...rest
}: Partial<PopoverProps> = {}) {
  render(
    <DialogTrigger>
      <IconButton aria-label='Help'>
        <Information className='w-4 h-4' />
      </IconButton>
      <Popover showArrow={showArrow} {...rest}>
        {children}
      </Popover>
    </DialogTrigger>,
  );

  return {
    children,
    showArrow,
    ...rest,
  };
}

describe('Popover', () => {
  it('should render with default props', () => {
    setup();

    expect(screen.getByText('Popover content')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Help');
  });

  it('should render without arrow', () => {
    setup({ showArrow: false });

    expect(screen.getByText('Popover content')).toBeInTheDocument();
    expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
  });
});
