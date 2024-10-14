import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AriaLabel } from '../aria';
import { Radio, RadioGroup } from './radio';

describe('Radio Group', () => {
  it('should render', () => {
    const radios = ['Foo', 'Bar', 'Baz'];

    render(
      <RadioGroup>
        <AriaLabel>Radio Group Label</AriaLabel>
        {radios.map((value) => (
          <Radio key={value} value={value}>
            {value}
          </Radio>
        ))}
      </RadioGroup>,
    );

    const element = screen.getByRole('radiogroup');

    expect(element).toBeInTheDocument();
  });
});
