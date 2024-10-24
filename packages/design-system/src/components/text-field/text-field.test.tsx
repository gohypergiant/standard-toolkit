import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AriaFieldError, AriaLabel, AriaText } from '../aria';
import { Input } from '../input';
import { TextField } from './text-field';
import type { TextFieldProps } from './types';

function setup(props: Partial<TextFieldProps> = {}) {
  render(
    <TextField {...props}>
      <AriaLabel>Name</AriaLabel>
      <Input placeholder='Placeholder text' />
      <AriaText slot='description'>Hint</AriaText>
      <AriaFieldError>Error Message</AriaFieldError>
    </TextField>,
  );

  return props;
}

describe('TextField', () => {
  it('should render', () => {
    setup({ 'aria-label': 'text field' });

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Placeholder text')).toBeInTheDocument();
  });
});
