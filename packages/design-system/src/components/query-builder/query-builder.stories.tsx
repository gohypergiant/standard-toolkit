import type { Story, StoryDefault } from '@ladle/react';
import type { PressEvent } from '@react-types/shared';
import { useContext, useEffect, useMemo, useState } from 'react';
import type { RuleGroupType } from 'react-querybuilder';
import { Button } from '../button';
import type { CheckboxRenderProps } from '../checkbox';
import { Icon } from '../icon';
import type { SelectRenderProps } from '../select';
import { QueryBuilderContext } from './constants';
import { fields } from './dataset-sample';
import { QueryBuilder } from './query-builder';
import type { ActionProps, QueryBuilderProps } from './types';
import { pressToMouseEvent } from './utils';

export default {
  title: 'Components / Query Builder',
  argTypes: {
    consistentColumns: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
    },
    size: {
      control: {
        type: 'select',
      },
      options: ['sm', 'lg'],
      defaultValue: 'sm',
    },
    layout: {
      control: {
        type: 'select',
      },
      options: ['row', 'column'],
      defaultValue: 'row',
    },
  },
} satisfies StoryDefault<QueryBuilderProps>;

function RemoveRuleAction(props: ActionProps) {
  const { mapping, size } = useContext(QueryBuilderContext);

  const handlePress = (e: PressEvent) => {
    props.handleOnClick(pressToMouseEvent(e));
  };

  return (
    <Button {...mapping?.button?.[size]} variant='icon' onPress={handlePress}>
      <Icon>
        <svg viewBox='0 0 24 24'>
          <g>
            <path d='M7 4.5S7 3 8.5 3h7C17 3 17 4.5 17 4.5V7h3v1.5h-1l-1 11c-.067 1.008-.5 1.5-1.5 1.5H8c-1.5 0-1.823-.539-2-2L5 8.5H4V7h3V4.5ZM8.5 7h7V4.5h-7V7Zm-2 1.5 1 11h9l1-11h-11ZM11 11v6H9.5v-6H11Z' />
            <path d='M14.5 17v-6H13v6h1.5Z' />
          </g>
        </svg>
      </Icon>
    </Button>
  );
}

const icons = {
  checkbox: ({ isSelected }: CheckboxRenderProps) =>
    isSelected ? (
      <Icon fill='none' stroke='currentcolor'>
        <svg viewBox='0 0 18 18' aria-hidden='true' strokeWidth={3}>
          <polyline points='1 9 7 14 15 4' />
        </svg>
      </Icon>
    ) : null,
  select: ({ isOpen }: SelectRenderProps) => (
    <Icon>
      {isOpen ? (
        <svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
          <path d='M17.6577 15.6996L12.0008 10.0427L6.34391 15.6996L4.92969 14.2855L10.5867 8.62855C10.5867 8.62855 12.0009 7.21436 13.415 8.62847C14.8291 10.0426 19.0718 14.2854 19.0718 14.2854L17.6577 15.6996Z' />
        </svg>
      ) : (
        <svg viewBox='0 0 24 25' xmlns='http://www.w3.org/2000/svg'>
          <path d='M6.41417 8.94775L12.0711 14.6046L17.7279 8.94775L19.1421 10.3618L13.4852 16.0188C13.4852 16.0188 12.071 17.433 10.6569 16.0189C9.24274 14.6047 5 10.362 5 10.362L6.41417 8.94775Z' />
        </svg>
      )}
    </Icon>
  ),
};

export const Example: Story<QueryBuilderProps> = (props) => {
  const [query, setQuery] = useState<RuleGroupType>({
    combinator: 'and',
    rules: [
      { field: 'AK_HIGH', operator: '>', value: '10000' }, // i32
      { field: 'AK_LOW', operator: 'between', value: ['1000', '5000'] }, // between
      { field: 'PRIVATEUSE', operator: 'in', value: ['Mixed', 'Private'] }, // options
      { field: 'SERVCITY', operator: 'like', value: 'Anchorage' }, // options with headers
      { field: 'OPERSTATUS', operator: '=', value: true }, // bool
      { field: 'DONUTS', operator: '=', value: true }, // switch
      { field: 'TYPE_CODE', operator: '=', value: 'Aerodrome' }, // radio
      { field: 'NOTES', operator: 'contains', value: 'Clear skies...' }, // textarea
      { field: 'NICKNAME', operator: 'like', value: 'Old Bumpy' }, // text
      {
        field: 'ESTABLISHED',
        operator: 'during',
        value: ['2024-10-01', '2024-11-01'],
      }, // date
      {
        field: 'MAINTENANCE',
        operator: 'overlapped',
        value: ['2024-10-01T18:22:54', '2024-11-01T18:22:54'],
      }, // datetime
      {
        field: 'PEAK_TRAFFIC',
        operator: 'overlaps',
        value: ['18:22:54', '19:22:54'],
      }, // time
    ],
  });

  const controlElements = useMemo(
    () => ({
      removeRuleAction: RemoveRuleAction,
      addGroupAction: () => null, // locks out ability to add groups
    }),
    [],
  );

  const mapping = {
    button: {
      sm: { size: 'sm' as const, variant: 'hollow' as const },
      lg: { size: 'md' as const, variant: 'hollow' as const },
    },
  };

  useEffect(() => {
    console.log({ query });
  }, [query]);

  return (
    <QueryBuilder
      {...props}
      controlElements={controlElements}
      fields={fields}
      icons={icons}
      mapping={mapping}
      query={query}
      onQueryChange={setQuery}
    />
  );
};
