import { type Story, type StoryDefault, action } from '@ladle/react';
import { actions } from '../../ladle';
import { AriaGroup } from '../aria';
import { Button } from '../button';
import { Icon } from '../icon';
import { Input } from '../input';
import { SearchField } from './search-field';
import type { SearchFieldProps } from './types';

export default {
  title: 'Components/SearchField',
  argTypes: {
    variant: {
      control: {
        type: 'select',
      },
      options: ['solid', 'hollow'],
      defaultValue: 'solid',
    },
    size: {
      control: {
        type: 'select',
      },
      options: ['sm', 'lg'],
      defaultValue: 'lg',
    },
  },
} satisfies StoryDefault;

export const ControlledExample: Story<SearchFieldProps> = (props) => (
  <SearchField
    aria-label='SearchField'
    {...props}
    {...actions<SearchFieldProps>(
      'onBlur',
      'onFocus',
      'onFocusChange',
      'onChange',
      'onClear',
      'onSubmit',
    )}
  >
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
      <Button onPress={action('onClear')}>
        <Icon>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
            <path d='M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2m5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12z' />
          </svg>
        </Icon>
      </Button>
    </AriaGroup>
  </SearchField>
);

ControlledExample.storyName = 'Controlled';

ControlledExample.argTypes = {
  value: {
    control: {
      type: 'text',
    },
    defaultValue: '',
  },
};

export const UncontrolledExample: Story<SearchFieldProps> = (props) => (
  <SearchField
    aria-label='SearchField'
    {...props}
    defaultValue=''
    {...actions<SearchFieldProps>('onChange', 'onSubmit', 'onClear')}
  >
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
  </SearchField>
);

UncontrolledExample.storyName = 'Uncontrolled';
