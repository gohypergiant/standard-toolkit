'use client';

import { MenuTrigger } from 'react-aria-components';
import { Button, Menu, MenuList, MenuItem } from '@accelint/design-system';
import { classNames } from './nav.css';

export type NavProps = {
  onAction?: () => void;
};

export function Nav({ onAction }: NavProps) {
  return (
    <div className={classNames.container}>
      <MenuTrigger>
        <Button classNames={classNames.trigger}>Click me</Button>
        <Menu>
          <MenuList onAction={onAction}>
            <MenuItem>Foo</MenuItem>
            <MenuItem>Bar</MenuItem>
          </MenuList>
        </Menu>
      </MenuTrigger>
    </div>
  );
}
