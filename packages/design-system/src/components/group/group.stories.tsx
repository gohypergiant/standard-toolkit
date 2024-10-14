import type { Story, StoryDefault } from '@ladle/react';
import { Button, ButtonContext, type ButtonProps } from '../button';
import { Group } from './group';
import type { GroupProps } from './types';

export default {
  title: 'Components / Group',
  argTypes: {
    orientation: {
      control: {
        type: 'select',
      },
      options: ['horizontal', 'vertical'],
      defaultValue: 'horizontal',
    },
    reverse: {
      control: {
        type: 'boolean',
      },
    },
  },
} satisfies StoryDefault<GroupProps<ButtonProps, HTMLButtonElement>>;

export const Example: Story<GroupProps<ButtonProps, HTMLButtonElement>> = (
  props,
) => (
  <Group<ButtonProps, HTMLButtonElement>
    {...props}
    context={ButtonContext}
    values={{ size: 'sm', variant: 'bare' }}
  >
    <Button>Foo</Button>
    <Button>Bar</Button>
  </Group>
);
