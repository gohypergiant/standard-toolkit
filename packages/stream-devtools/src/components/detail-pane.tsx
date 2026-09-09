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
import { useStyles } from '../styles/use-styles';
import { ActionRow, copyJsonToClipboard } from './action-row';
import { formatTime } from './format-time';
import { StatusBadge } from './status-badge';
import type { JSX } from 'solid-js';
import type {
  StreamDevtoolsActions,
  StreamDevtoolsLifecycleEvent,
  StreamDevtoolsMessageEntry,
  StreamDevtoolsStreamEntry,
} from '../types';

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
  const styles = useStyles();
  const [open, setOpen] = createSignal(true);

  return (
    <Section aria-label={props.title}>
      <details onToggle={(event) => setOpen(event.currentTarget.open)} open>
        <summary class={styles().summary}>
          <SectionTitle>
            <span aria-hidden='true' class={styles().chevron(open())}>
              ▶
            </span>
            {props.title}
            <span class={styles().countHint}>{props.countHint}</span>
          </SectionTitle>
        </summary>
        {props.children}
      </details>
    </Section>
  );
}

function DetailRow(props: { label: string; children: JSX.Element }) {
  const styles = useStyles();

  return (
    <div class={styles().detailRow}>
      <span class={styles().detailLabel}>{props.label}</span>
      <span class={styles().detailValue}>{props.children}</span>
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
  const styles = useStyles();

  return (
    <li class={styles().logRow}>
      <span class={styles().mutedText}>#{props.entry.sequence}</span>
      <span class={styles().timestamp}>
        {formatTime(props.entry.dataUpdatedAt)}
      </span>
      <Show when={props.entry.duplicate}>
        <span
          class={styles().duplicateBadge}
          title='replaceEqualDeep kept the previous data reference'
        >
          duplicate
        </span>
      </Show>
      <button
        aria-label={`copy message ${props.entry.sequence}`}
        class={styles().copyButton}
        onClick={() => copyJsonToClipboard(props.entry.dataRef)}
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
        <summary class={styles().summary}>payload</summary>
        {/* defer the tree until expanded — rendering 50 payloads ~10x/s
            while collapsed is wasted work */}
        <Show when={props.expanded}>
          <div class={styles().payloadBody}>
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
  const styles = useStyles();
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
    <div class={styles().pane(props.stacked ?? false)}>
      <Section aria-label='Stream Details'>
        <SectionTitle>Stream Details</SectionTitle>
        <div class={styles().hashRow}>
          <pre class={styles().hashCode}>
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
          fallback={<p class={styles().mutedText}>No lifecycle events</p>}
          when={props.timeline.length > 0}
        >
          <ol class={styles().eventList}>
            <For each={props.timeline}>
              {(event) => (
                <li class={styles().logRow}>
                  <span class={styles().timestamp}>
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
          fallback={<p class={styles().mutedText}>No messages yet</p>}
          when={props.messageLog.length > 0}
        >
          <ol class={styles().eventList}>
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
          fallback={<p class={styles().mutedText}>No data yet</p>}
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
