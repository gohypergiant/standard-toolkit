import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { ClassNames } from '../../types';
import { TEST_IDS, Tab, TabList, TabPanel, TabPanels, Tabs } from './tabs';
import type { TabsProps } from './types';

function setup(props: Partial<TabsProps> = {}) {
  render(
    <Tabs {...props}>
      <TabList>
        <Tab id='foo'>Foo</Tab>
        <Tab id='bar'>Bar</Tab>
      </TabList>
      <TabPanels>
        <TabPanel id='foo'>Foo&apos;s Content</TabPanel>
        <TabPanel id='bar'>Bar&apos;s Content</TabPanel>
      </TabPanels>
    </Tabs>,
  );

  return props;
}

describe('Tabs', () => {
  it('should render', () => {
    setup();

    expect(screen.getByText(`Foo's Content`)).toBeInTheDocument();
  });

  it('should pass down classNames', () => {
    setup({ classNames: TEST_IDS });

    // TODO: Likely candidate for test utils
    const list = (function getIds(ids: ClassNames) {
      return Object.values(ids).reduce<string[]>((acc, value) => {
        if (typeof value === 'string') {
          acc.push(value);
        } else {
          acc.push(...getIds(value));
        }

        return acc;
      }, []);
    })(TEST_IDS);

    list.forEach((id) => {
      screen.getAllByTestId(id).forEach((element) => {
        expect(element.classList).toContain(id);
      });
    });
  });
});
