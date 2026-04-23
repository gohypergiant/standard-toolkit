/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import type { UniqueId } from '@accelint/core/utility/uuid';
import type { DockviewApi } from 'dockview-react';
import type { PropsWithChildren, ReactNode } from 'react';

/**
 * A value that can be static or dynamically computed per floating card.
 *
 * Enables per-card customization of props by passing a factory function
 * that receives the card ID and returns the appropriate value.
 *
 * @template T - The type of the static value or factory return type.
 */
export type MaybeFactory<T> = T | ((cardId: string) => T);

/**
 * Context value providing floating card management functionality.
 *
 * @remarks
 * Exposed via FloatingCardProvider to child components. Use useFloatingCard() hook to access.
 */
export type FloatingCardContextValue = {
  /** Registry mapping card IDs to their rendered DOM containers */
  cards: Record<UniqueId, HTMLDivElement>;

  /** Registers a DOM ref for a card container after it mounts */
  addRef: (id: UniqueId, ref: HTMLDivElement | null) => void;

  /** Unregisters a card's DOM ref when it's removed */
  removeRef: (view: UniqueId) => void;

  /** Programmatically closes a floating card by ID */
  closeCard: (id: UniqueId) => void;

  /** Toggles pin state for a floating card, disabling drag when pinned */
  togglePinCard: (id: UniqueId) => void;

  /** Checks if a floating card is currently pinned */
  isPinned: (id: UniqueId) => boolean;

  /** Subscribes to pin state changes; returns an unsubscribe function */
  subscribeToPinState: (callback: () => void) => () => void;

  /** Dockview API instance, null until FloatingCardProvider's onReady fires */
  api: DockviewApi | null;
};

/**
 * Props for the FloatingCard component.
 *
 * @example
 * ```tsx
 * const props: FloatingCardProps = {
 *   id: 'panel-123' as UniqueId,
 *   title: 'My Panel',
 *   isOpen: true,
 *   initialDimensions: { width: 350, height: 450 }
 * };
 * ```
 */
export type FloatingCardProps = Readonly<{
  /** Unique identifier for the floating card */
  id: UniqueId;
  /** Optional title displayed in the floating card header */
  title?: string;
  /**
   * Controls whether the floating card is rendered.
   *
   * When `true`, the card registers with the floating card engine and renders its
   * children via a portal. When `false`, the card is closed and removed.
   *
   * @defaultValue true
   */
  isOpen?: boolean;
  /**
   * Initial dimensions of the floating card panel.
   *
   * @defaultValue { width: 300, height: 400 }
   */
  initialDimensions?: Readonly<{ width: number; height: number }>;
  /**
   * Initial position of the floating card panel.
   *
   * When provided, sets the x and y coordinates of the floating card.
   */
  initialPosition?: Readonly<{ x: number; y: number }>;
}>;

/**
 * Configuration for header action buttons in floating cards.
 *
 * Can be a custom button (with icon and onClick), a visual separator ('divider'),
 * or the built-in pin toggle ('pin').
 *
 * @remarks
 * - Custom buttons: Rendered as icon buttons with your provided onClick handler
 * - 'divider': Inserts a vertical divider between action groups
 * - 'pin': Adds built-in pin toggle button (disables dragging when pinned)
 *
 * @example
 * ```tsx
 * const headerActions: FloatingCardHeaderAction[] = [
 *   { icon: <SettingsIcon />, onClick: () => openSettings() },
 *   'divider',
 *   'pin'
 * ];
 * ```
 */
export type FloatingCardHeaderAction =
  | {
      /** Icon to display in the action button */
      icon: ReactNode;
      /** Handler called when the action button is clicked */
      onClick: () => void;
    }
  | 'divider'
  | 'pin';

/**
 * Props passed to floating card header components.
 *
 * @remarks Internal type used by header adapters to map Dockview props to custom header components.
 */
export type FloatingCardHeaderProps = {
  /** ID of the active floating card panel */
  id?: string;
  /** Title text displayed in the header */
  title?: string;
  /** Optional icon displayed at the start of the header */
  icon?: ReactNode;
  /** Callback to close the entire card group */
  closeGroup: () => void;
  /** Toggles pin state for the specified card */
  togglePinCard?: (id: UniqueId) => void;
  /** Checks if the specified card is pinned */
  isPinned?: (id: UniqueId) => boolean;
  /** Subscribes to pin state changes; returns an unsubscribe function */
  subscribeToPinState?: (callback: () => void) => () => void;
  /** Custom action buttons to render in the header */
  headerActions?: FloatingCardHeaderAction[];
};

/**
 * Props for the FloatingCardProvider component.
 *
 * Configures default icon and header actions for all floating cards. Both can be
 * static values or factory functions that receive the card ID for per-card customization.
 *
 * @example
 * ```tsx
 * <FloatingCardProvider
 *   icon={<AppIcon />}
 *   headerActions={(cardId) => {
 *     if (cardId === 'settings') {
 *       return [{ icon: <CogIcon />, onClick: openSettings }, 'pin'];
 *     }
 *     return ['pin'];
 *   }}
 * >
 *   {children}
 * </FloatingCardProvider>
 * ```
 */
export type FloatingCardProviderProps = Readonly<
  PropsWithChildren<{
    /**
     * Optional icon rendered at the very start of the floating card header.
     * Can be a `ReactNode` or a function `(cardId: string) => ReactNode`.
     */
    icon?: MaybeFactory<ReactNode>;
    /**
     * Optional action buttons rendered in the floating card header before the close button.
     * Can include `'divider'` to separate groups and `'pin'` to add a pin toggle button.
     * Can be an array or a function `(cardId: string) => array` to return
     * per-floating card actions.
     */
    headerActions?: MaybeFactory<FloatingCardHeaderAction[]>;
    /**
     * Optional set of card IDs that should be pinned when the provider first mounts.
     *
     * Like other `initial*` props, this value is only read once at mount time.
     * Changes after mount have no effect.
     */
    initialPinned?: readonly UniqueId[];
    /** Additional CSS class names for styling */
    className?: string;
  }>
>;

export type HeaderAdapterOptions = {
  icon?: MaybeFactory<ReactNode>;
  headerActions?: MaybeFactory<FloatingCardHeaderProps['headerActions']>;
  togglePinCard?: (id: UniqueId) => void;
  isPinned?: (id: UniqueId) => boolean;
  subscribeToPinState?: (callback: () => void) => () => void;
};
