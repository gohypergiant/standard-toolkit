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
import { ClassificationBanner } from './';
import type { ClassificationBannerProps } from './types';

function setup({
  children = 'Unclassified',
  ...rest
}: Partial<ClassificationBannerProps> = {}) {
  render(<ClassificationBanner {...rest}>{children}</ClassificationBanner>);

  return {
    ...rest,
    children,
  };
}

describe('Classification Banner', () => {
  it('should render', () => {
    const { children } = setup();
    const component = screen.getByText(`${children}`);

    expect(component).toBeInTheDocument();
  });
});
