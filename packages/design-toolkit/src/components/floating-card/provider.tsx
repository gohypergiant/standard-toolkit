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
import { Button } from '@accelint/design-toolkit/components/button';
import { Icon } from '@accelint/design-toolkit/components/icon';
import CloseIcon from '@accelint/icons/cancel';
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
  useState,
} from 'react';
import { Divider } from '../divider';
import {
  FloatingCardContext,
  type FloatingCardContextValue,
  useFloatingCard,
} from './context';
import styles from './styles.module.css';
import type { UniqueId } from '@accelint/core/utility/uuid';

/** A value that is either `T` directly, or a function that receives the active card id and returns `T`. */
type MaybeFactory<T> = T | ((cardId: string) => T);

type FloatingCardHeaderProps = {
  id?: string;
  title?: string;
  icon?: ReactNode;
  closeGroup: () => void;
  headerActions?: (
    | {
        icon: ReactNode;
        onClick: () => void;
      }
    | 'divider'
  )[];
};

/**
 * Internal component that registers a DOM ref for a card container.
 * Used by the floating card engine to mount portal targets.
 */
function FloatingCardContainer(props: Readonly<IDockviewPanelProps>) {
  const { addRef } = useFloatingCard();

  const refCallback = useCallback(
    (ref: HTMLDivElement | null) => {
      addRef(props.api.id as UniqueId, ref);
    },
    [addRef, props.api.id],
  );

  return <div className={styles.cardContent} ref={refCallback} />;
}

/**
 * Default left header showing an optional custom icon (or a placeholder) and the card's title.
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
 */
function DefaultRightHeader({
  closeGroup,
  headerActions,
  id,
}: Readonly<FloatingCardHeaderProps>) {
  return (
    <div className={styles.headerSide}>
      {headerActions?.map((action, index) => {
        if (action === 'divider') {
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: Using index as key is acceptable here because the order of actions is unlikely to change.
            <Divider key={`${id}-divider-${index}`} orientation='vertical' />
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
};

/**
 * Creates an adapter component to map Dockview's header action props to our custom header component props.
 */
function createHeaderAdapter(
  Component: FunctionComponent<FloatingCardHeaderProps>,
  options?: HeaderAdapterOptions,
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
      />
    );
  }

  HeaderAdapter.displayName = `HeaderAdapter(${Component.displayName ?? Component.name ?? 'Anonymous'})`;
  return HeaderAdapter;
}

export type FloatingCardProviderProps = Readonly<
  PropsWithChildren<{
    /**
     * Optional icon rendered at the very start of the floating card header.
     * Can be a `ReactNode` or a function `(cardId: string) => ReactNode`.
     */
    icon?: MaybeFactory<ReactNode>;
    /**
     * Optional action buttons rendered in the floating card header before the close button.
     * Can include dividers to separate groups of actions.
     * Can be an array or a function `(cardId: string) => array` to return
     * per-floating card actions.
     */
    headerActions?: MaybeFactory<
      (
        | {
            icon: ReactNode;
            onClick: () => void;
          }
        | 'divider'
      )[]
    >;
    className?: string;
  }>
>;

const components: Record<string, FunctionComponent<IDockviewPanelProps>> = {
  default: FloatingCardContainer,
};

/**
 * Provides a context and layout area for floating cards within the application.
 *
 * Wraps its children with floating card context and renders a floating card engine instance
 * to manage docking and layout.
 *
 * @param props - The props for the FloatingCardProvider component.
 * @param props.children - Child components rendered inside the floating card provider.
 * @param props.icon - Optional icon.
 * @param props.headerActions - Optional actions for the header.
 * @param props.className - Additional CSS class names for styling.
 *
 * @returns The FloatingCardProvider component that manages floating card layout and context.
 *
 * @remarks
 * - Manages registration and unregistration of floating card references.
 * - Exposes `closeCard` via context for child components.
 * - Ensures floating cards are bounded within the viewport.
 */
export function FloatingCardProvider({
  children,
  icon,
  headerActions,
  className,
}: FloatingCardProviderProps) {
  const [api, setApi] = useState<DockviewApi | null>(null);
  const [cards, setCards] = useState<Record<UniqueId, HTMLDivElement>>({});

  const closeCard = useCallback(
    (id: UniqueId) => {
      api?.getPanel(id)?.api.close();
    },
    [api],
  );

  const removeRef = useCallback((view: UniqueId) => {
    setCards((prev) => {
      const newCards = { ...prev };
      delete newCards[view];
      return newCards;
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
      api,
    }),
    [cards, closeCard, removeRef, api, addRef],
  );

  const leftAdapter = useMemo(
    () => createHeaderAdapter(DefaultLeftHeader, { icon }),
    [icon],
  );

  const rightAdapter = useMemo(
    () => createHeaderAdapter(DefaultRightHeader, { headerActions }),
    [headerActions],
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
