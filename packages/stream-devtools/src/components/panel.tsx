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

import { STREAM_STATUS } from '@accelint/stream';
import { Button, Header, MainPanel } from '@tanstack/devtools-ui';
import {
  createEffect,
  createMemo,
  createSignal,
  For,
  onCleanup,
  onMount,
  Show,
} from 'solid-js';
import { tokens } from '../styles/tokens';
import { useStyles } from '../styles/use-styles';
import { DetailPane } from './detail-pane';
import { formatTime } from './format-time';
import type { StreamStatus, TransportKind } from '@accelint/stream';
import type {
  StreamDevtoolsState,
  StreamDevtoolsStore,
  StreamDevtoolsStreamEntry,
} from '../types';

/** Header rate window. Bounded by the ring buffers — bursts read as a floor; fine for a dev gauge. */
const RATE_WINDOW_MS = 5000;

/** Idle re-render cadence for the header rate — keeps it decaying to 0.0. */
const RATE_TICK_MS = 1000;

/** Transport tabs, in display order (query-devtools Queries|Mutations). */
const TRANSPORT_TABS: { kind: TransportKind; label: string }[] = [
  { kind: 'sse', label: 'SSE' },
  { kind: 'websocket', label: 'WebSockets' },
];

/** Fixed chip order matching the query-devtools status-count row. */
const STATUS_ORDER: StreamStatus[] = [
  STREAM_STATUS.CONNECTED,
  STREAM_STATUS.CONNECTING,
  STREAM_STATUS.ERROR,
  STREAM_STATUS.DISCONNECTED,
];

/**
 * query-devtools `showLabel`: labels hide below the second breakpoint, and
 * below the first while a detail pane is open. Width 0 = unmeasured (first
 * paint, jsdom) — treat as wide so labels don't flash out on mount.
 */
export function shouldShowChipLabels(
  panelWidth: number,
  detailOpen: boolean,
): boolean {
  if (panelWidth === 0) {
    return true;
  }
  if (panelWidth < tokens.breakpoints.second) {
    return false;
  }
  return !(detailOpen && panelWidth < tokens.breakpoints.first);
}

/**
 * Bordered pill: colored status dot + capitalized label + always-visible
 * count box ("0" stays visible in a neutral box). Wide mode is inert
 * (query-devtools disables the chip while labels show); collapsed drops the
 * label, gains hover bg + a full label-and-count tooltip.
 */
function StatusChip(props: {
  status: StreamStatus;
  count: number;
  showLabel: boolean;
}) {
  const styles = useStyles();

  return (
    // <output> (implicit status role) supports aria-label; a bare span doesn't
    <output
      aria-label={`${props.status} streams ${props.count}`}
      class={styles().statusChip(!props.showLabel)}
      tabIndex={props.showLabel ? undefined : 0}
      title={props.showLabel ? undefined : `${props.status} — ${props.count}`}
    >
      <span aria-hidden='true' class={styles().chipDot(props.status)} />
      <Show when={props.showLabel}>
        <span class={styles().chipLabel}>{props.status}</span>
      </Show>
      <span class={styles().chipCount(props.status, props.count > 0)}>
        {props.count}
      </span>
    </output>
  );
}

/** Messages per second across a tab's ring buffers over the trailing window. */
function messageRate(
  state: StreamDevtoolsState,
  streams: StreamDevtoolsStreamEntry[],
  now: number,
): string {
  let count = 0;
  for (const stream of streams) {
    const log = state.messageLogs[stream.streamHash] ?? [];
    for (const entry of log) {
      if (now - entry.dataUpdatedAt <= RATE_WINDOW_MS) {
        count += 1;
      }
    }
  }
  return (count / (RATE_WINDOW_MS / 1000)).toFixed(1);
}

function SummaryHeader(props: {
  activeTab: TransportKind;
  onSelectTab: (tab: TransportKind) => void;
  streams: StreamDevtoolsStreamEntry[];
  rate: string;
  showLabels: boolean;
}) {
  const styles = useStyles();
  const countsByStatus = createMemo(() => {
    const counts = new Map<StreamStatus, number>();
    for (const stream of props.streams) {
      counts.set(stream.status, (counts.get(stream.status) ?? 0) + 1);
    }
    return counts;
  });

  return (
    <Header>
      <div class={styles().headerGroup}>
        <nav aria-label='Transport' class={styles().headerGroup}>
          <For each={TRANSPORT_TABS}>
            {(tab) => (
              <Button
                aria-pressed={tab.kind === props.activeTab}
                ghost={tab.kind !== props.activeTab}
                onClick={() => props.onSelectTab(tab.kind)}
                variant={tab.kind === props.activeTab ? 'primary' : 'secondary'}
              >
                {tab.label}
              </Button>
            )}
          </For>
        </nav>
        <For each={STATUS_ORDER}>
          {(status) => (
            <StatusChip
              count={countsByStatus().get(status) ?? 0}
              showLabel={props.showLabels}
              status={status}
            />
          )}
        </For>
      </div>
      <span class={styles().rate}>{props.rate} msg/s</span>
    </Header>
  );
}

function StreamRow(props: {
  stream: StreamDevtoolsStreamEntry;
  selected: boolean;
  onSelect: (streamHash: string) => void;
}) {
  const styles = useStyles();

  return (
    <li class={styles().row}>
      <button
        aria-pressed={props.selected}
        class={styles().rowButton(props.selected)}
        onClick={() => props.onSelect(props.stream.streamHash)}
        type='button'
      >
        <output
          aria-label={`observer count ${props.stream.observerCount}`}
          class={styles().observerCount(props.stream.status)}
          title={`Observer count — ${props.stream.status}`}
        >
          {props.stream.observerCount}
        </output>
        <span class={styles().visuallyHidden}>{props.stream.status}</span>
        <code class={styles().rowHash}>{props.stream.streamHash}</code>
        <span class={styles().rowMeta}>
          {props.stream.messageCount} msgs
          {props.stream.dataUpdatedAt === 0
            ? ''
            : ` · ${formatTime(props.stream.dataUpdatedAt)}`}
        </span>
      </button>
    </li>
  );
}

/**
 * Thin renderer over store snapshots, styled with devtools-ui plus the
 * theme-reactive `useStyles` classes so the tab reads as a sibling of
 * TanStack's own panels in both themes. Update logic = signal mirroring
 * `store.subscribe`/`store.getSnapshot`. Theme context arrives from the
 * `components/index.tsx` seam.
 */
export function StreamDevtoolsPanel(props: { store: StreamDevtoolsStore }) {
  const styles = useStyles();
  const [state, setState] = createSignal(props.store.getSnapshot());
  const [selectedHash, setSelectedHash] = createSignal<string | undefined>();
  const [activeTab, setActiveTab] = createSignal<TransportKind>('sse');
  // 1s tick keeps the idle header rate decaying to 0.0 — renders otherwise
  // only happen on publications
  const [tick, setTick] = createSignal(0);
  // responsive decisions keyed off the panel root, not the window — the
  // panel shares the drawer, its own width is the honest signal
  const [panelWidth, setPanelWidth] = createSignal(0);
  // signal ref, not a plain let: the observer re-attaches if the provider
  // ever recreates the element — a `let` captured at onMount can end up
  // watching a detached node (labels then never collapse on resize)
  const [panelEl, setPanelEl] = createSignal<HTMLDivElement>();

  createEffect(() => {
    const el = panelEl();
    if (!el) {
      return;
    }
    setPanelWidth(Math.round(el.getBoundingClientRect().width));
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setPanelWidth(Math.round(entry.contentRect.width));
      }
    });
    observer.observe(el);
    onCleanup(() => observer.disconnect());
  });

  onMount(() => {
    const unsubscribe = props.store.subscribe(() =>
      setState(props.store.getSnapshot()),
    );
    onCleanup(unsubscribe);
    // subscribe() flushes state tracked while unmounted into a fresh
    // snapshot without notifying — re-read it, or a panel mounting after
    // idle streams' events would render the stale pre-flush state forever
    setState(props.store.getSnapshot());

    const interval = setInterval(
      () => setTick((value) => value + 1),
      RATE_TICK_MS,
    );
    onCleanup(() => clearInterval(interval));
  });

  const tabStreams = createMemo(() =>
    state().streams.filter((stream) => stream.transport === activeTab()),
  );
  const selectedStream = createMemo(() =>
    tabStreams().find((stream) => stream.streamHash === selectedHash()),
  );
  // width 0 = unmeasured (first paint, jsdom) — treat as wide
  const stacked = () =>
    panelWidth() !== 0 && panelWidth() < tokens.breakpoints.second;
  // live: panelWidth tracks the ResizeObserver, so dragging the panel
  // narrower collapses chip labels immediately and widening restores them
  const showLabels = () =>
    shouldShowChipLabels(panelWidth(), selectedStream() !== undefined);
  const rate = createMemo(() => {
    tick();
    return messageRate(state(), tabStreams(), Date.now());
  });

  const toggleSelection = (streamHash: string) => {
    setSelectedHash((previous) =>
      previous === streamHash ? undefined : streamHash,
    );
  };

  return (
    <MainPanel>
      <div class={styles().panel} ref={setPanelEl}>
        <SummaryHeader
          activeTab={activeTab()}
          onSelectTab={setActiveTab}
          rate={rate()}
          showLabels={showLabels()}
          streams={tabStreams()}
        />
        <Show
          fallback={
            <p class={styles().emptyText}>
              {activeTab() === 'sse'
                ? 'No SSE streams'
                : 'No WebSocket streams'}
            </p>
          }
          when={tabStreams().length > 0}
        >
          <div class={styles().body(stacked())}>
            <ol class={styles().list}>
              <For each={tabStreams()}>
                {(stream) => (
                  <StreamRow
                    onSelect={toggleSelection}
                    selected={stream.streamHash === selectedHash()}
                    stream={stream}
                  />
                )}
              </For>
            </ol>
            {/* keyed by streamHash: pane-local UI state (expanded payloads,
                collapsed sections) must reset per stream — without the
                remount, stream A's expanded #3 reconciles onto stream B's */}
            <Show keyed when={selectedStream()?.streamHash}>
              {(streamHash) => (
                <DetailPane
                  actions={props.store.actions}
                  messageLog={state().messageLogs[streamHash] ?? []}
                  stacked={stacked()}
                  stream={selectedStream() as StreamDevtoolsStreamEntry}
                  timeline={state().timelines[streamHash] ?? []}
                />
              )}
            </Show>
          </div>
        </Show>
      </div>
    </MainPanel>
  );
}
