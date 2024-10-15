import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Picker, PickerItem } from './picker';
import type { PickerProps } from './types';

function setup({
  'aria-label': ariaLabel = 'Test',
  ...rest
}: Partial<PickerProps<object>> = {}) {
  render(<Picker {...rest} aria-label={ariaLabel} />);

  return {
    ...rest,
    'aria-label': ariaLabel,
  };
}

describe('Picker', () => {
  it('should render empty state', () => {
    const empty = 'No options';

    setup({
      renderEmptyState: () => empty,
    });

    expect(screen.getByText(empty)).toBeInTheDocument();
  });

  it('should render options', () => {
    const option = 'Hello';

    setup({
      children: <PickerItem>{option}</PickerItem>,
    });

    expect(screen.getByText(option)).toBeInTheDocument();
  });
});
