import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties, PropsWithChildren } from 'react';
import {
  ClientBottomMenu,
  ClientLeftMenu,
  ClientRightMenu,
  ClientTopMenu,
} from './client-panel-menus';
import type { PanelLabel, PanelState } from './config';
import { RouteLayout } from './index';
import { KeyboardListener } from './keyboard-listener';

const meta: Meta<typeof RouteLayout> = {
  title: 'Components/Drawer',
  component: RouteLayout,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof RouteLayout>;

const PanelTitle = ({ children }: PropsWithChildren) => (
  <h2 className='fg-[#fff] mx-auto mt-l w-content rounded-full bg-[rgba(0,0,0,0.3)] p-m px-xl'>
    {children}
  </h2>
);

type StateOptions = [PanelState, PanelState];

const STATES = ['closed', 'open'];

const toggleStates = [STATES[0], STATES[1]] as StateOptions;

const options = {
  bottom: toggleStates,
  top: toggleStates,
  left: toggleStates,
  right: toggleStates,
} as const satisfies Record<PanelLabel, [PanelState, PanelState]>;

export const LeftDrawer: Story = {
  render: () => {
    return (
      <RouteLayout
        extend='left and right'
        panels={{
          bottom: 'over-open',
          left: 'over-open',
          right: 'over-open',
          top: 'over-open',
        }}
      >
        <RouteLayout.Top className='bg-[rgba(200,50,0,0.5)]'>
          <ClientTopMenu options={options.top} />

          <PanelTitle>Top</PanelTitle>
          {/* {LIPSUM} */}
        </RouteLayout.Top>

        <RouteLayout.Main>
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

                <li>
                  <kbd>shift</kbd>
                  push/over "each" panel
                </li>

                <li>
                  <kbd>p</kbd>
                  push/over "all" panels
                </li>

                <li>
                  <kbd>1-6</kbd>
                  Panel layouts
                </li>
              </ul>
            </div>

            <KeyboardListener />
          </div>
        </RouteLayout.Main>

        <RouteLayout.Bottom className='bg-[rgba(50,200,0,0.5)]'>
          <ClientBottomMenu options={options.bottom} />

          <PanelTitle>Bottom</PanelTitle>
          {/* {LIPSUM} */}
        </RouteLayout.Bottom>

        <RouteLayout.Left className='bg-[rgba(0,150,200,0.5)]'>
          <ClientLeftMenu options={options.left} />

          <PanelTitle>Left</PanelTitle>
        </RouteLayout.Left>

        <RouteLayout.Right className='bg-[rgba(200,50,200,0.5)]'>
          <ClientRightMenu options={options.right} />

          <PanelTitle>Right</PanelTitle>
        </RouteLayout.Right>
      </RouteLayout>
    );
  },
};
