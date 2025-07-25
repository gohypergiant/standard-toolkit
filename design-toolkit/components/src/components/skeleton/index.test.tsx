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

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Skeleton } from '.';

const baseClasses = (element: HTMLElement) => {
  expect(element).toHaveClass('fg-default-light');
  expect(element).toHaveClass('bg-transparent-light');
  expect(element).toHaveClass('px-l');
  expect(element).toHaveClass('py-s');
  expect(element).toHaveClass('motion-safe:animate-pulse');
};

const circClasses = (element: HTMLElement) => {
  expect(element).toHaveClass('aspect-square');
  expect(element).toHaveClass('h-[1lh]');
  expect(element).toHaveClass('rounded-full');
};

const rectClasses = (element: HTMLElement) => {
  expect(element).toHaveClass('min-h-[1lh]');
  expect(element).toHaveClass('w-full');
  expect(element).toHaveClass('rounded-small');
};

describe('Skeleton', () => {
  it('should render with default classes', () => {
    const { container } = render(<Skeleton />);
    const element = container.firstChild as HTMLElement;

    baseClasses(element);
    rectClasses(element);
  });

  it('should render with children', () => {
    const { container } = render(<Skeleton>Loading content...</Skeleton>);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render with circle shape', () => {
    const { container } = render(<Skeleton shape='circ' />);
    const element = container.firstChild as HTMLElement;

    baseClasses(element);
    circClasses(element);
  });

  it('should render with more than one and nested', () => {
    const { container } = render(
      <div>
        <Skeleton className='mb-xl p-m'>
          <br />
          <br />
          <Skeleton className='w-[75%]' />
        </Skeleton>

        <Skeleton className='mt-l w-[50%]' />
        <Skeleton className='mt-l w-[50%]' />
        <Skeleton className='mt-l w-[50%]' />
        <Skeleton className='mt-l w-[50%]' />
      </div>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render with custom className', () => {
    const { container } = render(<Skeleton className='custom-class' />);
    const element = container.firstChild as HTMLElement;

    expect(element).toHaveClass('custom-class');
    baseClasses(element);
    rectClasses(element);
  });
});
