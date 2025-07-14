'use client';
import { Icon } from '../icon';
import { ChevronDown, ChevronUp } from '@accelint/icons';
import { usePanelToggle } from './use-panel-toggle';
import type { PanelToggleProps } from './panel-toggle-props';

/**
 * PanelToggleBottom - Bottom Panel Toggle Button
 *
 * Toggle button specifically designed for the bottom panel. Provides intuitive
 * vertical chevron icons that indicate expand/collapse actions for the bottom area.
 *
 * ## Usage:
 * ```tsx
 * // Basic bottom toggle
 * <PanelToggleBottom options={['over-closed', 'over-open']} />
 *
 * // In bottom menu
 * <PanelMenuForBottomPanel>
 *   <PanelToggleBottom options={['over-icons', 'over-nav']} />
 *   // ...
 * </PanelMenuForBottomPanel>
 * ```
 *
 * @param options - Two-element array of panel states to toggle between
 */
export function PanelToggleBottom({ options }: PanelToggleProps) {
  const Button = usePanelToggle({ options, panel: 'bottom' });

  return (
    <Button className='flex w-full items-center justify-center p-xs text-center'>
      <Icon>
        <ChevronDown className='hidden group-data-[bottom*=nav]/layout:block group-data-[bottom*=open]/layout:block group-data-[bottom*=xl]/layout:block' />
        <ChevronUp className='hidden group-data-[bottom*=closed]/layout:block group-data-[bottom*=icons]/layout:block' />
      </Icon>
    </Button>
  );
}
