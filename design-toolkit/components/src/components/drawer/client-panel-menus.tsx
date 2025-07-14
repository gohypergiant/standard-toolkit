'use client';
import { Placeholder } from '@accelint/icons';
import { Icon } from '../icon';
import {
  PanelMenuForBottomPanel,
  PanelMenuForLeftPanel,
  PanelMenuForRightPanel,
  PanelMenuForTopPanel,
} from './menu';
import type { PanelToggleProps } from './panel-toggle-props';
import { PanelToggleBottom } from './toggle-bottom';
import { PanelToggleLeft } from './toggle-left';
import { PanelToggleRight } from './toggle-right';
import { PanelToggleTop } from './toggle-top';

const extraItemsX = Array.from({ length: 6 }, (_, index) => (
  <span
    className='my-s flex w-full cursor-pointer justify-center'
    key={`${index + 1}`}
  >
    <Icon>
      <Placeholder />
    </Icon>
  </span>
));

const extraItemsY = Array.from({ length: 6 }, (_, index) => (
  <span className='mx-s flex cursor-pointer items-center' key={`${index + 1}`}>
    <Icon>
      <Placeholder />
    </Icon>
  </span>
));

export function ClientTopMenu({ options }: PanelToggleProps) {
  return (
    <PanelMenuForTopPanel>
      <PanelToggleTop options={options} />

      {extraItemsY}
    </PanelMenuForTopPanel>
  );
}

export function ClientBottomMenu({ options }: PanelToggleProps) {
  return (
    <PanelMenuForBottomPanel>
      <PanelToggleBottom options={options} />

      {extraItemsY}
    </PanelMenuForBottomPanel>
  );
}

export function ClientLeftMenu({ options }: PanelToggleProps) {
  return (
    <PanelMenuForLeftPanel>
      <PanelToggleLeft options={options} />

      {extraItemsX}
    </PanelMenuForLeftPanel>
  );
}

export function ClientRightMenu({ options }: PanelToggleProps) {
  return (
    <PanelMenuForRightPanel>
      <PanelToggleRight options={options} />

      {extraItemsX}
    </PanelMenuForRightPanel>
  );
}
