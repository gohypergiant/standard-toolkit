import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AriaGroup } from '../aria';
import { Button } from '../button';
import { Icon } from '../icon';
import { Input } from '../input';
import { SearchField } from './search-field';
import type { SearchFieldProps } from './types';

function setup(props: Partial<SearchFieldProps> = {}) {
  render(
    <SearchField {...props}>
      <AriaGroup>
        <Icon>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path stroke='none' d='M0 0h24v24H0z' fill='none' />
            <path d='M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0' />
            <path d='M21 21l-6 -6' />
          </svg>
        </Icon>
        <Input placeholder='Search' />
        <Button>
          <Icon>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
              <path d='M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2m5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12z' />
            </svg>
          </Icon>
        </Button>
      </AriaGroup>
    </SearchField>,
  );

  return props;
}

describe('SearchField', () => {
  it('should render', () => {
    setup();

    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    expect(screen.getByLabelText('Clear search')).toBeInTheDocument(); // button's aria label
  });
});
