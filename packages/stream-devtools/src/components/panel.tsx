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
import {
  Button,
  Header,
  MainPanel,
  ThemeContextProvider,
} from '@tanstack/devtools-ui';
import {
  createEffect,
  createMemo,
  createSignal,
  For,
  onCleanup,
  onMount,
  Show,
} from 'solid-js';
import { DetailPane } from './detail-pane';
import {
  BREAKPOINTS,
  FONT_MONO,
  FONT_SANS,
  formatTime,
  PALETTE,
  STATUS_BASE_COLORS,
  STATUS_CHIP_COLORS,
} from './tokens';
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

const PANEL_STYLE = [
  'box-sizing:border-box',
  `color:${PALETTE.text}`,
  'display:flex',
  'flex-direction:column',
  `font-family:${FONT_SANS}`,
  'font-size:12px',
  'gap:8px',
  'height:100%',
  'overflow:hidden',
].join(';');

const HEADER_GROUP_STYLE = 'align-items:center;display:flex;gap:8px;';

const RATE_STYLE = `color:${PALETTE.muted};font-family:${FONT_MONO};font-size:11px;margin-left:auto;`;

// query-devtools `queryStatusTag` recipe.
const STATUS_CHIP_STYLE = [
  'align-items:center',
  `background:${PALETTE.chipBg}`,
  'border:1px solid transparent',
  'border-radius:4px',
  'box-sizing:border-box',
  'display:flex',
  'font-weight:500',
  'gap:6px',
  'height:26px',
  'padding:4px 4px 4px 6px',
  'user-select:none',
].join(';');

const CHIP_LABEL_STYLE = 'font-size:11px;text-transform:capitalize;';

function statusDotStyle(status: StreamStatus): string {
  return `background-color:${STATUS_CHIP_COLORS[status].dot};border-radius:9999px;height:6px;width:6px;`;
}

// query-devtools `queryStatusCount`: neutral at zero, 900/300 pairing when live
function chipCountStyle(status: StreamStatus, count: number): string {
  const { countBg, countText } = STATUS_CHIP_COLORS[status];
  const active = count > 0 && countBg !== undefined;
  return [
    'align-items:center',
    `background:${active ? countBg : PALETTE.countNeutralBg}`,
    'border-radius:2px',
    `color:${active ? countText : PALETTE.countNeutralText}`,
    'display:flex',
    'font-size:11px',
    'font-variant-numeric:tabular-nums',
    'height:18px',
    'justify-content:center',
    'padding:0 5px',
  ].join(';');
}

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
  if (panelWidth < BREAKPOINTS.second) {
    return false;
  }
  return !(detailOpen && panelWidth < BREAKPOINTS.first);
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
  const [hovered, setHovered] = createSignal(false);

  const chipStyle = () =>
    props.showLabel
      ? STATUS_CHIP_STYLE
      : `${STATUS_CHIP_STYLE};background:${hovered() ? PALETTE.chipHoverBg : PALETTE.chipBg};cursor:pointer;`;

  return (
    // <output> (implicit status role) supports aria-label; a bare span doesn't
    <output
      aria-label={`${props.status} streams ${props.count}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={chipStyle()}
      tabIndex={props.showLabel ? undefined : 0}
      title={props.showLabel ? undefined : `${props.status} — ${props.count}`}
    >
      <span aria-hidden='true' style={statusDotStyle(props.status)} />
      <Show when={props.showLabel}>
        <span style={CHIP_LABEL_STYLE}>{props.status}</span>
      </Show>
      <span style={chipCountStyle(props.status, props.count)}>
        {props.count}
      </span>
    </output>
  );
}

function bodyStyle(stacked: boolean): string {
  return `display:flex;flex:1;flex-direction:${stacked ? 'column' : 'row'};gap:8px;min-height:0;min-width:0;padding:0 8px 8px 8px;`;
}

// 50/50 split via equal grow on zero basis — % bases + gap would sum past
// 100% and clip the detail pane. `contain: inline-size` stops a long
// streamKey inflating min-content through button → li → ol.
const LIST_STYLE = [
  'contain:inline-size',
  'display:flex',
  'flex:1 1 0%',
  'flex-direction:column',
  'list-style:none',
  'margin:0',
  'min-width:0',
  'overflow:auto',
  'padding:0',
].join(';');

const EMPTY_TEXT_STYLE = `color:${PALETTE.muted};margin:0;padding:8px 12px;`;

const ROW_STYLE = `border-bottom:1px solid ${PALETTE.surface};`;

function rowButtonStyle(selected: boolean): string {
  return [
    'align-items:center',
    `background:${selected ? PALETTE.surface : 'none'}`,
    'border:none',
    'border-radius:4px',
    'color:inherit',
    'cursor:pointer',
    'display:flex',
    'font:inherit',
    'gap:8px',
    'padding:3px 6px',
    'text-align:left',
    'width:100%',
  ].join(';');
}

const COUNT_CHIP_STYLE = [
  'border-radius:4px',
  'color:#ffffff',
  'flex:0 0 auto',
  'font-size:11px',
  'font-weight:600',
  'line-height:18px',
  'min-width:22px',
  'padding:0 4px',
  'text-align:center',
].join(';');

// wrap the full key like query-devtools; `overflow-wrap: anywhere` (unlike
// break-word) also removes the key's min-content pressure
const ROW_HASH_STYLE = `font-family:${FONT_MONO};font-size:11.5px;min-width:0;overflow-wrap:anywhere;`;

const ROW_META_STYLE = `color:${PALETTE.muted};flex-shrink:0;font-family:${FONT_MONO};font-size:11px;font-variant-numeric:tabular-nums;margin-left:auto;`;

/** Screen-reader-only text (row status stays announced without a badge). */
const VISUALLY_HIDDEN_STYLE =
  'clip:rect(0 0 0 0);clip-path:inset(50%);height:1px;overflow:hidden;position:absolute;white-space:nowrap;width:1px;';

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
  const countsByStatus = createMemo(() => {
    const counts = new Map<StreamStatus, number>();
    for (const stream of props.streams) {
      counts.set(stream.status, (counts.get(stream.status) ?? 0) + 1);
    }
    return counts;
  });

  return (
    <Header>
      <div style={HEADER_GROUP_STYLE}>
        <nav aria-label='Transport' style={HEADER_GROUP_STYLE}>
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
      <span style={RATE_STYLE}>{props.rate} msg/s</span>
    </Header>
  );
}

function StreamRow(props: {
  stream: StreamDevtoolsStreamEntry;
  selected: boolean;
  onSelect: (streamHash: string) => void;
}) {
  return (
    <li style={ROW_STYLE}>
      <button
        aria-pressed={props.selected}
        onClick={() => props.onSelect(props.stream.streamHash)}
        style={rowButtonStyle(props.selected)}
        type='button'
      >
        <output
          aria-label={`observer count ${props.stream.observerCount}`}
          style={`${COUNT_CHIP_STYLE};background-color:${STATUS_BASE_COLORS[props.stream.status]};`}
          title={`Observer count — ${props.stream.status}`}
        >
          {props.stream.observerCount}
        </output>
        <span style={VISUALLY_HIDDEN_STYLE}>{props.stream.status}</span>
        <code style={ROW_HASH_STYLE}>{props.stream.streamHash}</code>
        <span style={ROW_META_STYLE}>
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
 * Thin renderer over store snapshots, styled with devtools-ui so the tab
 * reads as a sibling of TanStack's own panels. Update logic = signal
 * mirroring `store.subscribe`/`store.getSnapshot`.
 */
export function StreamDevtoolsPanel(props: { store: StreamDevtoolsStore }) {
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
  const stacked = () => panelWidth() !== 0 && panelWidth() < BREAKPOINTS.second;
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
    <ThemeContextProvider theme='dark'>
      <MainPanel>
        <div ref={setPanelEl} style={PANEL_STYLE}>
          <SummaryHeader
            activeTab={activeTab()}
            onSelectTab={setActiveTab}
            rate={rate()}
            showLabels={showLabels()}
            streams={tabStreams()}
          />
          <Show
            fallback={
              <p style={EMPTY_TEXT_STYLE}>
                {activeTab() === 'sse'
                  ? 'No SSE streams'
                  : 'No WebSocket streams'}
              </p>
            }
            when={tabStreams().length > 0}
          >
            <div style={bodyStyle(stacked())}>
              <ol style={LIST_STYLE}>
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
    </ThemeContextProvider>
  );
}
