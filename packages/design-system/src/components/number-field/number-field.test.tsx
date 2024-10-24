import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AriaFieldError, AriaLabel, AriaText } from '../aria';
import { Button } from '../button';
import { Input } from '../input';
import { NumberField } from './number-field';
import type { NumberFieldProps } from './types';

function setup(props: Partial<NumberFieldProps> = {}) {
  render(
    <NumberField {...props}>
      <AriaLabel>Name</AriaLabel>
      <Button slot='decrement'>-</Button>
      <Input placeholder='Enter a number' />
      <Button slot='increment'>+</Button>
      <AriaText slot='description'>Hint</AriaText>
      <AriaFieldError>Error Message</AriaFieldError>
    </NumberField>,
  );

  return props;
}

describe('NumberField', () => {
  it('should render', () => {
    setup({ 'aria-label': 'number field' });

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('+')).toBeInTheDocument();
    expect(screen.getByText('-')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter a number')).toBeInTheDocument();
  });
});
