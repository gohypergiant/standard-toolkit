import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AriaHeading } from '../aria';
import { Button } from '../button';
import { Element } from '../element';
import { TabPanel, TabPanels } from '../tabs';
import { Drawer, DrawerDialog, DrawerTab, DrawerTabList } from './drawer';
import type { DrawerProps } from './types';

function setup(props: Partial<DrawerProps> = {}) {
  render(
    <Drawer {...props}>
      <DrawerTabList>
        <DrawerTab id='a'>Foo</DrawerTab>
      </DrawerTabList>
      <DrawerDialog>
        <Element slot='header'>
          <AriaHeading slot='title'>Hello</AriaHeading>
          <Button slot='close'>Close</Button>
        </Element>
        <Element slot='content'>
          <TabPanels>
            <TabPanel id='a'>
              <p>Bar</p>
            </TabPanel>
          </TabPanels>
        </Element>
        <Element slot='footer'>Footer</Element>
      </DrawerDialog>
    </Drawer>,
  );

  return props;
}

describe('Drawer', () => {
  it('should render', () => {
    setup();

    expect(screen.getByText('Foo')).toBeInTheDocument();
    expect(screen.getByText('Bar')).toBeInTheDocument();
  });
});
