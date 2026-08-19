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

import { JsonTree, Section, SectionTitle } from '@tanstack/devtools-ui';
import { createMemo, createSignal, For, Show } from 'solid-js';
import { ActionRow, copyJsonToClipboard } from './action-row';
import { StatusBadge } from './status-badge';
import { FONT_MONO, formatTime, PALETTE } from './tokens';
import type { JSX } from 'solid-js';
import type {
  StreamDevtoolsActions,
  StreamDevtoolsLifecycleEvent,
  StreamDevtoolsMessageEntry,
  StreamDevtoolsStreamEntry,
} from '../types';

// equal flex with the list (50/50), zero basis so the gap can't clip the
// right edge. The pane stays the scroll container; `contain: inline-size`
// stops long payload tokens inflating min-content through the columns.
function paneStyle(stacked: boolean): string {
  return [
    stacked
      ? `border-top:1px solid ${PALETTE.border};padding-top:8px`
      : `border-left:1px solid ${PALETTE.border};padding-left:8px`,
    'contain:inline-size',
    'display:flex',
    'flex:1 1 0%',
    'flex-direction:column',
    'min-width:0',
    'overflow:auto',
  ].join(';');
}

const SUMMARY_STYLE = 'cursor:pointer;list-style:none;';

const COUNT_HINT_STYLE = `color:${PALETTE.muted};font-weight:400;`;

function chevronStyle(open: boolean): string {
  return `display:inline-block;font-size:9px;transform:${open ? 'rotate(90deg)' : 'none'};transition:transform 0.1s;`;
}

const HASH_ROW_STYLE =
  'align-items:flex-start;display:flex;gap:8px;justify-content:space-between;margin-bottom:6px;';

const HASH_CODE_STYLE = `font-family:${FONT_MONO};font-size:12px;margin:0;min-width:0;overflow-wrap:anywhere;white-space:pre-wrap;`;

const DETAIL_ROW_STYLE =
  'display:flex;gap:8px;justify-content:space-between;margin-bottom:4px;';

const DETAIL_LABEL_STYLE = `color:${PALETTE.muted};flex-shrink:0;`;

const DETAIL_VALUE_STYLE = `font-family:${FONT_MONO};font-size:11.5px;font-variant-numeric:tabular-nums;min-width:0;overflow-wrap:anywhere;text-align:right;`;

const EVENT_LIST_STYLE = `display:flex;flex-direction:column;font-family:${FONT_MONO};font-size:11.5px;gap:2px;list-style:none;margin:0;padding:0;`;

const LOG_ROW_STYLE = 'align-items:baseline;display:flex;gap:8px;';

const TIMESTAMP_STYLE = `color:${PALETTE.muted};`;

const DUPLICATE_BADGE_STYLE = `border-radius:4px;color:${PALETTE.warning};outline:1px solid ${PALETTE.warning};padding:0 4px;`;

const MUTED_STYLE = `color:${PALETTE.muted};margin:0;`;

const COPY_BUTTON_STYLE = `background:none;border:1px solid ${PALETTE.inputBorder};border-radius:4px;color:${PALETTE.muted};cursor:pointer;font:inherit;padding:0 4px;`;

const PAYLOAD_BODY_STYLE = 'padding:4px 0 4px 16px;';

function lifecycleLabel(event: StreamDevtoolsLifecycleEvent): string {
  switch (event.type) {
    case 'statusChanged': {
      return `${event.from} → ${event.to}`;
    }
    case 'observerAdded': {
      return 'observer added';
    }
    case 'observerRemoved': {
      return 'observer removed';
    }
    default: {
      return event.type;
    }
  }
}

/** Title band toggles content, expanded by default (query-devtools explorer UX). */
function CollapsibleSection(props: {
  title: string;
  countHint: string;
  children: JSX.Element;
}) {
  const [open, setOpen] = createSignal(true);

  return (
    <Section aria-label={props.title}>
      <details onToggle={(event) => setOpen(event.currentTarget.open)} open>
        <summary style={SUMMARY_STYLE}>
          <SectionTitle>
            <span aria-hidden='true' style={chevronStyle(open())}>
              ▶
            </span>
            {props.title}
            <span style={COUNT_HINT_STYLE}>{props.countHint}</span>
          </SectionTitle>
        </summary>
        {props.children}
      </details>
    </Section>
  );
}

function DetailRow(props: { label: string; children: JSX.Element }) {
  return (
    <div style={DETAIL_ROW_STYLE}>
      <span style={DETAIL_LABEL_STYLE}>{props.label}</span>
      <span style={DETAIL_VALUE_STYLE}>{props.children}</span>
    </div>
  );
}

/**
 * One message-log row. Expansion state is hoisted to the pane: snapshot
 * publishes rebuild entry objects, so `<For>` recreates rows — row-local
 * signals would snap expanded payloads shut.
 */
function MessageLogEntry(props: {
  entry: StreamDevtoolsMessageEntry;
  expanded: boolean;
  onToggle: (sequence: number, open: boolean) => void;
}) {
  return (
    <li style={LOG_ROW_STYLE}>
      <span style={MUTED_STYLE}>#{props.entry.sequence}</span>
      <span style={TIMESTAMP_STYLE}>
        {formatTime(props.entry.dataUpdatedAt)}
      </span>
      <Show when={props.entry.duplicate}>
        <span
          style={DUPLICATE_BADGE_STYLE}
          title='replaceEqualDeep kept the previous data reference'
        >
          duplicate
        </span>
      </Show>
      <button
        aria-label={`copy message ${props.entry.sequence}`}
        onClick={() => copyJsonToClipboard(props.entry.dataRef)}
        style={COPY_BUTTON_STYLE}
        title='Copy this payload as JSON'
        type='button'
      >
        copy
      </button>
      <details
        onToggle={(event) =>
          props.onToggle(props.entry.sequence, event.currentTarget.open)
        }
        open={props.expanded}
      >
        <summary style={SUMMARY_STYLE}>payload</summary>
        {/* defer the tree until expanded — rendering 50 payloads ~10x/s
            while collapsed is wasted work */}
        <Show when={props.expanded}>
          <div style={PAYLOAD_BODY_STYLE}>
            <JsonTree value={props.entry.dataRef} />
          </div>
        </Show>
      </details>
    </li>
  );
}

/**
 * query-devtools details column: details band, actions, timeline, message
 * log, JSON explorer of the latest payload. Mounted keyed by streamHash
 * (panel `<Show keyed>`), so all pane-local UI state resets per stream.
 */
export function DetailPane(props: {
  stream: StreamDevtoolsStreamEntry;
  timeline: StreamDevtoolsLifecycleEvent[];
  messageLog: StreamDevtoolsMessageEntry[];
  /** Direct in-process store actions, threaded down to the ActionRow. */
  actions: StreamDevtoolsActions;
  /** True when the panel is narrow and the columns stack vertically. */
  stacked?: boolean;
}) {
  // expanded payload sequences — hoisted, see MessageLogEntry
  const [expanded, setExpanded] = createSignal<ReadonlySet<number>>(new Set());
  const toggleExpanded = (sequence: number, open: boolean) => {
    setExpanded((previous) => {
      if (previous.has(sequence) === open) {
        return previous;
      }
      const next = new Set(previous);
      if (open) {
        next.add(sequence);
      } else {
        next.delete(sequence);
      }
      return next;
    });
  };

  // newest first; ring buffer arrives oldest-first
  const reversedLog = createMemo(() => props.messageLog.toReversed());

  const messageCountHint = () =>
    // capped ring vs persistent total — once they diverge say so, else
    // "50 messages" above entry #100 reads like data loss
    props.messageLog.length < props.stream.messageCount
      ? `last ${props.messageLog.length} of ${props.stream.messageCount}`
      : `${props.messageLog.length} ${props.messageLog.length === 1 ? 'message' : 'messages'}`;

  return (
    <div style={paneStyle(props.stacked ?? false)}>
      <Section aria-label='Stream Details'>
        <SectionTitle>Stream Details</SectionTitle>
        <div style={HASH_ROW_STYLE}>
          <pre style={HASH_CODE_STYLE}>
            <code>{props.stream.streamHash}</code>
          </pre>
          <StatusBadge status={props.stream.status} />
        </div>
        <DetailRow label='Observers:'>{props.stream.observerCount}</DetailRow>
        <DetailRow label='Messages:'>{props.stream.messageCount}</DetailRow>
        <DetailRow label='Last Updated:'>
          {props.stream.dataUpdatedAt === 0
            ? '—'
            : formatTime(props.stream.dataUpdatedAt)}
        </DetailRow>
      </Section>

      {/* plain Section without label: ActionRow renders its own Actions
          landmark — labeling here would nest two */}
      <Section>
        <SectionTitle>Actions</SectionTitle>
        <ActionRow actions={props.actions} stream={props.stream} />
      </Section>

      <CollapsibleSection
        countHint={`${props.timeline.length} ${props.timeline.length === 1 ? 'event' : 'events'}`}
        title='Timeline'
      >
        <Show
          fallback={<p style={MUTED_STYLE}>No lifecycle events</p>}
          when={props.timeline.length > 0}
        >
          <ol style={EVENT_LIST_STYLE}>
            <For each={props.timeline}>
              {(event) => (
                <li style={LOG_ROW_STYLE}>
                  <span style={TIMESTAMP_STYLE}>
                    {formatTime(event.timestamp)}
                  </span>
                  <span>{lifecycleLabel(event)}</span>
                </li>
              )}
            </For>
          </ol>
        </Show>
      </CollapsibleSection>

      <CollapsibleSection countHint={messageCountHint()} title='Message Log'>
        <Show
          fallback={<p style={MUTED_STYLE}>No messages yet</p>}
          when={props.messageLog.length > 0}
        >
          <ol style={EVENT_LIST_STYLE}>
            <For each={reversedLog()}>
              {(entry) => (
                <MessageLogEntry
                  entry={entry}
                  expanded={expanded().has(entry.sequence)}
                  onToggle={toggleExpanded}
                />
              )}
            </For>
          </ol>
        </Show>
      </CollapsibleSection>

      <Section aria-label='Data Explorer'>
        <SectionTitle>Data Explorer</SectionTitle>
        <Show
          fallback={<p style={MUTED_STYLE}>No data yet</p>}
          when={
            props.stream.dataRef !== null && props.stream.dataRef !== undefined
          }
        >
          <JsonTree
            copyable
            defaultExpansionDepth={2}
            value={props.stream.dataRef}
          />
        </Show>
      </Section>
    </div>
  );
}
