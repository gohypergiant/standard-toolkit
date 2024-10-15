import type { Story, StoryDefault } from '@ladle/react';
import { TooltipTrigger } from 'react-aria-components';
import { Button } from '../button';
import { Tooltip } from './tooltip';
import type { TooltipProps } from './types';

export default {
  title: 'Components / Tooltip',
  argTypes: {
    children: {
      control: {
        type: 'text',
      },
      defaultValue: 'Hello World',
    },
    containerPadding: {
      control: {
        type: 'number',
      },
    },
    crossOffset: {
      control: {
        type: 'number',
      },
    },
    offset: {
      control: {
        type: 'number',
      },
    },
    placement: {
      control: {
        type: 'select',
      },
      options: ['top', 'right', 'bottom', 'left'],
      defaultValue: 'top',
    },
    shouldFlip: {
      control: {
        type: 'boolean',
      },
      defaulValue: true,
    },
  },
} satisfies StoryDefault<TooltipProps>;

export const Example: Story<TooltipProps> = (props) => (
  <TooltipTrigger>
    <Button>Hover me</Button>
    <Tooltip {...props} />
  </TooltipTrigger>
);
