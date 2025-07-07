import type { Meta, StoryObj } from '@storybook/react';
import { useContext } from 'react';
import { Button } from '../button';
import { NavigationStack, NavigationStackContext } from './index';
import type { NavigationStackProps } from './types';

const meta: Meta<typeof NavigationStack> = {
  title: 'Components/NavigationStack',
  component: NavigationStack,
};

export default meta;
type Story = StoryObj<typeof NavigationStack>;

const ParentView = () => {
  const { pushView } = useContext(NavigationStackContext);

  return (
    <div>
      <p>This is the parent view</p>
      <Button onPress={() => pushView('child')}>Go to child view</Button>
    </div>
  );
};

const ChildView = () => {
  return (
    <div>
      <p>this is the child view</p>
    </div>
  );
};

export const Default: Story = {
  render: (args: NavigationStackProps) => (
    <div className='h-[300px] w-[400px]'>
      <NavigationStack defaultViewId='parent' {...args}>
        <NavigationStack.View id='parent'>
          <NavigationStack.Header>
            <NavigationStack.Title>Parent View</NavigationStack.Title>
          </NavigationStack.Header>
          <ParentView />
        </NavigationStack.View>
        <NavigationStack.View id='child'>
          <NavigationStack.Header>
            <NavigationStack.Title>Child View</NavigationStack.Title>
          </NavigationStack.Header>
          <ChildView />
        </NavigationStack.View>
      </NavigationStack>
    </div>
  ),
};
