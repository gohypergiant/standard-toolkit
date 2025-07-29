import { ChevronLeft } from '@accelint/icons';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../button';
import { Icon } from '../icon';
import { NavigationStack } from './index';
import type { NavigationStackProps } from './types';

const meta: Meta<typeof NavigationStack> = {
  title: 'Components/NavigationStack',
  component: NavigationStack,
};

export default meta;
type Story = StoryObj<typeof NavigationStack>;

export const Default: Story = {
  render: (args: NavigationStackProps) => (
    <div className='h-[300px] w-[200px] text-default-light'>
      <NavigationStack defaultViewId='parent' {...args}>
        <NavigationStack.View id='parent' className='flex flex-col gap-m'>
          <div className='text-header-l'>Parent View</div>
          <NavigationStack.Navigate childId='child'>
            <span className='text-body-s'>Go To Child</span>
          </NavigationStack.Navigate>
        </NavigationStack.View>
        <NavigationStack.View id='child'>
          <div className='flex items-center justify-between'>
            <NavigationStack.Back>
              <div className='flex cursor-pointer items-center'>
                <Button variant='icon'>
                  <Icon>
                    <ChevronLeft />
                  </Icon>
                </Button>
                <span className='text-body-xs'> Parent View </span>
              </div>
            </NavigationStack.Back>
            <div className='text-header-s uppercase'>Child View</div>
          </div>
          <div className='mt-m text-body-s'>
            <p>this is the child view</p>
          </div>
        </NavigationStack.View>
      </NavigationStack>
    </div>
  ),
};
