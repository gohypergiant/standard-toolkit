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

import { Placeholder } from '@accelint/icons';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Icon } from '../icon';
import { Hero } from './';
import type { HeroProps } from './types';

const defaults = {
  title: 'Primary Title',
  subtitle: 'Secondary text',
};

function setup({
  children = (
    <>
      <Icon>
        <Placeholder data-testid='icon' />
      </Icon>
      <Hero.Title>{defaults.title}</Hero.Title>
      <Hero.Subtitle>{defaults.subtitle}</Hero.Subtitle>
    </>
  ),
  ...rest
}: Partial<HeroProps> = {}) {
  return {
    ...render(<Hero {...rest}>{children}</Hero>),
    ...rest,
    children,
  };
}

describe('Hero', () => {
  it('renders basic hero with all components', () => {
    setup();

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByRole('heading')).toHaveTextContent(defaults.title);
    expect(screen.getByText(defaults.subtitle)).toBeInTheDocument();
  });

  it('applies stack layout by default', () => {
    setup();

    expect(screen.getByRole('banner')).toHaveAttribute('data-layout', 'stack');
  });

  it('applies grid layout when compact is true', () => {
    setup({ compact: true });

    expect(screen.getByRole('banner')).toHaveAttribute('data-layout', 'grid');
  });
});
