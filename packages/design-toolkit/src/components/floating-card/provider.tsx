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

import { clsx } from '@accelint/design-foundation/lib/utils';
import CloseIcon from '@accelint/icons/cancel';
import PinIcon from '@accelint/icons/pin';
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { Button } from '../button';
import { Divider } from '../divider';
import { Icon } from '../icon';
import { FloatingCardContext, FloatingCardRegistryContext } from './context';
import type { FloatingCardRegistryValue } from './context';
import { useCardLayout } from './hooks/use-card-layout';
import { FloatingCardPanel } from './panel';
import styles from './styles.module.css';
import { resolveMaybeFactory } from './utils';
import type { UniqueId } from '@accelint/core/utility/uuid';
import type {
  Bounds,
  Dimensions,
  FloatingCardContextValue,
  FloatingCardHeaderAction,
  FloatingCardLayout,
  FloatingCardProviderProps,
  Position,
} from './types';

/** Header shown at the start of a card: optional icon plus the title. */
function CardHeaderStart({
  icon,
  title,
}: Readonly<{ icon: React.ReactNode; title: string | undefined }>) {
  return (
    <div className={styles.headerSide}>
      {icon ? <Icon size='small'>{icon}</Icon> : null}
      {title ? (
        <div className={styles.headerTitleContainer}>
          <div className={styles.headerTitle}>{title}</div>
        </div>
      ) : null}
    </div>
  );
}

/** Action buttons for a card, ending in the always-present close button. */
function CardHeaderActions({
  actions,
  id,
  isPinned,
  onClose,
  onTogglePin,
}: Readonly<{
  actions: FloatingCardHeaderAction[] | undefined;
  id: UniqueId;
  isPinned: boolean;
  onClose: () => void;
  onTogglePin: () => void;
}>) {
  return (
    <>
      {actions?.map((action, index) => {
        if (action === 'divider') {
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: Using index as key is acceptable here because the order of actions is unlikely to change.
            <Divider key={`${id}-divider-${index}`} orientation='vertical' />
          );
        }

        if (action === 'pin') {
          return (
            <Button
              aria-label='Pin'
              aria-pressed={isPinned}
              color={isPinned ? 'accent' : undefined}
              // biome-ignore lint/suspicious/noArrayIndexKey: Using index as key is acceptable here because the order of actions is unlikely to change.
              key={`${id}-pin-${index}`}
              onPress={onTogglePin}
              size='small'
              variant='icon'
            >
              <Icon>
                <PinIcon />
              </Icon>
            </Button>
          );
        }

        return (
          <Button
            aria-label={action.label}
            // biome-ignore lint/suspicious/noArrayIndexKey: Using index as key is acceptable here because the order of actions is unlikely to change.
            key={`${id}-action-${index}`}
            onPress={action.onClick}
            size='small'
            variant='icon'
          >
            <Icon>{action.icon}</Icon>
          </Button>
        );
      })}
      <Button aria-label='Close' onPress={onClose} size='small' variant='icon'>
        <Icon>
          <CloseIcon />
        </Icon>
      </Button>
    </>
  );
}

/**
 * Provides a context and layout area for floating cards within the application.
 *
 * Wraps children with floating card context and renders each registered card as
 * a draggable, resizable panel bounded by the provider's own box.
 *
 * @param props - The props for the FloatingCardProvider component.
 * @param props.children - Child components rendered inside the floating card provider.
 * @param props.icon - Optional icon rendered in all card headers (static or factory).
 * @param props.headerActions - Optional action buttons for card headers (static or factory).
 * @param props.initialPinned - Card IDs that start pinned.
 * @param props.bounds - Region cards are confined to. Defaults to `'provider'`.
 * @param props.className - Additional CSS class names for styling.
 * @returns The FloatingCardProvider component that manages floating card layout and context.
 *
 * @remarks
 * - Manages registration and cleanup of floating card DOM references
 * - Exposes closeCard, togglePinCard, and isPinned via context
 * - Cards are bounded within the provider element by default; `bounds='viewport'`
 *   lets them move anywhere on screen
 * - Cards are dragged by their header; pinning a card freezes drag and resize
 *
 * @example
 * ```tsx
 * <FloatingCardProvider
 *   icon={<AppLogo />}
 *   headerActions={[
 *     { icon: <SettingsIcon />, onClick: openSettings },
 *     'divider',
 *     'pin'
 *   ]}
 * >
 *   <FloatingCard id="panel-1" title="My Panel">
 *     <div>Panel content</div>
 *   </FloatingCard>
 * </FloatingCardProvider>
 * ```
 */
export function FloatingCardProvider({
  children,
  icon,
  headerActions,
  initialPinned,
  bounds = 'provider',
  className,
}: FloatingCardProviderProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [cards, setCards] = useState<Record<UniqueId, HTMLDivElement>>({});

  const pinnedRef = useRef<Set<UniqueId>>(new Set(initialPinned));
  const pinListenersRef = useRef<Set<() => void>>(new Set());

  const {
    layouts,
    registerCard,
    unregisterCard,
    moveCard,
    resizeCard,
    bringToFront,
  } = useCardLayout();

  const notifyPinChange = useCallback(() => {
    for (const listener of pinListenersRef.current) {
      listener();
    }
  }, []);

  const isPinned = useCallback((id: UniqueId) => pinnedRef.current.has(id), []);

  const subscribeToPinState = useCallback((callback: () => void) => {
    pinListenersRef.current.add(callback);

    return () => {
      pinListenersRef.current.delete(callback);
    };
  }, []);

  const togglePinCard = useCallback(
    (id: UniqueId) => {
      const next = new Set(pinnedRef.current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      pinnedRef.current = next;
      notifyPinChange();
    },
    [notifyPinChange],
  );

  const removeRef = useCallback(
    (id: UniqueId) => {
      setCards((current) => {
        if (!current[id]) {
          return current;
        }

        const next = { ...current };
        delete next[id];

        return next;
      });

      if (pinnedRef.current.has(id)) {
        const next = new Set(pinnedRef.current);
        next.delete(id);
        pinnedRef.current = next;
        notifyPinChange();
      }
    },
    [notifyPinChange],
  );

  const addRef = useCallback((id: UniqueId, ref: HTMLDivElement | null) => {
    if (!ref) {
      return;
    }

    setCards((current) =>
      current[id] === ref ? current : { ...current, [id]: ref },
    );
  }, []);

  const closeCard = useCallback(
    (id: UniqueId) => {
      unregisterCard(id);
      removeRef(id);
    },
    [removeRef, unregisterCard],
  );

  const getBounds = useCallback((): Bounds => {
    const element = rootRef.current;

    if (!element) {
      return { top: 0, left: 0, right: 0, bottom: 0 };
    }

    const rect = element.getBoundingClientRect();

    if (bounds === 'viewport') {
      // Cards are positioned relative to the provider, so the viewport box is
      // expressed in that coordinate space by subtracting the provider offset.
      return {
        top: -rect.top,
        left: -rect.left,
        right: window.innerWidth - rect.left,
        bottom: window.innerHeight - rect.top,
      };
    }

    return { top: 0, left: 0, right: rect.width, bottom: rect.height };
  }, [bounds]);

  const contextValue = useMemo<FloatingCardContextValue>(
    () => ({
      cards,
      closeCard,
      togglePinCard,
      isPinned,
      subscribeToPinState,
    }),
    [cards, closeCard, togglePinCard, isPinned, subscribeToPinState],
  );

  const registryValue = useMemo<FloatingCardRegistryValue>(
    () => ({ openCard: registerCard, addRef }),
    [registerCard, addRef],
  );

  return (
    <FloatingCardContext.Provider value={contextValue}>
      <FloatingCardRegistryContext.Provider value={registryValue}>
        <div className={clsx(styles.providerRoot, className)} ref={rootRef}>
          {Object.entries(layouts).map(([id, layout]) => (
            <CardPanel
              actions={resolveMaybeFactory(headerActions, id)}
              getBounds={getBounds}
              icon={resolveMaybeFactory(icon, id)}
              id={id as UniqueId}
              isPinned={isPinned}
              key={id}
              layout={layout}
              onAddRef={addRef}
              onClose={closeCard}
              onFocus={bringToFront}
              onMove={moveCard}
              onResize={resizeCard}
              onTogglePin={togglePinCard}
              subscribeToPinState={subscribeToPinState}
            />
          ))}
          {children}
        </div>
      </FloatingCardRegistryContext.Provider>
    </FloatingCardContext.Provider>
  );
}

type CardPanelProps = {
  actions: FloatingCardHeaderAction[] | undefined;
  getBounds: () => Bounds;
  icon: React.ReactNode;
  id: UniqueId;
  isPinned: (id: UniqueId) => boolean;
  layout: FloatingCardLayout;
  onAddRef: (id: UniqueId, ref: HTMLDivElement | null) => void;
  onClose: (id: UniqueId) => void;
  onFocus: (id: UniqueId) => void;
  onMove: (id: UniqueId, position: Position) => void;
  onResize: (id: UniqueId, dimensions: Dimensions, position: Position) => void;
  onTogglePin: (id: UniqueId) => void;
  subscribeToPinState: (callback: () => void) => () => void;
};

/**
 * Binds one card's identity to the provider's callbacks so {@link FloatingCardPanel}
 * can stay a plain presentational component.
 *
 * @remarks
 * Pin state lives in a mutable store rather than React state, so it is read
 * through `useSyncExternalStore` -- only the cards whose pin state changed
 * re-render.
 */
function CardPanel({
  actions,
  getBounds,
  icon,
  id,
  isPinned,
  layout,
  onAddRef,
  onClose,
  onFocus,
  onMove,
  onResize,
  onTogglePin,
  subscribeToPinState,
}: CardPanelProps) {
  const { title } = layout;

  const pinned = useSyncExternalStore(
    subscribeToPinState,
    () => isPinned(id),
    () => false,
  );

  const contentRef = useCallback(
    (element: HTMLDivElement | null) => {
      onAddRef(id, element);
    },
    [id, onAddRef],
  );

  return (
    <FloatingCardPanel
      actions={
        <CardHeaderActions
          actions={actions}
          id={id}
          isPinned={pinned}
          onClose={() => onClose(id)}
          onTogglePin={() => onTogglePin(id)}
        />
      }
      contentRef={contentRef}
      getBounds={getBounds}
      header={<CardHeaderStart icon={icon} title={title} />}
      id={id}
      isPinned={pinned}
      // Ids are typically uuids, which read as noise to a screen reader, so an
      // untitled card gets a generic name instead.
      label={title ?? 'Floating card'}
      layout={layout}
      onFocus={() => onFocus(id)}
      onMove={(position) => onMove(id, position)}
      onResize={(dimensions, position) => onResize(id, dimensions, position)}
    />
  );
}
