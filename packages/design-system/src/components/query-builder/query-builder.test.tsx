import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { fields } from './dataset-sample';
import { QueryBuilder } from './query-builder';
import type { QueryBuilderProps } from './types';

function setup(props: Partial<QueryBuilderProps> = {}) {
  render(<QueryBuilder {...props} />);

  return props;
}

describe('QueryBuilder', () => {
  it('should render empty without rules', () => {
    setup();

    expect(screen.getByRole('form')).toBeInTheDocument();
  });

  it('should render with rules', () => {
    const props = {
      query: {
        combinator: 'and',
        rules: [
          { field: 'AK_HIGH', operator: '>', value: '10000' }, // i32
          { field: 'AK_LOW', operator: 'between', value: '1000,5000' }, // between
          { field: 'PRIVATEUSE', operator: 'in', value: ['Mixed', 'Private'] }, // options
          { field: 'SERVCITY', operator: 'like', value: 'Anchorage' }, // options with headers
          { field: 'OPERSTATUS', operator: '=', value: true }, // bool
          { field: 'DONUTS', operator: '=', value: true }, // switch
          { field: 'TYPE_CODE', operator: '=', value: 'Aerodrome' }, // radio
          { field: 'NOTES', operator: 'contains', value: 'Clear skies...' }, // textarea
          { field: 'NICKNAME', operator: 'like', value: 'Old Bumpy' }, // text
        ],
      },
      fields,
    };

    setup(props);
    expect(screen.getByRole('form')).toBeInTheDocument();
  });
});
