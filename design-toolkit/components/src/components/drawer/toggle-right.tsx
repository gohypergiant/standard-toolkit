'use client';
import { Icon } from '../icon';
import { ChevronLeft, ChevronRight } from '@accelint/icons';
import { usePanelToggle } from './use-panel-toggle';
import type { PanelToggleProps } from './panel-toggle-props';

/**
 * PanelToggleRight - Configurable Right Panel Toggle
 *
 * Flexible toggle button for the right panel that accepts custom panel state options.
 * Provides visual feedback through directional chevron icons that reflect the current
 * panel state and indicate the next action available to the user.
 *
 * ## Common Usage Patterns:
 * ```tsx
 * // Basic open/close toggle
 * <PanelToggleRight options={['over-closed', 'over-open']} />
 *
 * // Icons/navigation toggle for compact mode
 * <PanelToggleRight options={['over-icons', 'over-nav']} />
 *
 * // Push mode toggle for layout shifting
 * <PanelToggleRight options={['push-closed', 'push-open']} />
 *
 * // In right panel menu with tools
 * <PanelMenuForRightPanel>
 *   <PanelToggleRight options={['over-closed', 'over-xl']} />
 *   // ...
 * </PanelMenuForRightPanel>
 * ```
 *
 * ## Integration:
 * Typically used within drawer menu areas, toolbar components, or directly in
 * the right panel to provide user control over panel visibility and behavior.
 *
 * @param options - Two-element array of panel states to toggle between
 */
export function PanelToggleRight({ options }: PanelToggleProps) {
  const Button = usePanelToggle({ options, panel: 'right' });

  return (
    <Button className='flex w-full items-center justify-center p-xs text-center'>
      <Icon>
        <ChevronLeft className='hidden group-data-[right*=closed]/layout:block group-data-[right*=icons]/layout:block group-data-[right*=xl]/layout:block' />
        <ChevronRight className='hidden group-data-[right*=nav]/layout:block group-data-[right*=open]/layout:block' />
      </Icon>
    </Button>
  );
}
