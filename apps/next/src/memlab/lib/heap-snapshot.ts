/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import type { CDPSession, Page } from '@playwright/test';
import type { RunMetadata, SnapshotMetadata } from './types';

/** Timeout for establishing CDP connection (10 seconds) */
const CDP_CONNECTION_TIMEOUT_MS = 10_000;

/** Timeout for collecting heap snapshot chunks (60 seconds) */
const SNAPSHOT_CHUNK_TIMEOUT_MS = 60_000;

/**
 * Utility for collecting heap snapshots via Chrome DevTools Protocol
 *
 * This class manages the connection to CDP and handles capturing heap snapshots
 * at the three required phases: baseline, target, and final.
 */
export class HeapSnapshotCollector {
  private cdpSession: CDPSession | null = null;
  private outputDir: string;
  private snapshots: SnapshotMetadata[] = [];
  private componentName: string;
  private connected = false;

  constructor(outputDir: string, componentName: string) {
    this.outputDir = path.join(outputDir, 'data', 'cur');
    this.componentName = componentName;
    fs.mkdirSync(this.outputDir, { recursive: true });
  }

  /**
   * Initialize CDP session and enable heap profiler
   * @throws Error if CDP connection fails or times out
   */
  async initialize(page: Page): Promise<void> {
    // Create a timeout promise for connection
    let timeoutId: NodeJS.Timeout;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(
        () =>
          reject(
            new Error(
              `CDP connection timed out after ${CDP_CONNECTION_TIMEOUT_MS}ms`,
            ),
          ),
        CDP_CONNECTION_TIMEOUT_MS,
      );
    });

    try {
      // Race the CDP connection against the timeout
      this.cdpSession = await Promise.race([
        page.context().newCDPSession(page),
        timeoutPromise,
      ]);

      // Clear the timeout since connection succeeded
      clearTimeout(timeoutId!);

      if (!this.cdpSession) {
        throw new Error('CDP session returned null');
      }

      await this.cdpSession.send('HeapProfiler.enable');
      this.connected = true;
      console.log(
        `📡 [${this.componentName}] CDP session connected successfully`,
      );
    } catch (error) {
      this.connected = false;
      this.cdpSession = null;
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(
        `CDP connection failed for ${this.componentName}: ${errorMsg}`,
      );
    }
  }

  /**
   * Take a heap snapshot and save it to disk
   *
   * @param _page - Playwright page instance
   * @param type - The type of snapshot (baseline, target, or final)
   * @param name - Human-readable name for this snapshot step
   * @throws Error if CDP session not connected or snapshot collection fails/times out
   */
  async takeSnapshot(
    _page: Page,
    type: 'baseline' | 'target' | 'final',
    name: string,
  ): Promise<void> {
    if (!(this.cdpSession && this.connected)) {
      throw new Error('CDP session not connected. Call initialize() first.');
    }

    const idx = this.snapshots.length + 1;
    const snapshotPath = path.join(this.outputDir, `s${idx}.heapsnapshot`);

    try {
      // Get current heap usage
      const heapUsage = await this.cdpSession.send('Runtime.getHeapUsage');
      const usedSize = heapUsage.usedSize;

      // Collect heap snapshot chunks with timeout
      const chunks: string[] = [];
      let timeoutId: NodeJS.Timeout;

      // Create promise that resolves when snapshot is complete
      const snapshotPromise = new Promise<void>((resolve, reject) => {
        // Set up timeout
        timeoutId = setTimeout(() => {
          reject(
            new Error(
              `Snapshot collection timed out after ${SNAPSHOT_CHUNK_TIMEOUT_MS}ms`,
            ),
          );
        }, SNAPSHOT_CHUNK_TIMEOUT_MS);

        // Set up listener for snapshot chunks
        const chunkHandler = (event: { chunk: string }) => {
          chunks.push(event.chunk);
        };
        this.cdpSession?.on('HeapProfiler.addHeapSnapshotChunk', chunkHandler);

        // Request heap snapshot with progress reporting to know when done
        this.cdpSession
          ?.send('HeapProfiler.takeHeapSnapshot', {
            reportProgress: true,
          })
          .then(() => {
            // Snapshot request completed
            this.cdpSession?.off(
              'HeapProfiler.addHeapSnapshotChunk',
              chunkHandler,
            );
            clearTimeout(timeoutId);
            resolve();
          })
          .catch((err) => {
            this.cdpSession?.off(
              'HeapProfiler.addHeapSnapshotChunk',
              chunkHandler,
            );
            clearTimeout(timeoutId);
            reject(err);
          });
      });

      await snapshotPromise;

      // Validate we received data
      if (chunks.length === 0) {
        throw new Error('No snapshot chunks received from CDP');
      }

      // Write snapshot to file using async I/O
      await fs.promises.writeFile(snapshotPath, chunks.join(''));

      // Record metadata
      this.snapshots.push({
        name,
        snapshot: true,
        type,
        idx,
        JSHeapUsedSize: usedSize,
      });

      console.log(
        `📸 [${this.componentName}] Captured ${type} snapshot: ${name} (${formatBytes(usedSize)})`,
      );
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(
        `Snapshot collection failed for ${this.componentName} (${name}): ${errorMsg}`,
      );
    }
  }

  /**
   * Finalize snapshot collection and write metadata files
   *
   * @returns Path to the snapshot directory (parent of data/cur)
   * @throws Error if metadata files cannot be written
   */
  async finalize(): Promise<string> {
    try {
      // Write snap-seq.json (required by MemLab)
      const snapSeqPath = path.join(this.outputDir, 'snap-seq.json');
      await fs.promises.writeFile(
        snapSeqPath,
        JSON.stringify(this.snapshots, null, 2),
      );

      // Write run-meta.json (optional but helpful for debugging)
      const runMetaPath = path.join(this.outputDir, 'run-meta.json');
      const runMeta: RunMetadata = {
        app: 'design-toolkit-memlab',
        type: 'playwright-scenario',
        interaction: `${this.componentName}-memory-leak-test`,
        browserInfo: {
          // biome-ignore lint/style/useNamingConvention: matches MemLab's expected run-meta.json format
          _browserVersion: 'Chromium (Playwright)',
          // biome-ignore lint/style/useNamingConvention: matches MemLab's expected run-meta.json format
          _puppeteerConfig: {
            headless: true,
            defaultViewport: {
              width: 1280,
              height: 720,
            },
          },
        },
      };
      await fs.promises.writeFile(
        runMetaPath,
        JSON.stringify(runMeta, null, 2),
      );
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(
        `Failed to write snapshot metadata for ${this.componentName}: ${errorMsg}`,
      );
    }

    // Disconnect CDP session (best effort, don't throw on failure)
    await this.disconnect();

    // Return the parent directory (what MemLab's BrowserInteractionResultReader expects)
    return path.dirname(path.dirname(this.outputDir));
  }

  /**
   * Disconnect the CDP session
   * Safe to call multiple times
   */
  async disconnect(): Promise<void> {
    if (this.cdpSession) {
      try {
        await this.cdpSession.detach();
      } catch {
        // Ignore detach errors - session may already be closed
      }
      this.cdpSession = null;
      this.connected = false;
    }
  }

  /**
   * Check if the collector is connected
   */
  isConnected(): boolean {
    return this.connected && this.cdpSession !== null;
  }

  /**
   * Get the current snapshot count
   */
  getSnapshotCount(): number {
    return this.snapshots.length;
  }

  /**
   * Get the output directory path
   */
  getOutputDir(): string {
    return this.outputDir;
  }
}

/**
 * Format bytes into a human-readable string
 */
function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1048576) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  }
  return `${(bytes / 1048576).toFixed(2)} MB`;
}

export { formatBytes };
