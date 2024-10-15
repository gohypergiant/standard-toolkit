import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AriaText } from '../aria';
import { Checkbox, CheckboxGroup } from './checkbox';
import type { CheckboxProps } from './types';

function setup({ children = 'Foo', ...rest }: Partial<CheckboxProps> = {}) {
  render(<Checkbox {...rest}>{children}</Checkbox>);

  return {
    ...rest,
    children,
  };
}

describe('Checkbox', () => {
  it('should render', () => {
    const { children } = setup();

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByText(`${children}`)).toBeInTheDocument();
  });
});

describe('Checkbox Group', () => {
  it('should render', () => {
    const checkboxes = ['Foo', 'Bar', 'Baz'];

    render(
      <CheckboxGroup>
        {checkboxes.map((value) => (
          <Checkbox key={value} value={value}>
            <AriaText>{value}</AriaText>
          </Checkbox>
        ))}
      </CheckboxGroup>,
    );

    expect(screen.getByRole('group')).toBeInTheDocument();
  });
});
