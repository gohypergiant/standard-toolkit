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
import { Tooltip } from './';
import type { TooltipTriggerComponentProps } from 'react-aria-components';

function setup({
  children = 'Foo',
  isOpen = true,
  ...rest
}: Partial<TooltipTriggerComponentProps> = {}) {
  render(
    <Tooltip.Trigger isOpen={isOpen}>
      {/* biome-ignore lint/a11y/useSemanticElements: react-aria expects a role, biome doesn't like it */}
      <span className='fg-primary-bold' role='button' tabIndex={0}>
        {children}
      </span>
      <Tooltip>My tooltip</Tooltip>
    </Tooltip.Trigger>,
  );

  return {
    ...rest,
    children,
    isOpen,
  };
}

describe('Tooltip', () => {
  it('should render', () => {
    const { children } = setup();

    expect(screen.getByText(`${children}`)).toBeInTheDocument();
  });
});
