import type { Story, StoryDefault } from '@ladle/react';
import { actions } from '../../ladle';
import { AriaText } from '../aria';
import { Button } from '../button';
import { Icon } from '../icon';
import { Chip, ChipGroup, ChipItem, ChipList } from './chip';
import type { ChipGroupProps, ChipProps } from './types';

export default {
  title: 'Components',
  argTypes: {
    size: {
      control: {
        type: 'select',
      },
      options: ['sm', 'lg'],
      defaultValue: 'sm',
    },
  },
} satisfies StoryDefault;

export const ChipExample: Story<ChipProps> = ({ children, ...rest }) => (
  <Chip {...rest}>
    <AriaText>{children}</AriaText>
  </Chip>
);

ChipExample.storyName = 'Chip / Static';

ChipExample.argTypes = {
  children: {
    control: {
      type: 'text',
    },
    defaultValue: 'Hello',
  },
  color: {
    control: {
      type: 'select',
    },
    options: [
      'primary',
      'secondary',
      'tertiary',
      'info',
      'advisory',
      'affirmative',
      'serious',
      'critical',
    ],
    defaultValue: 'info',
  },
};

export const GroupExample: Story<ChipGroupProps> = (props) => (
  <ChipGroup
    {...props}
    aria-label='Interactive Example'
    {...actions<ChipGroupProps>('onRemove', 'onSelectionChange')}
  >
    <ChipList>
      <ChipItem textValue='red'>
        <AriaText>Red</AriaText>
        <Button>
          <Icon>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
              <path d='M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2m5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12z' />
            </svg>
          </Icon>
        </Button>
      </ChipItem>
      <ChipItem textValue='blue'>
        <AriaText>Blue</AriaText>
        <Button>
          <Icon>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
              <path d='M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2m5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12z' />
            </svg>
          </Icon>
        </Button>
      </ChipItem>
      <ChipItem textValue='green'>
        <AriaText>Green</AriaText>
        <Button>
          <Icon>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
              <path d='M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2m5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12z' />
            </svg>
          </Icon>
        </Button>
      </ChipItem>
    </ChipList>
  </ChipGroup>
);

GroupExample.storyName = 'Chip / Interactive';

GroupExample.argTypes = {
  color: {
    control: {
      type: 'select',
    },
    options: [
      'primary',
      'secondary',
      'tertiary',
      'info',
      'advisory',
      'affirmative',
      'serious',
      'critical',
    ],
    defaultValue: 'primary',
  },
  selectionBehavior: {
    control: {
      type: 'select',
    },
    options: ['replace', 'toggle'],
    defaultValue: 'toggle',
  },
  selectionMode: {
    control: {
      type: 'select',
    },
    options: ['none', 'single', 'multiple'],
    defaultValue: 'single',
  },
};
