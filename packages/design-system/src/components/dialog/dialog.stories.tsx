import { action, type Story, type StoryDefault } from '@ladle/react';
import { useRef } from 'react';
import { DialogTrigger } from 'react-aria-components';
import { genericColorVars, radiusVars, sizeVars } from '../../styles';
import { AriaHeading } from '../aria';
import { Button } from '../button';
import { Element } from '../element';
import { Group } from '../group';
import { Dialog } from './dialog';
import type { DialogProps } from './types';

export default {
  title: 'Components / Dialog',
  argTypes: {
    size: {
      control: {
        type: 'select',
      },
      options: ['sm', 'lg'],
      defaultValue: 'lg',
    },
    isDismissable: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    isKeyboardDismissDisabled: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    isGlobal: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
      description: 'Not a component prop, see story for implementation details',
    },
  },
} satisfies StoryDefault;

export const Example: Story<
  DialogProps & {
    isGlobal: boolean;
  }
> = ({ isDismissable, isKeyboardDismissDisabled, isGlobal, ...rest }) => {
  const ref = useRef(null);

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: 600,
        height: 800,
        padding: sizeVars.v05,
        border: `1px solid ${genericColorVars.neutral.v08}`,
        borderRadius: radiusVars.lg,
      }}
    >
      <DialogTrigger onOpenChange={action('onOpenChange')}>
        <Button>Press me</Button>
        <Dialog {...rest} parentRef={isGlobal ? undefined : ref}>
          {({ state }) => (
            <>
              <Element slot='header'>
                <AriaHeading>Dialog title</AriaHeading>
              </Element>
              <Element slot='content'>
                <p>Lorum Ipsum text for the dialog shall go here.</p>
              </Element>
              <Element slot='footer'>
                <Group>
                  <Button onPress={state.close}>Action 1</Button>
                  <Button slot='secondary' onPress={state.close}>
                    Action 2
                  </Button>
                </Group>
              </Element>
            </>
          )}
        </Dialog>
      </DialogTrigger>
    </div>
  );
};
