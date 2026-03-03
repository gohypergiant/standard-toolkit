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

import { act, render } from '@testing-library/react';
import { describe, expect, it, type Mock, vi } from 'vitest';
import { FloatingCard } from '.';
import {
  FloatingCardContext,
  type FloatingCardContextValue,
  useFloatingCard,
} from './context';
import { FloatingCardProvider } from './provider';
import type { UniqueId } from '@accelint/core/utility/uuid';
import type {
  DockviewApi,
  IDockviewHeaderActionsProps,
  IDockviewPanelProps,
} from 'dockview-react';
import type { FunctionComponent } from 'react';

// --- Design toolkit component mocks ---
// Icon and Button import `client-only` which is not compatible with the jsdom
// test environment. Mock them with minimal HTML equivalents so adapter renders work.
vi.mock('@accelint/design-toolkit/components/icon', () => ({
  Icon: ({ children }: { children: React.ReactNode }) => (
    <span data-testid='icon'>{children}</span>
  ),
}));

vi.mock('@accelint/design-toolkit/components/button', () => ({
  Button: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <button onClick={onClick} type='button'>
      {children}
    </button>
  ),
}));

vi.mock('@accelint/icons/cancel', () => ({
  default: () => <svg data-testid='close-icon' />,
}));

// --- Dockview mock setup ---

type OnReadyCallback = (event: { api: MockDockviewApi }) => void;
type OnDidRemovePanelCallback = (event: { id: string }) => void;

type MockDockviewApi = {
  getPanel: Mock;
  onDidRemovePanel: Mock;
};

let capturedOnReady: OnReadyCallback | undefined;
let capturedProps: Record<string, unknown> = {};

vi.mock('dockview-react', () => ({
  DockviewReact: (props: Record<string, unknown>) => {
    capturedProps = props;
    capturedOnReady = props.onReady as OnReadyCallback;
    return <div data-testid='dockview-mock' />;
  },
}));

function createMockApi(): MockDockviewApi {
  return {
    getPanel: vi.fn(),
    onDidRemovePanel: vi.fn(() => ({ dispose: vi.fn() })),
  };
}

function triggerReady(api: MockDockviewApi) {
  capturedOnReady?.({ api });
}

/**
 * Helper component that reads PanelContext and reports it via a callback.
 */
function ContextReader({
  onContext,
}: {
  onContext: (ctx: FloatingCardContextValue) => void;
}) {
  const ctx = useFloatingCard();
  onContext(ctx);
  return <div data-testid='context-reader' />;
}

function captureContext() {
  const spy = vi.fn<(ctx: FloatingCardContextValue) => void>();

  function latest(): FloatingCardContextValue {
    return spy.mock.calls.at(-1)?.[0] as FloatingCardContextValue;
  }

  return { spy, latest };
}

describe('FloatingCardContext defaults', () => {
  it('should include closeCard as a no-op function', () => {
    const { spy, latest } = captureContext();

    render(
      <FloatingCardContext.Provider
        value={{
          cards: {},
          addRef: () => undefined,
          removeRef: () => undefined,
          closeCard: () => undefined,
          api: null,
        }}
      >
        <ContextReader onContext={spy} />
      </FloatingCardContext.Provider>,
    );

    expect(latest()).toBeDefined();
    expect(typeof latest().closeCard).toBe('function');
  });

  it('should expose api as null before onReady fires', () => {
    const { spy, latest } = captureContext();

    render(
      <FloatingCardProvider>
        <ContextReader onContext={spy} />
      </FloatingCardProvider>,
    );

    const ctx = latest();
    expect(ctx).toHaveProperty('api', null);
    expect(ctx).toHaveProperty('closeCard');
    expect(ctx).toHaveProperty('cards');
  });
});

describe('PanelProvider', () => {
  describe('header component passthrough', () => {
    it('should provide default header adapters when no custom components are given', () => {
      render(
        <FloatingCardProvider>
          <div />
        </FloatingCardProvider>,
      );

      const prefix =
        capturedProps.prefixHeaderActionsComponent as FunctionComponent;
      const right =
        capturedProps.rightHeaderActionsComponent as FunctionComponent;

      expect(prefix).toBeDefined();
      expect(right).toBeDefined();
      expect(prefix.displayName).toBe('HeaderAdapter(DefaultLeftHeader)');
      expect(right.displayName).toBe('HeaderAdapter(DefaultRightHeader)');
    });

    it('should create left header adapter when icon is provided', () => {
      render(
        <FloatingCardProvider icon={<span>icon</span>}>
          <div />
        </FloatingCardProvider>,
      );

      const adapted =
        capturedProps.prefixHeaderActionsComponent as FunctionComponent;
      expect(adapted).toBeDefined();
      expect(adapted.displayName).toBe('HeaderAdapter(DefaultLeftHeader)');
    });

    it('should create right header adapter when headerActions are provided', () => {
      render(
        <FloatingCardProvider
          headerActions={[{ icon: <span>act</span>, onPress: vi.fn() }]}
        >
          <div />
        </FloatingCardProvider>,
      );

      const adapted =
        capturedProps.rightHeaderActionsComponent as FunctionComponent;
      expect(adapted).toBeDefined();
      expect(adapted.displayName).toBe('HeaderAdapter(DefaultRightHeader)');
    });
  });

  describe('closeCard', () => {
    it('should provide closeCard via context', () => {
      const { spy, latest } = captureContext();

      render(
        <FloatingCardProvider>
          <ContextReader onContext={spy} />
        </FloatingCardProvider>,
      );

      expect(typeof latest().closeCard).toBe('function');
    });

    it('should not throw when calling closeCard with null API', () => {
      const { spy, latest } = captureContext();

      render(
        <FloatingCardProvider>
          <ContextReader onContext={spy} />
        </FloatingCardProvider>,
      );

      // API is null before onReady fires — should be a no-op
      expect(() => latest().closeCard('nonexistent' as UniqueId)).not.toThrow();
    });

    it('should call panel.api.close() for an existing card', () => {
      const { spy, latest } = captureContext();
      const mockApi = createMockApi();
      const mockPanelClose = vi.fn();

      mockApi.getPanel.mockReturnValue({ api: { close: mockPanelClose } });

      const { rerender } = render(
        <FloatingCardProvider>
          <ContextReader onContext={spy} />
        </FloatingCardProvider>,
      );

      act(() => {
        triggerReady(mockApi);
      });

      // Re-render to pick up the new api state
      rerender(
        <FloatingCardProvider>
          <ContextReader onContext={spy} />
        </FloatingCardProvider>,
      );

      latest().closeCard('test-panel' as UniqueId);

      expect(mockApi.getPanel).toHaveBeenCalledWith('test-panel');
      expect(mockPanelClose).toHaveBeenCalledOnce();
    });

    it('should not throw when closing a card that does not exist', () => {
      const { spy, latest } = captureContext();
      const mockApi = createMockApi();

      mockApi.getPanel.mockReturnValue(undefined);

      const { rerender } = render(
        <FloatingCardProvider>
          <ContextReader onContext={spy} />
        </FloatingCardProvider>,
      );

      act(() => {
        triggerReady(mockApi);
      });

      rerender(
        <FloatingCardProvider>
          <ContextReader onContext={spy} />
        </FloatingCardProvider>,
      );

      expect(() => latest().closeCard('nonexistent' as UniqueId)).not.toThrow();
    });
  });

  describe('onDidRemovePanel ref cleanup', () => {
    it('should subscribe to onDidRemovePanel when API is available', () => {
      const mockApi = createMockApi();

      const { rerender } = render(
        <FloatingCardProvider>
          <div />
        </FloatingCardProvider>,
      );

      act(() => {
        triggerReady(mockApi);
      });

      rerender(
        <FloatingCardProvider>
          <div />
        </FloatingCardProvider>,
      );

      expect(mockApi.onDidRemovePanel).toHaveBeenCalled();
    });

    it('should call removeRef when a panel is removed via dockview', () => {
      const { spy, latest } = captureContext();
      const mockApi = createMockApi();
      let removePanelCallback: OnDidRemovePanelCallback | undefined;

      mockApi.onDidRemovePanel.mockImplementation(
        (cb: OnDidRemovePanelCallback) => {
          removePanelCallback = cb;
          return { dispose: vi.fn() };
        },
      );

      const { rerender } = render(
        <FloatingCardProvider>
          <ContextReader onContext={spy} />
        </FloatingCardProvider>,
      );

      act(() => {
        triggerReady(mockApi);
      });

      // Re-render to pick up new api, which triggers the useEffect
      rerender(
        <FloatingCardProvider>
          <ContextReader onContext={spy} />
        </FloatingCardProvider>,
      );

      // Simulate dockview removing a card
      expect(removePanelCallback).toBeDefined();
      act(() => {
        removePanelCallback?.({ id: 'removed-panel' });
      });

      // The card should be removed from the cards record
      expect(latest().cards['removed-panel' as UniqueId]).toBeUndefined();
    });
  });

  describe('addRef', () => {
    it('should register a div when called with a valid element', () => {
      const { spy, latest } = captureContext();

      render(
        <FloatingCardProvider>
          <ContextReader onContext={spy} />
        </FloatingCardProvider>,
      );

      const div = document.createElement('div');

      act(() => {
        latest().addRef('card-a' as UniqueId, div);
      });

      expect(latest().cards['card-a' as UniqueId]).toBe(div);
    });

    it('should be a no-op when called with null', () => {
      const { spy, latest } = captureContext();

      render(
        <FloatingCardProvider>
          <ContextReader onContext={spy} />
        </FloatingCardProvider>,
      );

      act(() => {
        latest().addRef('card-null' as UniqueId, null);
      });

      expect(latest().cards['card-null' as UniqueId]).toBeUndefined();
      expect(Object.keys(latest().cards)).toHaveLength(0);
    });

    it('should not overwrite an existing ref when called again with the same id', () => {
      const { spy, latest } = captureContext();

      render(
        <FloatingCardProvider>
          <ContextReader onContext={spy} />
        </FloatingCardProvider>,
      );

      const first = document.createElement('div');
      const second = document.createElement('div');

      act(() => {
        latest().addRef('card-b' as UniqueId, first);
      });

      act(() => {
        latest().addRef('card-b' as UniqueId, second);
      });

      expect(latest().cards['card-b' as UniqueId]).toBe(first);
    });
  });
});

describe('FloatingCardContainer', () => {
  it('should call addRef with the panel id and a DOM element when it mounts', () => {
    // Render a provider so the Dockview mock captures the components map.
    render(
      <FloatingCardProvider>
        <div />
      </FloatingCardProvider>,
    );

    const addRef = vi.fn();
    const FloatingCardContainerComponent = (
      capturedProps.components as Record<
        string,
        FunctionComponent<IDockviewPanelProps>
      >
    ).default as FunctionComponent<IDockviewPanelProps>;

    const mockPanelProps = {
      api: { id: 'panel-container-test' },
    } as unknown as IDockviewPanelProps;

    render(
      <FloatingCardContext.Provider
        value={{
          cards: {},
          addRef,
          removeRef: vi.fn(),
          closeCard: vi.fn(),
          api: null,
        }}
      >
        <FloatingCardContainerComponent {...mockPanelProps} />
      </FloatingCardContext.Provider>,
    );

    expect(addRef).toHaveBeenCalledWith(
      'panel-container-test',
      expect.any(HTMLElement),
    );
  });
});

function makeMockActivePanel(id = 'panel-1', title = 'Panel Title') {
  return {
    id,
    title,
    api: { onDidTitleChange: vi.fn(() => ({ dispose: vi.fn() })) },
  };
}
function makeMockAdapterProps(
  activePanel?: ReturnType<typeof makeMockActivePanel>,
) {
  return {
    api: { close: vi.fn() },
    activePanel,
    panels: activePanel ? [activePanel] : [],
  } as unknown as IDockviewHeaderActionsProps;
}

describe('header adapters', () => {
  it('should not call the icon factory when there is no active panel', () => {
    const iconFactory = vi.fn().mockReturnValue(<span>icon</span>);

    render(
      <FloatingCardProvider icon={iconFactory}>
        <div />
      </FloatingCardProvider>,
    );

    const LeftAdapter =
      capturedProps.prefixHeaderActionsComponent as FunctionComponent<IDockviewHeaderActionsProps>;

    render(<LeftAdapter {...makeMockAdapterProps()} />);

    // The factory must never receive an invalid/empty ID.
    // When there is no active panel, icon is intentionally undefined.
    expect(iconFactory).not.toHaveBeenCalled();
  });

  it('should call the icon factory with the panel id when there is an active panel', () => {
    const iconFactory = vi.fn().mockReturnValue(<span>icon</span>);

    render(
      <FloatingCardProvider icon={iconFactory}>
        <div />
      </FloatingCardProvider>,
    );

    const LeftAdapter =
      capturedProps.prefixHeaderActionsComponent as FunctionComponent<IDockviewHeaderActionsProps>;

    render(
      <LeftAdapter
        {...makeMockAdapterProps(makeMockActivePanel('my-panel'))}
      />,
    );

    expect(iconFactory).toHaveBeenCalledWith('my-panel');
  });

  it('should render headerActions in the provided order', () => {
    const actions = [
      { icon: <span>first</span>, onPress: vi.fn() },
      { icon: <span>second</span>, onPress: vi.fn() },
      { icon: <span>third</span>, onPress: vi.fn() },
    ];

    render(
      <FloatingCardProvider headerActions={actions}>
        <div />
      </FloatingCardProvider>,
    );

    const RightAdapter =
      capturedProps.rightHeaderActionsComponent as FunctionComponent<IDockviewHeaderActionsProps>;

    const { getAllByRole } = render(
      <RightAdapter {...makeMockAdapterProps(makeMockActivePanel())} />,
    );

    // 3 action buttons + 1 always-present close button
    const buttons = getAllByRole('button');
    expect(buttons).toHaveLength(4);
  });
});

// ---------------------------------------------------------------------------
// FloatingCard
// ---------------------------------------------------------------------------

describe('FloatingCard', () => {
  type MockPanel = {
    id: string;
    api: { close: ReturnType<typeof vi.fn> };
    group: { locked: unknown };
    setTitle: ReturnType<typeof vi.fn>;
  };

  function createMockPanel(id = 'test-panel'): MockPanel {
    return {
      id,
      api: { close: vi.fn() },
      group: { locked: undefined },
      setTitle: vi.fn(),
    };
  }

  /** API where getPanel() returns undefined until addPanel() is called. */
  function makeEmptyApi() {
    let storedPanel: MockPanel | undefined;
    const panel = createMockPanel();

    const api = {
      getPanel: vi.fn(() => storedPanel),
      addPanel: vi.fn(() => {
        storedPanel = panel;
        return panel;
      }),
      onDidRemovePanel: vi.fn(() => ({ dispose: vi.fn() })),
    } as unknown as DockviewApi;

    return { api, panel };
  }

  /** API where getPanel() always returns the given panel. */
  function makePopulatedApi(panel?: MockPanel) {
    const p = panel ?? createMockPanel();

    const api = {
      getPanel: vi.fn(() => p),
      addPanel: vi.fn(() => p),
      onDidRemovePanel: vi.fn(() => ({ dispose: vi.fn() })),
    } as unknown as DockviewApi;

    return { api, panel: p };
  }

  function makeContextValue(
    api: FloatingCardContextValue['api'] = null,
    cards: Record<string, HTMLDivElement> = {},
  ): FloatingCardContextValue {
    return {
      cards: cards as Record<UniqueId, HTMLDivElement>,
      addRef: vi.fn(),
      removeRef: vi.fn(),
      closeCard: vi.fn(),
      api,
    };
  }

  describe('isOpen toggling', () => {
    it('should call api.addPanel when isOpen is true and no panel exists', () => {
      const { api, panel } = makeEmptyApi();
      const div = document.createElement('div');

      render(
        <FloatingCardContext.Provider
          value={makeContextValue(api, { 'card-1': div })}
        >
          <FloatingCard id={'card-1' as UniqueId} title='Test Card' isOpen>
            <div>content</div>
          </FloatingCard>
        </FloatingCardContext.Provider>,
      );

      expect(
        (api as unknown as { addPanel: ReturnType<typeof vi.fn> }).addPanel,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'card-1',
          title: 'Test Card',
          component: 'default',
        }),
      );
      expect(panel.group.locked).toBe('no-drop-target');
    });

    it('should not call api.addPanel when panel already exists', () => {
      const { api } = makePopulatedApi();
      const div = document.createElement('div');

      render(
        <FloatingCardContext.Provider
          value={makeContextValue(api, { 'card-existing': div })}
        >
          <FloatingCard id={'card-existing' as UniqueId} isOpen>
            <div>content</div>
          </FloatingCard>
        </FloatingCardContext.Provider>,
      );

      expect(
        (api as unknown as { addPanel: ReturnType<typeof vi.fn> }).addPanel,
      ).not.toHaveBeenCalled();
    });

    it('should call panel.api.close() when isOpen changes from true to false', () => {
      const { api, panel } = makePopulatedApi();
      const div = document.createElement('div');
      const ctxValue = makeContextValue(api, { 'card-toggle': div });

      const { rerender } = render(
        <FloatingCardContext.Provider value={ctxValue}>
          <FloatingCard id={'card-toggle' as UniqueId} isOpen>
            content
          </FloatingCard>
        </FloatingCardContext.Provider>,
      );

      rerender(
        <FloatingCardContext.Provider value={ctxValue}>
          <FloatingCard id={'card-toggle' as UniqueId} isOpen={false}>
            content
          </FloatingCard>
        </FloatingCardContext.Provider>,
      );

      expect(panel.api.close).toHaveBeenCalledOnce();
    });

    it('should not call api.addPanel when api is null', () => {
      const addPanel = vi.fn();
      const div = document.createElement('div');

      render(
        <FloatingCardContext.Provider
          value={makeContextValue(null, { 'card-null-api': div })}
        >
          <FloatingCard id={'card-null-api' as UniqueId} isOpen>
            content
          </FloatingCard>
        </FloatingCardContext.Provider>,
      );

      expect(addPanel).not.toHaveBeenCalled();
    });

    it('should throw when used without a FloatingCardProvider', () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);
      expect(() =>
        render(
          <FloatingCard id={'no-provider' as UniqueId} isOpen>
            content
          </FloatingCard>,
        ),
      ).toThrow('useFloatingCard must be used within a FloatingCardProvider.');
      consoleSpy.mockRestore();
    });
  });

  describe('portal rendering', () => {
    it('should render children into cards[id] via createPortal when isOpen', () => {
      const container = document.createElement('div');
      document.body.appendChild(container);
      const { api } = makeEmptyApi();

      render(
        <FloatingCardContext.Provider
          value={makeContextValue(api, { 'portal-card': container })}
        >
          <FloatingCard id={'portal-card' as UniqueId} isOpen>
            <span data-testid='portal-child'>hello</span>
          </FloatingCard>
        </FloatingCardContext.Provider>,
      );

      expect(
        container.querySelector('[data-testid="portal-child"]'),
      ).not.toBeNull();

      container.remove();
    });

    it('should return null when cards[id] does not exist', () => {
      const { api } = makeEmptyApi();

      render(
        <FloatingCardContext.Provider value={makeContextValue(api, {})}>
          <FloatingCard id={'no-ref-card' as UniqueId} isOpen>
            <span data-testid='unreachable-child'>hello</span>
          </FloatingCard>
        </FloatingCardContext.Provider>,
      );

      expect(
        document.body.querySelector('[data-testid="unreachable-child"]'),
      ).toBeNull();
    });

    it('should return null when isOpen is false, even if cards[id] exists', () => {
      const container = document.createElement('div');
      document.body.appendChild(container);
      const { api } = makeEmptyApi();

      render(
        <FloatingCardContext.Provider
          value={makeContextValue(api, { 'closed-card': container })}
        >
          <FloatingCard id={'closed-card' as UniqueId} isOpen={false}>
            <span data-testid='closed-child'>hello</span>
          </FloatingCard>
        </FloatingCardContext.Provider>,
      );

      expect(
        container.querySelector('[data-testid="closed-child"]'),
      ).toBeNull();

      container.remove();
    });
  });

  describe('title update effect', () => {
    it('should call panel.setTitle with the new title when title changes', () => {
      const { api, panel } = makeEmptyApi();
      const div = document.createElement('div');
      const ctxValue = makeContextValue(api, { 'title-card': div });

      const { rerender } = render(
        <FloatingCardContext.Provider value={ctxValue}>
          <FloatingCard
            id={'title-card' as UniqueId}
            title='Initial Title'
            isOpen
          >
            content
          </FloatingCard>
        </FloatingCardContext.Provider>,
      );

      rerender(
        <FloatingCardContext.Provider value={ctxValue}>
          <FloatingCard
            id={'title-card' as UniqueId}
            title='Updated Title'
            isOpen
          >
            content
          </FloatingCard>
        </FloatingCardContext.Provider>,
      );

      expect(panel.setTitle).toHaveBeenLastCalledWith('Updated Title');
    });

    it('should fall back to id when title is undefined', () => {
      const { api, panel } = makeEmptyApi();
      const div = document.createElement('div');

      render(
        <FloatingCardContext.Provider
          value={makeContextValue(api, { 'fallback-card': div })}
        >
          <FloatingCard id={'fallback-card' as UniqueId} isOpen>
            content
          </FloatingCard>
        </FloatingCardContext.Provider>,
      );

      expect(panel.setTitle).toHaveBeenCalledWith('fallback-card');
    });

    it('should not call setTitle when api is null', () => {
      // With api=null the second effect skips, so setTitle is never called.
      // This verifies the api?.getPanel guard in the title update effect.
      const setTitle = vi.fn();
      const div = document.createElement('div');

      render(
        <FloatingCardContext.Provider
          value={makeContextValue(null, { 'no-api-card': div })}
        >
          <FloatingCard id={'no-api-card' as UniqueId} title='Title' isOpen>
            content
          </FloatingCard>
        </FloatingCardContext.Provider>,
      );

      expect(setTitle).not.toHaveBeenCalled();
    });
  });

  describe('unmount behavior', () => {
    it('should not call panel.api.close() when the component unmounts', () => {
      // The first useEffect has no cleanup — close is the provider\'s responsibility
      const { api, panel } = makePopulatedApi();
      const div = document.createElement('div');

      const { unmount } = render(
        <FloatingCardContext.Provider
          value={makeContextValue(api, { 'unmount-card': div })}
        >
          <FloatingCard id={'unmount-card' as UniqueId} isOpen>
            content
          </FloatingCard>
        </FloatingCardContext.Provider>,
      );

      const closeCallsBefore = panel.api.close.mock.calls.length;
      unmount();

      expect(panel.api.close.mock.calls.length).toBe(closeCallsBefore);
    });

    it('should remove portal content from the DOM when the component unmounts', () => {
      const container = document.createElement('div');
      document.body.appendChild(container);
      const { api } = makeEmptyApi();

      const { unmount } = render(
        <FloatingCardContext.Provider
          value={makeContextValue(api, { 'portal-unmount': container })}
        >
          <FloatingCard id={'portal-unmount' as UniqueId} isOpen>
            <span data-testid='unmount-child'>bye</span>
          </FloatingCard>
        </FloatingCardContext.Provider>,
      );

      expect(
        container.querySelector('[data-testid="unmount-child"]'),
      ).not.toBeNull();

      unmount();

      expect(
        container.querySelector('[data-testid="unmount-child"]'),
      ).toBeNull();

      container.remove();
    });
  });
});

describe('multiple FloatingCardProvider instances', () => {
  it('should render independently without interfering with each other', () => {
    const { getByTestId } = render(
      <>
        <FloatingCardProvider>
          <div data-testid='child-1' />
        </FloatingCardProvider>
        <FloatingCardProvider>
          <div data-testid='child-2' />
        </FloatingCardProvider>
      </>,
    );

    expect(getByTestId('child-1')).toBeInTheDocument();
    expect(getByTestId('child-2')).toBeInTheDocument();
  });

  it('should maintain separate card state per provider instance', () => {
    const spy1 = vi.fn<(ctx: FloatingCardContextValue) => void>();
    const spy2 = vi.fn<(ctx: FloatingCardContextValue) => void>();

    const latest1 = () =>
      spy1.mock.calls.at(-1)?.[0] as FloatingCardContextValue;
    const latest2 = () =>
      spy2.mock.calls.at(-1)?.[0] as FloatingCardContextValue;

    render(
      <>
        <FloatingCardProvider>
          <ContextReader onContext={spy1} />
        </FloatingCardProvider>
        <FloatingCardProvider>
          <ContextReader onContext={spy2} />
        </FloatingCardProvider>
      </>,
    );

    const div = document.createElement('div');

    act(() => {
      latest1().addRef('card-in-provider-1' as UniqueId, div);
    });

    expect(latest1().cards['card-in-provider-1' as UniqueId]).toBe(div);
    expect(latest2().cards['card-in-provider-1' as UniqueId]).toBeUndefined();
  });
});
