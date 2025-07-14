/**
 * @fileoverview Panel Toggle Components
 *
 * Provides pre-configured toggle button components for common panel operations.
 * These components use the usePanelToggle hook to create consistent, accessible
 * toggle buttons with appropriate icons and responsive behavior.
 *
 * ## Features:
 * - **Consistent Styling**: Standardized appearance across all panel toggles
 * - **Responsive Icons**: Icons change based on current panel state
 * - **Accessibility**: Proper ARIA attributes and semantic button elements
 * - **Layout Integration**: Works seamlessly with the layout system's data attributes
 *
 * @requires 'client-only' - These components must run in the browser environment
 * @see {@link usePanelToggle} - The underlying hook that provides toggle functionality
 */

import 'client-only';
import type { PanelLabel, PanelState } from './config';
import { LAYOUT_SELECTOR } from './config';

/**
 * Pre-configured toggle function for the bottom panel.
 * Provides direct programmatic control over bottom panel state.
 */
export const toggleBottomPanel = createToggleFn('bottom');

/**
 * Pre-configured toggle function for the top panel.
 * Provides direct programmatic control over top panel state.
 */
export const toggleTopPanel = createToggleFn('top');

/**
 * Pre-configured toggle function for the left panel.
 * Provides direct programmatic control over left panel state.
 */
export const toggleLeftPanel = createToggleFn('left');

/**
 * Pre-configured toggle function for the right panel.
 * Provides direct programmatic control over right panel state.
 */
export const toggleRightPanel = createToggleFn('right');

/**
 * Creates a toggle function for a specific panel.
 *
 * This factory function generates panel-specific toggle functions that can
 * programmatically control panel states by manipulating data attributes on
 * the layout container element.
 *
 * ## Behavior:
 * - **State Cycling**: Toggles between the two provided states
 * - **Simple Logic**: If current state matches first state, switches to second; otherwise switches to first
 * - **DOM Integration**: Directly manipulates layout container data attributes
 *
 * ## Usage:
 * ```tsx
 * // Create a toggle function
 * const toggleLeft = createToggleFn('left');
 *
 * // Toggle between states
 * toggleLeft(['over-closed', 'over-open']);
 * ```
 *
 * @param panel - The panel identifier (left, right, top, bottom)
 * @returns Toggle function that accepts a state array with two states
 */
export function createToggleFn(panel: PanelLabel) {
  return ([a, b]: [PanelState, PanelState]) => {
    const container = document.querySelector(LAYOUT_SELECTOR) as HTMLElement;
    const current = container?.dataset[panel]?.match(/\w+-(\w+)/)?.at(1);

    if (container?.dataset[panel]) {
      if (current) {
        container.setAttribute(
          `data-${panel}`,
          container?.dataset[panel].replace(current, current === a ? b : a),
        );
      } else {
        // not sure how this would happen but better to be safe I guess
        container.setAttribute(`data-${panel}`, a);
      }
    } else {
      throw new Error(
        `The layout has no panel state defined for "data-${panel}"`,
      );
    }
  };
}
