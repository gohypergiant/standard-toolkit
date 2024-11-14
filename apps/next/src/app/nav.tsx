'use client';

import { MenuTrigger } from 'react-aria-components';
import { Button, Menu, MenuList, MenuItem } from '@accelint/design-system';

export type NavProps = {
  onAction?: () => void;
};

export function Nav({ onAction }: NavProps) {
  return (
    <MenuTrigger>
      <Button>Click me</Button>
      <Menu>
        <MenuList onAction={onAction}>
          <MenuItem>Foo</MenuItem>
          <MenuItem>Bar</MenuItem>
        </MenuList>
      </Menu>
    </MenuTrigger>
  );
}
