'use client';
import { ChevronDown, ChevronUp } from '@accelint/icons';
import { Icon } from '../icon';
import type { PanelToggleProps } from './panel-toggle-props';
import { usePanelToggle } from './use-panel-toggle';

/**
 * PanelToggleTop - Top Panel Toggle Button
 *
 * Toggle button specifically designed for the top panel. Provides intuitive
 * vertical chevron icons that indicate expand/collapse actions for the top area.
 *
 * ## Usage:
 * ```tsx
 * // Basic top toggle
 * <PanelToggleTop options={['over-closed', 'over-open']} />
 *
 * // In top menu with user controls
 * <PanelMenuForTopPanel>
 *   <PanelToggleTop options={['over-icons', 'over-nav']} />
 *   // ...
 * </PanelMenuForTopPanel>
 * ```
 *
 * @param options - Two-element array of panel states to toggle between
 */
export function PanelToggleTop({ options }: PanelToggleProps) {
  const Button = usePanelToggle({ options, panel: 'top' });

  return (
    <Button className='flex w-full items-center justify-center p-xs text-center'>
      <Icon>
        <ChevronUp className='hidden group-data-[top*=nav]/layout:block group-data-[top*=open]/layout:block group-data-[top*=xl]/layout:block' />
        <ChevronDown className='hidden group-data-[top*=closed]/layout:block group-data-[top*=icons]/layout:block' />
      </Icon>
    </Button>
  );
}
