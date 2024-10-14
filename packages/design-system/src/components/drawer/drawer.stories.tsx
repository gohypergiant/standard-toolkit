import type { Story, StoryDefault } from '@ladle/react';
import { useState } from 'react';
import { TooltipTrigger } from 'react-aria-components';
import { actions } from '../../ladle';
import { AriaHeading } from '../aria';
import { Button } from '../button';
import { Element } from '../element';
import { Icon } from '../icon';
import { TabPanel, TabPanels } from '../tabs';
import { Tooltip, TooltipTarget } from '../tooltip';
import { Drawer, DrawerDialog, DrawerTab, DrawerTabList } from './drawer';
import type { DrawerProps } from './types';

export default {
  title: 'Components/Drawer',
  argTypes: {
    anchor: {
      control: {
        type: 'select',
      },
      options: ['left', 'right'],
      defaultValue: 'right',
    },
    layoutShift: {
      control: {
        type: 'boolean',
      },
    },
    shouldCloseOnBlur: {
      control: {
        type: 'boolean',
      },
    },
    isDismissable: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
    },
    isKeyboardDismissDisabled: {
      control: {
        type: 'boolean',
      },
    },
  },
} satisfies StoryDefault<DrawerProps>;

export const SingleTabbedExample: Story<DrawerProps> = (props) => {
  const caretRight = (
    <Icon size='md'>
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
        <title>Ladle</title>
        <path stroke='none' d='M0 0h24v24H0z' fill='none' />
        <path d='M9 6c0 -.852 .986 -1.297 1.623 -.783l.084 .076l6 6a1 1 0 0 1 .083 1.32l-.083 .094l-6 6l-.094 .083l-.077 .054l-.096 .054l-.036 .017l-.067 .027l-.108 .032l-.053 .01l-.06 .01l-.057 .004l-.059 .002l-.059 -.002l-.058 -.005l-.06 -.009l-.052 -.01l-.108 -.032l-.067 -.027l-.132 -.07l-.09 -.065l-.081 -.073l-.083 -.094l-.054 -.077l-.054 -.096l-.017 -.036l-.027 -.067l-.032 -.108l-.01 -.053l-.01 -.06l-.004 -.057l-.002 -12.059z' />
      </svg>
    </Icon>
  );

  const caretLeft = (
    <Icon size='md'>
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
        <title>Ladle</title>
        <path stroke='none' d='M0 0h24v24H0z' fill='none' />
        <path d='M13.883 5.007l.058 -.005h.118l.058 .005l.06 .009l.052 .01l.108 .032l.067 .027l.132 .07l.09 .065l.081 .073l.083 .094l.054 .077l.054 .096l.017 .036l.027 .067l.032 .108l.01 .053l.01 .06l.004 .057l.002 .059v12c0 .852 -.986 1.297 -1.623 .783l-.084 -.076l-6 -6a1 1 0 0 1 -.083 -1.32l.083 -.094l6 -6l.094 -.083l.077 -.054l.096 -.054l.036 -.017l.067 -.027l.108 -.032l.053 -.01l.06 -.01z' />
      </svg>
    </Icon>
  );

  const openCarent = props.anchor === 'left' ? caretLeft : caretRight;
  const closeCaret = props.anchor === 'left' ? caretRight : caretLeft;

  return (
    <div style={{ height: '100%', display: 'flex' }}>
      {props.anchor === 'right' && (
        <div
          style={{
            padding: '24px',
            flex: 1,
            background: 'lightgray',
            color: 'black',
          }}
        >
          {content}
        </div>
      )}
      <Drawer
        {...props}
        {...actions<DrawerProps>('onOpenChange', 'onSelectionChange')}
      >
        <DrawerTabList>
          <DrawerTab id='a'>
            {({ isOpen }) => (isOpen ? openCarent : closeCaret)}
          </DrawerTab>
        </DrawerTabList>
        <DrawerDialog>
          <Element slot='header'>
            <AriaHeading slot='title'>Hello</AriaHeading>
            <Button slot='close'>
              <Icon fill='none' size='relative' stroke='currentcolor'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <title>Ladle</title>
                  <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                  <path d='M18 6l-12 12' />
                  <path d='M6 6l12 12' />
                </svg>
              </Icon>
            </Button>
          </Element>
          <Element slot='content'>
            <TabPanels>
              <TabPanel id='a'>
                <p>Some content</p>
              </TabPanel>
            </TabPanels>
          </Element>
          <Element slot='footer'>Footer</Element>
        </DrawerDialog>
      </Drawer>
      {props.anchor === 'left' && (
        <div
          style={{
            padding: '24px',
            flex: 1,
            background: 'lightgray',
            color: 'black',
          }}
        />
      )}
    </div>
  );
};

SingleTabbedExample.storyName = 'Single Tabbed';

export const MultiTabbedExample: Story<DrawerProps> = (props) => {
  const [isChildPane, setIsChildPane] = useState(false);

  /**
   * This story provides a very simplistic implementation of a
   * Parent/Child content example to highlight the "back" button
   * and how it affects the header style
   */

  return (
    <div style={{ height: '100%', display: 'flex' }}>
      {props.anchor === 'right' && (
        <div
          style={{
            padding: '24px',
            flex: 1,
            background: 'lightgray',
            color: 'black',
          }}
        >
          {content}
        </div>
      )}
      <Drawer
        {...props}
        {...actions<DrawerProps>('onOpenChange', 'onSelectionChange')}
      >
        <DrawerTabList>
          <DrawerTab id='a'>
            <TooltipTrigger>
              <TooltipTarget>
                <Icon size='md'>
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
                    <title>Ladle</title>
                    <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                    <path d='M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.051 6.844a1 1 0 0 0 -1.152 -.663l-.113 .03l-2.684 .895l-2.684 -.895l-.113 -.03a1 1 0 0 0 -.628 1.884l.109 .044l2.316 .771v.976l-1.832 2.75l-.06 .1a1 1 0 0 0 .237 1.21l.1 .076l.101 .06a1 1 0 0 0 1.21 -.237l.076 -.1l1.168 -1.752l1.168 1.752l.07 .093a1 1 0 0 0 1.653 -1.102l-.059 -.1l-1.832 -2.75v-.977l2.316 -.771l.109 -.044a1 1 0 0 0 .524 -1.221zm-3.949 -4.184a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0 -3z' />
                  </svg>
                </Icon>
              </TooltipTarget>
              <Tooltip>People</Tooltip>
            </TooltipTrigger>
          </DrawerTab>
          <DrawerTab id='b'>
            <TooltipTrigger>
              <TooltipTarget>
                <Icon size='md'>
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
                    <title>Ladle</title>
                    <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                    <path d='M16 6.072a8 8 0 1 1 -11.995 7.213l-.005 -.285l.005 -.285a8 8 0 0 1 11.995 -6.643zm-4 2.928a1 1 0 0 0 -1 1v3l.007 .117a1 1 0 0 0 .993 .883h2l.117 -.007a1 1 0 0 0 .883 -.993l-.007 -.117a1 1 0 0 0 -.993 -.883h-1v-2l-.007 -.117a1 1 0 0 0 -.993 -.883z' />
                    <path d='M6.412 3.191a1 1 0 0 1 1.273 1.539l-.097 .08l-2.75 2a1 1 0 0 1 -1.273 -1.54l.097 -.08l2.75 -2z' />
                    <path d='M16.191 3.412a1 1 0 0 1 1.291 -.288l.106 .067l2.75 2a1 1 0 0 1 -1.07 1.685l-.106 -.067l-2.75 -2a1 1 0 0 1 -.22 -1.397z' />
                  </svg>
                </Icon>
              </TooltipTarget>
              <Tooltip>Alarms</Tooltip>
            </TooltipTrigger>
          </DrawerTab>
          <DrawerTab id='c'>
            <TooltipTrigger>
              <TooltipTarget>
                <Icon size='md'>
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
                    <title>Ladle</title>
                    <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                    <path d='M13.666 1.429l6.75 3.98q .1 .06 .18 .133l.009 .008l.106 .075a3.22 3.22 0 0 1 1.284 2.39l.005 .203v7.284c0 1.175 -.643 2.256 -1.623 2.793l-6.804 4.302c-.98 .538 -2.166 .538 -3.2 -.032l-6.695 -4.237a3.23 3.23 0 0 1 -1.678 -2.826v-7.285a3.21 3.21 0 0 1 1.65 -2.808l6.775 -3.995a3.34 3.34 0 0 1 3.24 .015m-.64 5.343a2.03 2.03 0 0 0 -2 -.014l-3.023 1.804a1.99 1.99 0 0 0 -1.002 1.736v3.278a2 2 0 0 0 1.03 1.75l2.946 1.89c.657 .367 1.39 .367 1.994 .033l3.054 -1.955c.582 -.322 .976 -.992 .976 -1.719v-3.277l-.005 -.164a2 2 0 0 0 -.725 -1.391l-.092 -.07l-.056 -.047a1 1 0 0 0 -.096 -.064z' />
                  </svg>
                </Icon>
              </TooltipTarget>
              <Tooltip>Containers</Tooltip>
            </TooltipTrigger>
          </DrawerTab>
          <DrawerTab id='d'>
            <TooltipTrigger>
              <TooltipTarget>
                <Icon size='md'>
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
                    <title>Ladle</title>
                    <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                    <path d='M12.088 4.82a10 10 0 0 1 9.412 .314a1 1 0 0 1 .493 .748l.007 .118v13a1 1 0 0 1 -1.5 .866a8 8 0 0 0 -8 0a1 1 0 0 1 -1 0a8 8 0 0 0 -7.733 -.148l-.327 .18l-.103 .044l-.049 .016l-.11 .026l-.061 .01l-.117 .006h-.042l-.11 -.012l-.077 -.014l-.108 -.032l-.126 -.056l-.095 -.056l-.089 -.067l-.06 -.056l-.073 -.082l-.064 -.089l-.022 -.036l-.032 -.06l-.044 -.103l-.016 -.049l-.026 -.11l-.01 -.061l-.004 -.049l-.002 -.068v-13a1 1 0 0 1 .5 -.866a10 10 0 0 1 9.412 -.314l.088 .044l.088 -.044z' />
                  </svg>
                </Icon>
              </TooltipTarget>
              <Tooltip>Books</Tooltip>
            </TooltipTrigger>
          </DrawerTab>
        </DrawerTabList>
        <DrawerDialog>
          <Element slot='header'>
            {isChildPane && (
              <Button slot='back' onPress={() => setIsChildPane(false)}>
                <Icon fill='none' size='relative' stroke='currentcolor'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <title>Ladle</title>
                    <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                    <path d='M15 6l-6 6l6 6' fill='none' />
                  </svg>
                </Icon>
              </Button>
            )}
            <AriaHeading slot='title'>
              {isChildPane ? 'Child' : 'Parent'}
            </AriaHeading>
            <Button slot='close'>
              <Icon fill='none' size='relative' stroke='currentcolor'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <title>Ladle</title>
                  <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                  <path d='M18 6l-12 12' />
                  <path d='M6 6l12 12' />
                </svg>
              </Icon>
            </Button>
          </Element>
          <Element slot='content'>
            <TabPanels>
              <TabPanel id='a'>
                Panel A {isChildPane ? 'child' : 'content'}
              </TabPanel>
              <TabPanel id='b'>
                Panel B {isChildPane ? 'child' : 'content'}
              </TabPanel>
              <TabPanel id='c'>
                Panel C {isChildPane ? 'child' : 'content'}
              </TabPanel>
              <TabPanel id='d'>
                Panel D {isChildPane ? 'child' : 'content'}
              </TabPanel>
            </TabPanels>
          </Element>
          <Element slot='footer'>
            <Button size='sm' onPress={() => setIsChildPane(true)}>
              Add new
            </Button>
          </Element>
        </DrawerDialog>
      </Drawer>
      {props.anchor === 'left' && (
        <div
          style={{
            padding: '24px',
            flex: 1,
            background: 'lightgray',
            color: 'black',
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};

MultiTabbedExample.storyName = 'Multi Tabbed';

const content = (
  <>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu odio
      ligula. Fusce nec dui sit amet odio pellentesque consectetur. Nulla
      facilisi. Phasellus erat quam, dictum eget dui vel, mattis tempor dui.
      Donec maximus convallis metus, non pulvinar tellus cursus eget. Integer at
      ipsum vitae metus convallis dapibus. Suspendisse at dapibus lacus, eget
      dapibus enim. Cras iaculis enim eget egestas lacinia. Donec volutpat
      sagittis sollicitudin. Sed eget odio pretium, posuere felis ac, tincidunt
      magna. In varius leo erat, nec elementum velit blandit hendrerit. Praesent
      interdum eget eros eu finibus. Suspendisse eu auctor nibh. Mauris commodo
      nibh sed augue euismod tempus. Nunc eu ex semper, gravida magna id,
      vestibulum mauris.
    </p>

    <p>
      Nam bibendum lacus sed felis pretium dignissim. Praesent pretium, libero
      eu porttitor vestibulum, leo lectus sollicitudin ex, sit amet dictum ipsum
      arcu ut neque. Nullam porttitor nunc et mi vulputate imperdiet. Vivamus
      suscipit sapien porttitor sodales viverra. Nullam arcu lacus, iaculis quis
      tempus ac, luctus fringilla erat. Vestibulum purus magna, venenatis et
      diam dictum, blandit dictum ipsum. Aenean hendrerit, justo eu convallis
      rutrum, arcu mauris tincidunt leo, iaculis laoreet velit libero non ipsum.
      Pellentesque vitae nulla sit amet mauris dapibus rutrum. Etiam rutrum,
      velit vel fermentum laoreet, eros turpis tristique sapien, in tristique
      elit massa id dui.
    </p>
    <p>
      Praesent consectetur vitae purus sit amet porttitor. Praesent mollis
      tempor ante in venenatis. Maecenas sed convallis elit. Proin ipsum urna,
      pulvinar in arcu vel, dignissim viverra ex. Vestibulum pulvinar euismod
      malesuada. Praesent ut justo auctor, lobortis mauris at, volutpat nisl.
      Curabitur fermentum quam at neque fringilla fringilla ac id est. Sed
      molestie convallis nunc sit amet facilisis. Phasellus ornare, ante ac
      cursus dapibus, purus nibh vehicula eros, at sagittis nisl ipsum ac sem.
      Ut nec efficitur nisi, malesuada mattis neque.
    </p>
    <p>
      Etiam rhoncus, turpis a sagittis commodo, magna est iaculis libero, ut
      aliquet odio nisi nec dolor. Pellentesque sed turpis auctor, commodo erat
      vitae, venenatis massa. Fusce suscipit hendrerit ex a ornare. Aliquam non
      tortor tempor est dapibus fringilla eu sed quam. Nam sem est, imperdiet
      ultricies purus et, congue tempor sapien. Donec tristique aliquam
      pharetra. Vestibulum quis dapibus metus, et vulputate eros. Fusce auctor
      urna eget semper egestas. Pellentesque iaculis commodo sapien, non
      bibendum sapien fringilla sit amet. Mauris ornare elit nec mollis luctus.
    </p>
    <p>
      Aliquam erat volutpat. Vestibulum maximus urna elit. Integer vulputate sed
      tortor non posuere. Cras placerat dignissim sodales. Sed eget erat vel
      lectus consequat varius nec in nisl. Nulla sit amet pretium massa. Nunc
      fringilla dui lectus, in consectetur ex vehicula ut. Pellentesque pretium
      volutpat nisl, id varius justo congue a. Fusce ut pretium orci, eu
      tristique purus. Fusce pharetra nec nisi vitae sodales. Nulla aliquet
      felis eget libero volutpat sollicitudin. Donec finibus vestibulum ex a
      eleifend. Curabitur bibendum lacus vel leo elementum imperdiet. Curabitur
      tincidunt dui magna, ut sollicitudin lacus pretium id. In id lobortis
      nunc, at consectetur eros.
    </p>
  </>
);
