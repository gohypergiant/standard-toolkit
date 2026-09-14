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

/** @vitest-environment jsdom */

import { afterEach, describe, expect, it, vi } from 'vitest';

/**
 * The package entries are development-only (TanStack devtools convention):
 * `.` and `./react` are conditional re-exports that resolve to no-op twins
 * outside `NODE_ENV === 'development'`, while `./production` and
 * `./react/production` always resolve to the real implementations.
 *
 * Because the entries are pure re-export modules, referential identity
 * against the implementation module IS their contract — each test stubs
 * NODE_ENV, resets the module registry so the entry's module-level
 * conditional re-evaluates, and asserts which implementation came out.
 */

/** Load an entry and its impl module in one fresh registry for identity checks. */
async function loadWith(nodeEnv: string, entryPath: string, implPath: string) {
  vi.stubEnv('NODE_ENV', nodeEnv);
  vi.resetModules();
  const entry = await import(entryPath);
  const impl = await import(implPath);
  return { entry, impl };
}

describe('development-only entries (production no-op)', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('main entry exports the no-op core when NODE_ENV is production', async () => {
    const { entry, impl } = await loadWith('production', '../index', '../core');

    expect(entry.StreamDevtoolsCore).toBe(impl.StreamDevtoolsCoreNoOp);
  });

  it('main entry exports the real core when NODE_ENV is development', async () => {
    const { entry, impl } = await loadWith(
      'development',
      '../index',
      '../core',
    );

    expect(entry.StreamDevtoolsCore).toBe(impl.StreamDevtoolsCore);
  });

  it('./production always exports the real core', async () => {
    const { entry, impl } = await loadWith(
      'production',
      '../production',
      '../core',
    );

    expect(entry.StreamDevtoolsCore).toBe(impl.StreamDevtoolsCore);
  });

  it('both root entries export the store factory for custom wrappers', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.resetModules();
    const entry = await import('../index');
    const production = await import('../production');
    const store = await import('../store');

    expect(entry.createStreamDevtoolsStore).toBe(
      store.createStreamDevtoolsStore,
    );
    expect(production.createStreamDevtoolsStore).toBe(
      store.createStreamDevtoolsStore,
    );
  });

  it('./react exports the no-op panel and plugin when NODE_ENV is production', async () => {
    const { entry, impl } = await loadWith(
      'production',
      '../react/index',
      '../react/plugin',
    );
    const panel = await import('../react/panel');

    expect(entry.streamDevtoolsPlugin).toBe(impl.streamDevtoolsNoOpPlugin);
    expect(entry.StreamDevtoolsPanel).toBe(panel.StreamDevtoolsPanelNoOp);
  });

  it('./react exports the real panel and plugin when NODE_ENV is development', async () => {
    const { entry, impl } = await loadWith(
      'development',
      '../react/index',
      '../react/plugin',
    );
    const panel = await import('../react/panel');

    expect(entry.streamDevtoolsPlugin).toBe(impl.streamDevtoolsPlugin);
    expect(entry.StreamDevtoolsPanel).toBe(panel.StreamDevtoolsPanel);
  });

  it('./react/production always exports the real panel and plugin', async () => {
    const { entry, impl } = await loadWith(
      'production',
      '../react/production',
      '../react/plugin',
    );
    const panel = await import('../react/panel');

    expect(entry.streamDevtoolsPlugin).toBe(impl.streamDevtoolsPlugin);
    expect(entry.StreamDevtoolsPanel).toBe(panel.StreamDevtoolsPanel);
  });

  it('the react no-op keeps the plugin shape', async () => {
    // rendering the no-op is covered in react/__tests__/plugin.test.tsx —
    // react-dom is externalized, so once a production-stubbed test in THIS
    // worker loads it, resetModules cannot swap back the dev build that
    // testing-library needs
    const impl = await import('../react/plugin');
    const noOp = impl.streamDevtoolsNoOpPlugin;

    expect(noOp.name).toBe('Streams');
    expect(noOp.id).toBe('accelint-stream');
    expect(typeof noOp.render).toBe('function');
  });
});
