import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Placeholder,
} from '@accelint/icons';
import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties, PropsWithChildren } from 'react';
import { Icon } from '../icon';
import { Drawer } from './index';
import { NavigationStack } from '../navigation-stack';

const meta: Meta<typeof Drawer.Root> = {
  title: 'Components/Drawer',
  component: Drawer.Root,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Drawer.Root>;

const PanelTitle = ({ children }: PropsWithChildren) => (
  <h2 className='fg-[#fff] mx-auto mt-l w-content rounded-full bg-[rgba(0,0,0,0.3)] p-m px-xl'>
    {children}
  </h2>
);

const BottomIcon = () => (
  <Icon>
    <ChevronDown className='hidden group-data-[bottom*=nav]/layout:block group-data-[bottom*=open]/layout:block group-data-[bottom*=xl]/layout:block' />
    <ChevronUp className='hidden group-data-[bottom*=closed]/layout:block group-data-[bottom*=icons]/layout:block' />
  </Icon>
);

const TopIcon = () => (
  <Icon>
    <ChevronUp className='hidden group-data-[top*=nav]/layout:block group-data-[top*=open]/layout:block group-data-[top*=xl]/layout:block' />
    <ChevronDown className='hidden group-data-[top*=closed]/layout:block group-data-[top*=icons]/layout:block' />
  </Icon>
);

const LeftIcon = () => (
  <Icon>
    <ChevronLeft className='hidden group-data-[left*=nav]/layout:block group-data-[left*=open]/layout:block group-data-[left*=xl]/layout:block' />
    <ChevronRight className='hidden group-data-[left*=closed]/layout:block group-data-[left*=icons]/layout:block' />
  </Icon>
);

const RightIcon = () => (
  <Icon>
    <ChevronLeft className='hidden group-data-[right*=closed]/layout:block group-data-[right*=icons]/layout:block group-data-[right*=xl]/layout:block' />
    <ChevronRight className='hidden group-data-[right*=nav]/layout:block group-data-[right*=open]/layout:block' />
  </Icon>
);

const extraItemsX = Array.from({ length: 6 }, (_, index) => (
  <span
    className='my-s flex w-full cursor-pointer justify-center'
    key={`${index + 1}`}
  >
    <Icon className='text-disabled'>
      <Placeholder />
    </Icon>
  </span>
));

const extraItemsY = Array.from({ length: 6 }, (_, index) => (
  <span className='mx-s flex cursor-pointer items-center' key={`${index + 1}`}>
    <Icon className='text-disabled'>
      <Placeholder />
    </Icon>
  </span>
));

export const FullLayout: Story = {
  render: () => {
    return (
      <Drawer.Root extend='left and right'>
        <Drawer
          id='header'
          className='bg-[rgba(200,50,0,0.5)]'
          placement='top'
          mode='push'
          hotKey='w'
        >
          <Drawer.Menu>
            <Drawer.Trigger for='header'>
              <TopIcon />
            </Drawer.Trigger>

            {extraItemsY}
          </Drawer.Menu>

          <PanelTitle>Top</PanelTitle>
          {/* {LIPSUM} */}
        </Drawer>

        <Drawer.Main>
          <div
            className='flex h-full items-center justify-center bg-surface-overlay'
            style={
              {
                '--single': '40px',
                '--double': 'calc(2 * var(--single))',
                backgroundImage: `
            radial-gradient(closest-side, transparent 98%, rgba(0,0,0,.8) 99%),
            radial-gradient(closest-side, transparent 98%, rgba(0,0,0,.4) 99%)
          `,
                backgroundSize: 'var(--double) var(--double)',
                backgroundPosition:
                  'center, calc(50% + var(--single)) calc(50% + var(--single))',
              } as CSSProperties
            }
          >
            <div className='flex w-[23em] flex-col rounded-large border-2 border-default-dark bg-surface-overlay p-xl drop-shadow-[0_0_150px_rgba(255,255,255,0.4)] [&>*]:my-s'>
              <p>This page is for demo purposes only!</p>
              <p>Key-bindings for toggles:</p>

              <ul className='[&_kbd]:mr-m [&_kbd]:inline-block [&_kbd]:w-[4em] [&_kbd]:text-right'>
                <li>
                  <kbd>w</kbd>
                  open/closed "top" panel
                </li>

                <li>
                  <kbd>s</kbd>
                  open/closed "bottom" panel
                </li>

                <li>
                  <kbd>a</kbd>
                  open/closed "left" panel
                </li>

                <li>
                  <kbd>d</kbd>
                  open/closed "right" panel
                </li>
              </ul>
            </div>
          </div>
        </Drawer.Main>

        <Drawer
          id='footer'
          className='bg-[rgba(50,200,0,0.5)]'
          placement='bottom'
          mode='push'
          hotKey='s'
        >
          <Drawer.Menu>
            <Drawer.Trigger for='footer'>
              <BottomIcon />
            </Drawer.Trigger>

            {extraItemsY}
          </Drawer.Menu>

          <PanelTitle>Bottom</PanelTitle>
          {/* {LIPSUM} */}
        </Drawer>

        <Drawer
          id='settings'
          className='bg-[rgba(0,150,200,0.5)]'
          placement='left'
          mode='push'
          hotKey='a'
        >
          <Drawer.Menu>
            <Drawer.Trigger for='settings'>
              <LeftIcon />
            </Drawer.Trigger>

            {extraItemsX}
          </Drawer.Menu>

          <PanelTitle>Left</PanelTitle>
        </Drawer>

        <Drawer
          id='sidebar'
          className='bg-[rgba(200,50,200,0.5)]'
          placement='right'
          mode='push'
          hotKey='d'
        >
          <Drawer.Menu>
            <Drawer.Trigger for='sidebar'>
              <RightIcon />
            </Drawer.Trigger>

            {extraItemsX}
          </Drawer.Menu>

          <PanelTitle>Right</PanelTitle>
        </Drawer>
      </Drawer.Root>
    );
  },
};

// //Position menu start middle end - default to start
export const WithTabs: Story = {
  render: () => {
    return (
      <Drawer.Root className="bg-default-dark">
        <Drawer.Main>
          <div className='text-default-light'>Left Drawer Content</div>
        </Drawer.Main>
        <Drawer id='settings' placement='left' mode='over'>
          <Drawer.Header>Title</Drawer.Header>
          <Drawer.Menu>
            <Drawer.MenuItem id='a'>
              <Icon>
                <Placeholder />
              </Icon>
            </Drawer.MenuItem>
            <Drawer.MenuItem id='b'>
              <Icon>
                <Placeholder />
              </Icon>
            </Drawer.MenuItem>
          </Drawer.Menu>
          <Drawer.Panel id='a'>A Content</Drawer.Panel>
          <Drawer.Panel id='b'>B Content</Drawer.Panel>
        </Drawer>
      </Drawer.Root>
    );
  },
};

export const WithNavigationStack: Story = {
  render: () => {
    return (
      <Drawer.Root className='bg-default-light'>
        <Drawer id="settings" placement='left' mode='over'>
          <Drawer.Menu>
            <Drawer.MenuItem id="a">

              <Icon>
                <Placeholder />
              </Icon>
            </Drawer.MenuItem>
            <Drawer.MenuItem id="b">

              <Icon>
                <Placeholder />
              </Icon>
            </Drawer.MenuItem>
          </Drawer.Menu>
          <Drawer.Panel id="a">
            <NavigationStack defaultViewId="a">
              <NavigationStack.View id="a">
                <Drawer.Header>
                  <NavigationStack.Header>
                    <NavigationStack.Title>Parent A</NavigationStack.Title>
                  </NavigationStack.Header>
                </Drawer.Header>
                <NavigationStack.Content>a content</NavigationStack.Content>
                <Drawer.Footer>
                  <NavigationStack.NavigationButton childId="child-a">View Child</NavigationStack.NavigationButton>
                </Drawer.Footer>
              </NavigationStack.View>

              <NavigationStack.View id="child-a">
                <NavigationStack.Header>
                  <NavigationStack.Title>Child A</NavigationStack.Title>
                  <Drawer.Close />
                </NavigationStack.Header>
                <NavigationStack.Content>a child content</NavigationStack.Content>
              </NavigationStack.View>
            </NavigationStack>
          </Drawer.Panel>

          <Drawer.Panel id="b" className="h-full p-0">
            <NavigationStack defaultViewId="b">
              <NavigationStack.View id="b">
                <Drawer.Header>
                  <NavigationStack.Header>
                    <NavigationStack.Title>Parent B</NavigationStack.Title>
                  </NavigationStack.Header>
                </Drawer.Header>
                <NavigationStack.Content>b content</NavigationStack.Content>
                <Drawer.Footer>
                  <NavigationStack.NavigationButton childId="child-b">View Child</NavigationStack.NavigationButton>
                </Drawer.Footer>
              </NavigationStack.View>

              <NavigationStack.View id="child-b">
                <NavigationStack.Header>
                  <NavigationStack.Title>Child B</NavigationStack.Title>
                  <Drawer.Close />
                </NavigationStack.Header>
                <NavigationStack.Content>b child content</NavigationStack.Content>
              </NavigationStack.View>
            </NavigationStack>
          </Drawer.Panel>
        </Drawer>
      </Drawer.Root>
    );
  },
};
