import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Placeholder,
} from '@accelint/icons';
import type { Meta, StoryObj } from '@storybook/react';
import {
  type CSSProperties,
  type PropsWithChildren,
  useCallback,
  useState,
} from 'react';
import { Button } from '../button';
import { Icon } from '../icon';
import { NavigationStack } from '../navigation-stack';
import { Drawer } from './index';

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

export const WithTabs: Story = {
  render: () => {
    return (
      <Drawer.Root className='bg-default-dark'>
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

export const WithLongContent: Story = {
  render: () => {
    return (
      <Drawer.Root className='bg-default-dark'>
        <Drawer.Main>
          <div className='text-default-light'>Left Drawer Content</div>
        </Drawer.Main>
        <Drawer id='settings' placement='left' mode='over'>
          <Drawer.Menu>
            <Drawer.MenuItem id=''>
              <Icon>
                <Placeholder />
              </Icon>
            </Drawer.MenuItem>
          </Drawer.Menu>
          <Drawer.Header>Title</Drawer.Header>
          <Drawer.Panel id=''>{longContent}</Drawer.Panel>
          <Drawer.Footer>Footer</Drawer.Footer>
        </Drawer>
      </Drawer.Root>
    );
  },
};

export const ControlledOpen: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    const handleOpenChange = useCallback((isOpen: boolean) => {
      setIsOpen(isOpen);
    }, []);
    return (
      <Drawer.Root className='bg-default-dark'>
        <Drawer.Main className='flex flex-col gap-m p-l'>
          <h1 className='text-header-l '>Left Drawer Content</h1>
          <Button variant='outline' onPress={() => handleOpenChange(!isOpen)}>
            {isOpen ? 'Close' : 'Open'}
          </Button>
        </Drawer.Main>
        <Drawer
          isOpen={isOpen}
          onOpenChange={handleOpenChange}
          id='settings'
          placement='left'
          mode='push'
        >
          <Drawer.Header>Title</Drawer.Header>
          <Drawer.Menu>
            <Drawer.MenuItem id=''>
              <Icon>
                <Placeholder />
              </Icon>
            </Drawer.MenuItem>
          </Drawer.Menu>
          <Drawer.Panel id=''>A Content</Drawer.Panel>
        </Drawer>
      </Drawer.Root>
    );
  },
};

export const WithNavigationStack: Story = {
  render: () => {
    return (
      <Drawer.Root className='bg-default-light'>
        <Drawer id='settings' placement='left' mode='over'>
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
          <Drawer.Panel id='a'>
            <NavigationStack defaultViewId='a'>
              <NavigationStack.View id='a'>
                <Drawer.Header>Parent A</Drawer.Header>
                <NavigationStack.Content>a content</NavigationStack.Content>
                <Drawer.Footer>
                  <NavigationStack.NavigateButton childId='child-a'>
                    View Child
                  </NavigationStack.NavigateButton>
                </Drawer.Footer>
              </NavigationStack.View>

              <NavigationStack.View id='child-a'>
                <div className='flex items-center justify-between'>
                  <NavigationStack.Back>Back</NavigationStack.Back>
                  <div>Child A</div>
                </div>
                <NavigationStack.Content>
                  a child content
                </NavigationStack.Content>
              </NavigationStack.View>
            </NavigationStack>
          </Drawer.Panel>

          <Drawer.Panel id='b' className='h-full p-0'>
            <NavigationStack defaultViewId='b'>
              <NavigationStack.View id='b'>
                <Drawer.Header>Parent B</Drawer.Header>
                <NavigationStack.Content>b content</NavigationStack.Content>
                <Drawer.Footer>
                  <NavigationStack.NavigateButton childId='child-b'>
                    View Child
                  </NavigationStack.NavigateButton>
                </Drawer.Footer>
              </NavigationStack.View>

              <NavigationStack.View id='child-b'>
                <div className='flex items-center justify-between'>
                  <NavigationStack.Back />
                  Child B
                </div>
                <NavigationStack.Content>
                  b child content
                </NavigationStack.Content>
              </NavigationStack.View>
            </NavigationStack>
          </Drawer.Panel>
        </Drawer>
      </Drawer.Root>
    );
  },
};

const longContent = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sed rhoncus urna. Nam blandit tortor laoreet, efficitur ante eget, sagittis massa. Nam eu consequat nibh, a pulvinar mi. Donec in felis elementum turpis vehicula rutrum at vel purus. Integer tristique sodales eros, nec suscipit mi posuere a. Phasellus non mi erat. Sed at elementum lacus, ac rhoncus urna. Nullam metus diam, porta sed elementum in, rutrum eu turpis. Aliquam hendrerit eget augue ac sodales. Phasellus fermentum ante dolor, et hendrerit dolor bibendum id. Etiam placerat tortor sagittis diam faucibus feugiat. Etiam sed dolor a ante dignissim condimentum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed eu nulla consequat, malesuada elit eu, imperdiet nibh. Ut dictum enim non aliquam tempus.

Praesent ullamcorper neque non dolor ultrices porta. Suspendisse potenti. Integer ipsum mauris, vestibulum ut luctus sit amet, mollis vel velit. Cras vitae molestie nunc. In ut velit ut libero posuere porta. Pellentesque fringilla sollicitudin elit, ut feugiat augue pellentesque sed. Ut non dui tellus. Aenean vehicula ultrices vulputate. Morbi viverra interdum mi, eu convallis dolor hendrerit ac. Sed interdum est arcu, a tempus nunc accumsan a. Praesent porta malesuada laoreet. Sed ultrices elit quis enim pretium, in venenatis mauris faucibus. Curabitur nec velit ligula. Maecenas orci ipsum, accumsan quis nisi in, fringilla facilisis dolor. Proin magna felis, tristique nec elit rutrum, tristique aliquam sem.

Cras neque nulla, imperdiet nec nulla sed, tempus mollis purus. Etiam sed erat vitae enim sagittis tristique. Ut luctus felis et fermentum pellentesque. Pellentesque eleifend blandit nibh ut interdum. Etiam ultricies pretium eros, auctor vehicula tellus ornare nec. Donec metus risus, faucibus tincidunt arcu a, malesuada pretium metus. Nunc ac est vitae ex gravida euismod. Praesent quam ligula, venenatis eget neque ac, pellentesque finibus ipsum. Quisque rutrum ligula sed ex posuere mollis. Integer pretium luctus massa. Suspendisse diam massa, congue vitae bibendum quis, finibus quis felis. Vivamus in dui a lectus posuere rutrum.

Etiam venenatis vulputate dignissim. Proin risus sem, aliquet eget vestibulum ut, mattis nec nulla. Integer nec semper quam. Ut blandit mi quis eros imperdiet tincidunt. Maecenas ac tincidunt tortor. In accumsan sem eget massa bibendum euismod. Pellentesque sit amet lorem urna. Sed consectetur a mauris sit amet commodo. Sed quis laoreet dolor. Mauris quis mattis tellus.

Integer in libero velit. Donec fringilla sem eu tellus cursus, maximus bibendum lacus rhoncus. Vestibulum hendrerit porttitor neque, vitae venenatis nibh. Nulla risus quam, cursus ac ultricies at, mattis nec nisl. Suspendisse vulputate, sem at dapibus facilisis, nibh sapien cursus ipsum, at suscipit risus arcu sed nibh. Cras pellentesque, urna ut venenatis euismod, leo lacus facilisis turpis, in gravida tortor nisl eget ipsum. In finibus tempus est at tristique. Aenean ut hendrerit massa. Donec magna nisi, imperdiet at lacinia non, dictum non elit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam et enim consequat, malesuada urna et, placerat dui.
`;
