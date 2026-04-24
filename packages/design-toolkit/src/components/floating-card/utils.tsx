// __private-exports
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

import {
  type FunctionComponent,
  type ReactNode,
  useEffect,
  useState,
} from 'react';
import type { UniqueId } from '@accelint/core/utility/uuid';
import type { IDockviewHeaderActionsProps } from 'dockview-react';
import type { FloatingCardHeaderAction } from './types';

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
 * Configuration options passed to floating card header adapter functions.
 *
 * Used internally by the floating card system to provide header components
 * with the necessary props and callbacks for rendering customizable headers.
 *
 * @remarks
 * This type is primarily used when creating custom header adapters that need
 * access to icon, actions, and pin state management from the FloatingCardProvider.
 *
 * @example
 * ```tsx
 * function createHeaderAdapter(options: HeaderAdapterOptions) {
 *   return (props: DockviewHeaderProps) => {
 *     const icon = typeof options.icon === 'function'
 *       ? options.icon(props.id)
 *       : options.icon;
 *     const actions = typeof options.headerActions === 'function'
 *       ? options.headerActions(props.id)
 *       : options.headerActions;
 *
 *     return (
 *       <CustomHeader
 *         icon={icon}
 *         actions={actions}
 *         isPinned={options.isPinned?.(props.id)}
 *         onTogglePin={() => options.togglePinCard?.(props.id)}
 *       />
 *     );
 *   };
 * }
 * ```
 */
type HeaderAdapterOptions = {
  icon?: MaybeFactory<ReactNode>;
  headerActions?: MaybeFactory<FloatingCardHeaderProps['headerActions']>;
  togglePinCard?: (id: UniqueId) => void;
  isPinned?: (id: UniqueId) => boolean;
  subscribeToPinState?: (callback: () => void) => () => void;
};

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
 * Creates an adapter component to map Dockview's header action props to custom header component props.
 *
 * Handles title change subscriptions and resolves MaybeFactory options (icon, headerActions)
 * either as static values or by invoking factory functions with the active card ID.
 *
 * @param Component - The header component to wrap.
 * @param options - Configuration options including icon and headerActions (static or factory).
 * @returns Adapter component compatible with Dockview's header API.
 */
export function createHeaderAdapter(
  Component: FunctionComponent<FloatingCardHeaderProps>,
  options: HeaderAdapterOptions,
): FunctionComponent<IDockviewHeaderActionsProps> {
  function HeaderAdapter(props: Readonly<IDockviewHeaderActionsProps>) {
    const panelId = props.panels[0]?.id ?? '';
    const [title, setTitle] = useState(props.activePanel?.title);

    useEffect(() => {
      const panel = props.activePanel;

      if (!panel) {
        return;
      }

      setTitle(panel.title);

      const disposable = panel.api.onDidTitleChange(() => {
        setTitle(panel.title);
      });

      return () => {
        disposable.dispose();
      };
    }, [props.activePanel]);
    const icon = props.activePanel
      ? typeof options?.icon === 'function'
        ? options.icon(panelId)
        : options?.icon
      : undefined;
    const headerActions =
      typeof options?.headerActions === 'function'
        ? options.headerActions(panelId)
        : options?.headerActions;
    return (
      <Component
        icon={icon}
        headerActions={headerActions}
        title={title}
        id={props.activePanel?.id}
        closeGroup={() => props.api.close()}
        togglePinCard={options.togglePinCard}
        isPinned={options.isPinned}
        subscribeToPinState={options.subscribeToPinState}
      />
    );
  }

  HeaderAdapter.displayName = `HeaderAdapter(${Component.displayName ?? Component.name ?? 'Anonymous'})`;
  return HeaderAdapter;
}
