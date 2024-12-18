'use client';

import { MenuTrigger } from 'react-aria-components';
import { Button, Menu, MenuList, MenuItem } from '@accelint/design-system';
import { isYes } from '@accelint/predicates';
import { classNames } from './nav.css';
import { useEffect } from 'react';

export type NavProps = {
  onAction?: () => void;
};

export function Nav({ onAction }: NavProps) {
  useEffect(() => {
    console.log(isYes('no'));
  });

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
