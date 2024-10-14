import { render, screen } from '@testing-library/react';
import { Collection, MenuTrigger, SubmenuTrigger } from 'react-aria-components';
import { describe, expect, it } from 'vitest';
import { AriaHeader, AriaSection, AriaSeparator, AriaText } from '../aria';
import { Button } from '../button';
import { Icon } from '../icon';
import { Menu, MenuItem, MenuList } from './menu';

type Items = (typeof defaultItems)[number];

const defaultItems = [
  {
    id: '1',
    name: 'Foo',
    section: [
      { id: '2', name: 'Item One' },
      { id: '3', name: 'Item Two' },
    ],
  },
  {
    id: '4',
    name: 'Submenu',
    children: [
      { id: '5', name: 'Sub One' },
      { id: '6', name: 'Sub Two' },
    ],
  },
  { id: '7', name: 'Item Three' },
  { id: '8' },
];

describe('Menu', () => {
  it('should render', () => {
    render(
      <MenuTrigger>
        <Button aria-label='Menu'>☰ Open Menu</Button>
        <Menu isOpen>
          <MenuList<Items> items={defaultItems} aria-label='Test Menu'>
            {function renderSubmenu(item) {
              if (item.children) {
                return (
                  <SubmenuTrigger>
                    <MenuItem>
                      <AriaText slot='label'>{item.name}</AriaText>
                      <Icon size='sm' slot='more'>
                        <svg className='chevron' viewBox='0 0 24 24'>
                          <title>Ladle</title>
                          <path d='m9 18 6-6-6-6' />
                        </svg>
                      </Icon>
                    </MenuItem>
                    <Menu isOpen>
                      <MenuList items={item.children}>{renderSubmenu}</MenuList>
                    </Menu>
                  </SubmenuTrigger>
                );
              }

              if (item.section) {
                return (
                  <AriaSection>
                    <AriaHeader>{item.name}</AriaHeader>
                    <Collection items={item.section}>
                      {renderSubmenu}
                    </Collection>
                  </AriaSection>
                );
              }

              return item.name ? (
                <MenuItem>
                  <AriaText slot='label'>{item.name}</AriaText>
                </MenuItem>
              ) : (
                <AriaSeparator />
              );
            }}
          </MenuList>
        </Menu>
      </MenuTrigger>,
    );
    expect(screen.getAllByRole('menu')).toHaveLength(2); // menu & submenu
    expect(screen.getAllByRole('menuitemradio')).toHaveLength(5); // menu items
  });
});
