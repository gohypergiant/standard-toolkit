'use client';
import { cn } from '@/lib/utils';
import type { PropsWithChildren } from 'react';
import { createToggleFn } from './toggle-utils';
import type { DrawerAnchor, DrawerToggleProps } from './types';

/**
 * Props interface for the button component returned by the hook.
 * Extends standard button props with children and optional className.
 */
interface ButtonProps extends PropsWithChildren {
  className?: string;
}

/**
 * Configuration object for the useDrawerToggle hook.
 */
interface HookProps extends DrawerToggleProps {
  /** The panel to control (left, right, top, or bottom) */
  drawer: DrawerAnchor;
}

/**
 * useDrawerToggle - Drawer Toggle Hook
 *
 * Custom React hook that creates a reusable Button component for toggling panel states.
 * This hook encapsulates all the logic needed to create accessible, styled toggle buttons
 * that work seamlessly with the layout system's data attribute-driven state management.
 *
 * ## Features:
 * - **State Management**: Automatically handles toggling between specified panel states
 * - **Accessibility**: Includes proper button semantics and descriptive titles
 * - **Styling**: Pre-configured with consistent hover states and visual feedback
 * - **Flexibility**: Returns a customizable Button component that accepts all standard button props
 * - **Type Safety**: Fully typed with generic support for extended button props
 *
 * ## How It Works:
 * 1. Creates a panel-specific toggle function using `createToggleFn`
 * 2. Returns a Button component that calls the toggle function on click
 * 3. Button includes default styling and accessibility attributes
 * 4. Supports custom className and standard button props via spreading
 *
 * ## Usage Examples:
 * ```tsx
 * // Basic usage in a component
 * function MyToggle() {
 *   const Button = useDrawerToggle({
 *     options: ['over-closed', 'over-open'],
 *     panel: 'left'
 *   });
 *
 *   return (
 *     <Button className="my-custom-styles">
 *       <Icon><ChevronRight /></Icon>
 *     </Button>
 *   );
 * }
 *
 * // With custom button props
 * function AdvancedToggle() {
 *   const Button = useDrawerToggle({
 *     options: ['over-icons', 'over-nav'],
 *     panel: 'right'
 *   });
 *
 *   return (
 *     <Button
 *       className="p-md rounded-lg"
 *       disabled={someCondition}
 *       aria-label="Toggle navigation panel"
 *     >
 *       Toggle Panel
 *     </Button>
 *   );
 * }
 * ```
 *
 * ## Component Integration:
 * This hook is the foundation for all pre-configured toggle components in this module.
 * It ensures consistent behavior and styling across all panel toggle interactions.
 *
 * @param options - Configuration object with panel and toggle state options
 * @param options.options - Array of two panel states to toggle between
 * @param options.panel - The panel identifier (left, right, top, bottom)
 * @returns Button component with built-in toggle functionality and styling
 *
 * @example
 * ```tsx
 * // Create a custom bottom toggle
 * const BottomButton = useDrawerToggle({
 *   options: ['over-closed', 'over-open'],
 *   panel: 'bottom'
 * });
 *
 * // Use the returned Button component
 * <BottomButton className="w-full">
 *   <ChevronUpIcon />
 * </BottomButton>
 * ```
 */
export function useDrawerToggle({ options, drawer }: HookProps) {
  const toggleFn = createToggleFn(drawer);

  return <T extends ButtonProps>({ children, className, ...props }: T) => (
    <button
      className={cn(
        'fg-default-dark hover:fg-default-light cursor-pointer hover:bg-surface-overlay',
        className ?? '',
      )}
      onClick={() => {
        toggleFn(options);
      }}
      title={`Toggle ${drawer} drawer`}
      type='button'
      {...props}
    >
      {children}
    </button>
  );
}
