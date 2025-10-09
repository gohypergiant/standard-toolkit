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
import { describe, expect, it } from 'vitest';
import { Button } from '../../button';
import { Dialog } from '..';

describe('Dialog', () => {
  it('renders dialog with all required compound components', () => {
    render(
      <Dialog.Trigger>
        <Button>Open Dialog</Button>
        <Dialog>
          <Dialog.Title>Test Title</Dialog.Title>
          <Dialog.Content>Test Content</Dialog.Content>
          <Dialog.Footer>
            <Button>Close</Button>
          </Dialog.Footer>
        </Dialog>
      </Dialog.Trigger>,
    );

    expect(screen.getByText('Open Dialog')).toBeInTheDocument();
  });
});
