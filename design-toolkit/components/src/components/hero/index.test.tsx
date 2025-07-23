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
import { Icon } from '../icon';
import { Hero } from './index';

// Mock icon component for testing
const MockIcon = () => <svg data-testid='mock-icon' />;

describe('Hero', () => {
  it('renders basic hero with all components', () => {
    render(
      <Hero>
        <Icon>
          <MockIcon />
        </Icon>
        <Hero.Title>Primary Title</Hero.Title>
        <Hero.Subtitle>Secondary text</Hero.Subtitle>
      </Hero>,
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Primary Title',
    );
    expect(screen.getByText('Secondary text')).toBeInTheDocument();
  });

  it('applies stack layout by default', () => {
    render(
      <Hero>
        <Icon>
          <MockIcon />
        </Icon>
        <Hero.Title>Title</Hero.Title>
      </Hero>,
    );

    const header = screen.getByRole('banner');
    expect(header).toHaveAttribute('data-layout', 'stack');
  });

  it('applies grid layout when compact is true', () => {
    render(
      <Hero compact>
        <Icon>
          <MockIcon />
        </Icon>
        <Hero.Title>Title</Hero.Title>
      </Hero>,
    );

    const header = screen.getByRole('banner');
    expect(header).toHaveAttribute('data-layout', 'grid');
  });

  it('only allows one heading', () => {
    // Should throw an error when multiple headings are provided
    expect(() => {
      render(
        <Hero>
          <Icon>
            <MockIcon />
          </Icon>
          <Hero.Title>First Heading</Hero.Title>
          <Hero.Title>Second Heading</Hero.Title>
          <Hero.Subtitle>Description</Hero.Subtitle>
        </Hero>,
      );
    }).toThrow();
  });

  it('handles multiple text components', () => {
    render(
      <Hero>
        <Icon>
          <MockIcon />
        </Icon>
        <Hero.Title>Title</Hero.Title>
        <Hero.Subtitle>First text</Hero.Subtitle>
        <Hero.Subtitle>Second text</Hero.Subtitle>
        <Hero.Subtitle>Third text</Hero.Subtitle>
      </Hero>,
    );

    expect(screen.getByText('First text')).toBeInTheDocument();
    expect(screen.getByText('Second text')).toBeInTheDocument();
    expect(screen.getByText('Third text')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <Hero classNames={{ hero: 'custom-class' }} data-testid='hero-header'>
        <Icon>
          <MockIcon />
        </Icon>
        <Hero.Title>Title</Hero.Title>
      </Hero>,
    );

    const header = screen.getByTestId('hero-header');
    expect(header).toHaveClass('custom-class');
  });

  it('passes through additional props to header element', () => {
    render(
      <Hero data-testid='hero-header' aria-label='Custom hero'>
        <Icon>
          <MockIcon />
        </Icon>
        <Hero.Title>Title</Hero.Title>
      </Hero>,
    );

    const header = screen.getByTestId('hero-header');
    expect(header).toHaveAttribute('aria-label', 'Custom hero');
  });

  it('only allows one icon', () => {
    // Note: This test verifies behavior but in development mode would show invalid components
    expect(() => {
      render(
        <Hero>
          <Icon>
            <MockIcon />
          </Icon>
          <Icon>
            <svg data-testid='second-icon' />
          </Icon>
          <Hero.Title>Title</Hero.Title>
        </Hero>,
      );
    }).toThrow();
  });
});
