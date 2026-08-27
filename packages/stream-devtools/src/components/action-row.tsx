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

import { Button } from '@tanstack/devtools-ui';
import { createSignal, Show } from 'solid-js';
import { useStyles } from '../styles/use-styles';
import { Tooltip } from './tooltip';
import type {
  StreamDevtoolsActions,
  StreamDevtoolsStreamEntry,
} from '../types';

const NO_TRANSPORT_TITLE =
  'Unavailable — the stream has no live connection (lazy connect: no observer has subscribed yet)';

/** Panel-local by design — no store action, no bus. */
export function copyJsonToClipboard(value: unknown): void {
  // cyclic dataRef throws SYNCHRONOUSLY — the promise .catch can't see it
  let serialized: string;
  try {
    serialized = JSON.stringify(value, null, 2);
  } catch (error) {
    console.error(
      '[StreamDevtools] Failed to serialize payload for clipboard',
      error,
    );
    return;
  }

  navigator.clipboard.writeText(serialized).catch((error) => {
    console.error(
      '[StreamDevtools] Failed to copy payload to clipboard',
      error,
    );
  });
}

/**
 * Direct store calls (see types.ts). Simulate/Inject disabled without a
 * live transport; inject validates JSON in-panel so invalid JSON never
 * leaves the panel.
 */
export function ActionRow(props: {
  stream: StreamDevtoolsStreamEntry;
  actions: StreamDevtoolsActions;
}) {
  const styles = useStyles();
  const [injectInput, setInjectInput] = createSignal('');
  const [injectError, setInjectError] = createSignal<string | undefined>();
  const transportMissing = () => !props.stream.hasTransport;

  const injectMessage = () => {
    try {
      JSON.parse(injectInput());
    } catch (error) {
      setInjectError(error instanceof Error ? error.message : String(error));
      return;
    }
    setInjectError(undefined);
    props.actions.injectMessage(props.stream.streamHash, injectInput());
  };

  return (
    <section aria-label='Actions'>
      <div class={styles().actionRow}>
        <Tooltip label='stream.retry() — closes and recreates the transport'>
          <Button
            onClick={() => props.actions.reconnect(props.stream.streamHash)}
            outline
            variant='info'
          >
            Reconnect
          </Button>
        </Tooltip>
        <Tooltip label='cache.remove(stream) — observers self-heal on next render'>
          <Button
            onClick={() => props.actions.close(props.stream.streamHash)}
            outline
            variant='warning'
          >
            Close
          </Button>
        </Tooltip>
        <Tooltip label='client.clear() — removes every stream'>
          <Button
            onClick={() => props.actions.clearAll()}
            outline
            variant='secondary'
          >
            Clear All
          </Button>
        </Tooltip>
        <Tooltip
          label={
            transportMissing()
              ? NO_TRANSPORT_TITLE
              : 'Drives the transport error handler — the real connection-failure path'
          }
        >
          <Button
            className={transportMissing() ? styles().disabledButton : undefined}
            disabled={transportMissing()}
            onClick={() => props.actions.simulateError(props.stream.streamHash)}
            outline
            variant='danger'
          >
            Simulate Error
          </Button>
        </Tooltip>
        <Tooltip label='Copy the latest payload as JSON'>
          <Button
            ghost
            onClick={() => copyJsonToClipboard(props.stream.dataRef)}
            variant='secondary'
          >
            Copy
          </Button>
        </Tooltip>
      </div>
      <div class={styles().actionRow}>
        <textarea
          aria-label='Inject message JSON'
          class={styles().injectInput}
          disabled={transportMissing()}
          onInput={(event) => {
            setInjectInput(event.currentTarget.value);
            setInjectError(undefined);
          }}
          placeholder='{"activations": []}'
          rows={2}
          value={injectInput()}
        />
        <Tooltip
          label={
            transportMissing()
              ? NO_TRANSPORT_TITLE
              : 'Drives the transport message handler — indistinguishable from a real server message'
          }
        >
          <Button
            className={transportMissing() ? styles().disabledButton : undefined}
            disabled={transportMissing()}
            onClick={injectMessage}
            outline
            variant='success'
          >
            Inject Message
          </Button>
        </Tooltip>
      </div>
      <p class={styles().destructiveNote}>
        Destructive: injected JSON flows the real observer path (map layers,
        alerts, snackbars).
      </p>
      <Show when={injectError() !== undefined}>
        <p class={styles().errorText} role='alert'>
          Invalid JSON: {injectError()}
        </p>
      </Show>
    </section>
  );
}
