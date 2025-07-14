'use client';
import { Icon } from '../icon';
import { ChevronLeft, ChevronRight } from '@accelint/icons';
import { usePanelToggle } from './use-panel-toggle';
import type { PanelToggleProps } from './panel-toggle-props';

/**
 * PanelToggleLeft - Configurable Left Panel Toggle
 *
 * Flexible toggle button for the left panel that accepts custom panel state options.
 * Provides consistent horizontal chevron icons that reflect the current panel state
 * and indicate the next action available to the user.
 *
 * ## Common Usage Patterns:
 * ```tsx
 * // Basic open/close toggle
 * <PanelToggleLeft options={['over-closed', 'over-open']} />
 *
 * // Icons/navigation toggle
 * <PanelToggleLeft options={['over-icons', 'over-nav']} />
 *
 * // Push mode toggle for layout shifting
 * <PanelToggleLeft options={['push-closed', 'push-open']} />
 *
 * // In left panel menu
 * <PanelMenuForLeftPanel>
 *   <PanelToggleLeft options={['over-closed', 'over-xl']} />
 *   // ...
 * </PanelMenuForLeftPanel>
 * ```
 *
 * @param options - Two-element array of panel states to toggle between
 */
export function PanelToggleLeft({ options }: PanelToggleProps) {
  const Button = usePanelToggle({ options, panel: 'left' });

  return (
    <Button className='flex w-full items-center justify-center p-xs text-center'>
      <Icon>
        <ChevronLeft className='hidden group-data-[left*=nav]/layout:block group-data-[left*=open]/layout:block group-data-[left*=xl]/layout:block' />
        <ChevronRight className='hidden group-data-[left*=closed]/layout:block group-data-[left*=icons]/layout:block' />
      </Icon>
    </Button>
  );
}
