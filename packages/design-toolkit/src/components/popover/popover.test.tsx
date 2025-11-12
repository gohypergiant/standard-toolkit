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
import { describe, expect, it } from 'vitest';
import { Button } from '../button';
import { Icon } from '../icon';
import { Popover } from './';
import { PopoverBody } from './body';
import { PopoverContent } from './content';
import { PopoverFooter } from './footer';
import { PopoverTitle } from './title';
import { PopoverTrigger } from './trigger';
import type { PopoverProps } from './types';

function setup({ children = 'Foo', ...rest }: Partial<PopoverProps> = {}) {
  render(
    <Popover>
      <PopoverTrigger>
        <Button>
          <Icon>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 28 28'>
              <title>Test</title>
              <path
                d='M9.00011 6.50098C9.00011 6.50098 9 5.00098 10.5 5.00098H17.5C19.0001 5.00098 19.0001 6.50098 19.0001 6.50098V9.00098H21.0001C21.2388 9.00098 21.0001 9.00098 22.0001 9.00098V10.501H21.0001L20 21.501C19.9325 22.5091 19.5 23.001 18.5 23.001H10C8.5 23.001 8.17675 22.462 8.00011 21.001L7 10.501H6L6.00011 9.00098C7.00011 9.00098 6.76141 9.00098 7.00011 9.00098H9.00011V6.50098ZM10.5 9.00098H17.5V6.50098H10.5V9.00098ZM8.5 10.501L9.5 21.501H18.5L19.5 10.501H8.5ZM12.9999 13.001V19.001H11.4999V13.001H12.9999Z'
                fill='#28F5BE'
              />
              <path
                d='M16.5001 19.001L16.5002 13.001H15.0001L15 19.001H16.5001Z'
                fill='#28F5BE'
              />
            </svg>
          </Icon>
        </Button>
      </PopoverTrigger>
      {children}
    </Popover>,
  );

  return {
    ...rest,
    children,
  };
}

describe('Popover', () => {
  it('should render', async () => {
    const user = userEvent.setup();
    const title = 'Hello';
    const body = 'World';
    const footer = 'Foobar';

    setup({
      children: (
        <PopoverContent>
          <PopoverTitle>{title}</PopoverTitle>
          <PopoverBody>{body}</PopoverBody>
          <PopoverFooter>{footer}</PopoverFooter>
        </PopoverContent>
      ),
    });

    await user.click(screen.getByRole('button'));

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(body)).toBeInTheDocument();
    expect(screen.getByText(footer)).toBeInTheDocument();
  });
});
