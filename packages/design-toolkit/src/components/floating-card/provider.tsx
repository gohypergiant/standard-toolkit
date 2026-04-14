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
  type DockviewApi,
  DockviewReact,
  type DockviewReadyEvent,
  type IDockviewHeaderActionsProps,
  type IDockviewPanelProps,
} from 'dockview-react';
import {
  type FunctionComponent,
  type PropsWithChildren,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Button } from '../button';
import { Divider } from '../divider';
import { Icon } from '../icon';
import {
  FloatingCardContext,
  type FloatingCardContextValue,
  useFloatingCard,
} from './context';
import styles from './styles.module.css';
import type { UniqueId } from '@accelint/core/utility/uuid';

/**
 * A value that can be static or dynamically computed per floating card.
 *
 * Enables per-card customization of props by passing a factory function
 * that receives the card ID and returns the appropriate value.
 *
 * @template T - The type of the static value or factory return type.
 */
type MaybeFactory<T> = T | ((cardId: string) => T);

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
type FloatingCardHeaderProps = {
  /** ID of the active floating card panel */
  id?: string;
  /** Title text displayed in the header */
  title?: string;
  /** Optional icon displayed at the start of the header */
  icon?: ReactNode;
  /** Callback to close the entire card group */
  closeGroup: () => void;
  /** Toggles pin state for the specified card */
  togglePinCard: (id: UniqueId) => void;
  /** Checks if the specified card is pinned */
  isPinned: (id: UniqueId) => boolean;
  /** Custom action buttons to render in the header */
  headerActions?: FloatingCardHeaderAction[];
};

/**
 * Internal component that registers a DOM ref for a card container.
 *
 * Used by the floating card engine to mount portal targets. Also manages
 * the data-pinned attribute on the resize container to control drag handle visibility.
 *
 * @param props - Dockview panel props containing the card ID.
 */
function FloatingCardContainer(props: Readonly<IDockviewPanelProps>) {
  const { addRef, isPinned } = useFloatingCard();
  const cardId = props.api.id as UniqueId;
  const pinned = isPinned(cardId);

  const cardRef = useRef<HTMLDivElement | null>(null);

  const refCallback = useCallback(
    (ref: HTMLDivElement | null) => {
      cardRef.current = ref;
      addRef(cardId, ref);
    },
    [addRef, cardId],
  );

  // Toggle a data-pinned attribute on the ancestor .dv-resize-container
  // so CSS can disable pointer-events on the drag handle.
  useEffect(() => {
    const el = cardRef.current;
    const container = el?.closest<HTMLElement>('.dv-resize-container');

    if (!container) {
      return;
    }

    if (pinned) {
      container.dataset.pinned = '';
    } else {
      delete container.dataset.pinned;
    }
  }, [pinned]);

  return <div className={styles.cardContent} ref={refCallback} />;
}

/**
 * Default left header showing an optional custom icon and the card's title.
 */
function DefaultLeftHeader({
  title,
  icon,
  id,
}: Readonly<FloatingCardHeaderProps>) {
  return (
    <div className={styles.headerSide}>
      {icon ? <Icon size='small'>{icon}</Icon> : null}
      {title && title !== id ? (
        <div className={styles.headerTitle}>{title}</div>
      ) : null}
    </div>
  );
}

/**
 * Default right header showing optional action buttons and an always-present close button.
 *
 * @remarks Handles rendering of 'divider' and 'pin' action types specially.
 */
function DefaultRightHeader({
  closeGroup,
  headerActions,
  id,
  togglePinCard,
  isPinned,
}: Readonly<FloatingCardHeaderProps>) {
  const pinned = id ? isPinned(id as UniqueId) : false;

  return (
    <div className={styles.headerSide}>
      {headerActions?.map((action, index) => {
        if (action === 'divider') {
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: Using index as key is acceptable here because the order of actions is unlikely to change.
            <Divider key={`${id}-divider-${index}`} orientation='vertical' />
          );
        }
        if (action === 'pin') {
          return (
            <Button
              className={styles.pinButton}
              // biome-ignore lint/suspicious/noArrayIndexKey: Using index as key is acceptable here because the order of actions is unlikely to change.
              key={`${id}-pin-${index}`}
              variant='icon'
              size='small'
              color={pinned ? 'accent' : undefined}
              onClick={() => {
                if (id) {
                  togglePinCard(id as UniqueId);
                }
              }}
            >
              <Icon>
                <PinIcon />
              </Icon>
            </Button>
          );
        }
        return (
          <Button
            key={`${id}-${
              // biome-ignore lint/suspicious/noArrayIndexKey: Using index as key is acceptable here because the order of actions is unlikely to change.
              index
            }`}
            variant='icon'
            size='small'
            onClick={action.onClick}
          >
            <Icon>{action.icon}</Icon>
          </Button>
        );
      })}
      <Button variant='icon' size='small' onClick={closeGroup}>
        <Icon>
          <CloseIcon />
        </Icon>
      </Button>
    </div>
  );
}

type HeaderAdapterOptions = {
  icon?: MaybeFactory<ReactNode>;
  headerActions?: MaybeFactory<FloatingCardHeaderProps['headerActions']>;
  togglePinCard: (id: UniqueId) => void;
  isPinned: (id: UniqueId) => boolean;
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
function createHeaderAdapter(
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
      />
    );
  }

  HeaderAdapter.displayName = `HeaderAdapter(${Component.displayName ?? Component.name ?? 'Anonymous'})`;
  return HeaderAdapter;
}

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
    /** Additional CSS class names for styling */
    className?: string;
  }>
>;

const components: Record<string, FunctionComponent<IDockviewPanelProps>> = {
  default: FloatingCardContainer,
};

/**
 * Provides a context and layout area for floating cards within the application.
 *
 * Wraps children with floating card context and renders a Dockview instance to manage
 * docking, dragging, and layout of floating cards.
 *
 * @param props - The props for the FloatingCardProvider component.
 * @param props.children - Child components rendered inside the floating card provider.
 * @param props.icon - Optional icon rendered in all card headers (static or factory).
 * @param props.headerActions - Optional action buttons for card headers (static or factory).
 * @param props.className - Additional CSS class names for styling.
 * @returns The FloatingCardProvider component that manages floating card layout and context.
 *
 * @remarks
 * - Manages registration and cleanup of floating card DOM references
 * - Exposes closeCard, togglePinCard, and isPinned via context
 * - Automatically cleans up refs when cards are removed via any path (drag close, group close, API close)
 * - Cards are bounded within the viewport
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
  className,
}: FloatingCardProviderProps) {
  const [api, setApi] = useState<DockviewApi | null>(null);
  const [cards, setCards] = useState<Record<UniqueId, HTMLDivElement>>({});
  const [pinnedCards, setPinnedCards] = useState<Set<UniqueId>>(new Set());

  const closeCard = useCallback(
    (id: UniqueId) => {
      api?.getPanel(id)?.api.close();
    },
    [api],
  );

  const togglePinCard = useCallback((id: UniqueId) => {
    setPinnedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const isPinned = useCallback(
    (id: UniqueId) => pinnedCards.has(id),
    [pinnedCards],
  );

  const removeRef = useCallback((view: UniqueId) => {
    setCards((prev) => {
      const newCards = { ...prev };
      delete newCards[view];
      return newCards;
    });
    setPinnedCards((prev) => {
      if (!prev.has(view)) {
        return prev;
      }
      const next = new Set(prev);
      next.delete(view);
      return next;
    });
  }, []);

  const addRef = useCallback((id: UniqueId, ref: HTMLDivElement | null) => {
    if (ref) {
      setCards((prev) => {
        if (prev[id]) {
          return prev;
        }
        return { ...prev, [id]: ref };
      });
    }
  }, []);

  // Clean up stale refs when cards are removed via any path
  // (drag close, group close, API close, etc.)
  useEffect(() => {
    if (!api) {
      return;
    }

    const disposable = api.onDidRemovePanel((event) => {
      removeRef(event.id as UniqueId);
    });

    return () => {
      disposable.dispose();
    };
  }, [api, removeRef]);

  const contextValue = useMemo<FloatingCardContextValue>(
    () => ({
      cards,
      addRef,
      removeRef,
      closeCard,
      togglePinCard,
      isPinned,
      api,
    }),
    [cards, closeCard, removeRef, api, addRef, togglePinCard, isPinned],
  );

  const leftAdapter = useMemo(
    () =>
      createHeaderAdapter(DefaultLeftHeader, {
        icon,
        togglePinCard,
        isPinned,
      }),
    [icon, togglePinCard, isPinned],
  );

  const rightAdapter = useMemo(
    () =>
      createHeaderAdapter(DefaultRightHeader, {
        headerActions,
        togglePinCard,
        isPinned,
      }),
    [headerActions, togglePinCard, isPinned],
  );

  const theme = useMemo(
    () => ({
      name: 'accelint',
      className: styles.floatingCardProvider ?? '',
    }),
    [],
  );

  const onReady = useCallback((event: DockviewReadyEvent) => {
    setApi(event.api);
  }, []);

  return (
    <FloatingCardContext.Provider value={contextValue}>
      <div className={clsx(styles.providerRoot, className)}>
        <DockviewReact
          locked
          floatingGroupBounds={'boundedWithinViewport'}
          components={components}
          prefixHeaderActionsComponent={leftAdapter}
          rightHeaderActionsComponent={rightAdapter}
          onReady={onReady}
          theme={theme}
        />
        {children}
      </div>
    </FloatingCardContext.Provider>
  );
}
