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

/**
 * Constants and pre-compiled patterns for MemLab memory leak testing
 *
 * This module centralizes magic numbers and regex patterns for:
 * - Better performance (pre-compiled regex)
 * - Easier maintenance (single source of truth)
 * - Better documentation of what each value means
 */

// =============================================================================
// TIMEOUT CONSTANTS (milliseconds)
// =============================================================================

/** Timeout for establishing CDP connection */
export const CDP_CONNECTION_TIMEOUT_MS = 10_000;

/** Timeout for collecting heap snapshot chunks */
export const SNAPSHOT_CHUNK_TIMEOUT_MS = 60_000;

/** Default delay for cleanup/GC to complete */
export const DEFAULT_CLEANUP_DELAY_MS = 500;

/** Default delay between stress test cycles */
export const DEFAULT_STRESS_TEST_DELAY_MS = 25;

/** Playwright test timeout */
export const DEFAULT_PLAYWRIGHT_TIMEOUT_MS = 120_000;

/** Web server startup timeout */
export const DEFAULT_WEBSERVER_TIMEOUT_MS = 180_000;

// =============================================================================
// SIZE THRESHOLDS (bytes)
// =============================================================================

/** Default maximum retained size for components (1 MB) */
export const DEFAULT_MAX_RETAINED_SIZE = 1_048_576;

/** Size threshold for filtering React components */
export const FILTER_COMPONENT_SIZE_THRESHOLD = 1_000;

/** Size threshold for filtering HTML elements */
export const FILTER_HTML_ELEMENT_SIZE_THRESHOLD = 500;

/** Size threshold for filtering React Fiber nodes */
export const FILTER_FIBER_NODE_SIZE_THRESHOLD = 5_000;

// =============================================================================
// TEST CONFIGURATION
// =============================================================================

/** Default number of stress test cycles */
export const DEFAULT_STRESS_TEST_CYCLES = 10;

/** Maximum number of history entries to keep in baseline */
export const MAX_BASELINE_HISTORY_ENTRIES = 50;

/** Version number for baseline file format */
export const BASELINE_VERSION = 1;

// =============================================================================
// PRE-COMPILED REGEX PATTERNS
// =============================================================================

/**
 * Pre-compiled regex patterns for parsing MemLab leak information
 *
 * These patterns are compiled once at module load time for better performance
 * when processing multiple leaks.
 */
export const LEAK_PATTERNS = {
  /**
   * Matches detached DOM elements in leak descriptions
   * Example: "[Detached <div class=\"example\">]"
   * Captures: element tag and attributes
   */
  detached: /\[Detached\s+<([^>]+)>/,

  /**
   * Matches object descriptions with type and ID
   * Example: "[Object](native) @123456"
   * Captures: [1] description, [2] type, [3] object ID
   */
  object: /\[([^\]]+)\]\((\w+)\)\s*@(\d+)/,

  /**
   * Matches retained size in leak keys
   * Example: "$retained-size:123456"
   * Captures: size in bytes
   */
  retainedSize: /\$retained-size:(\d+)/,

  /**
   * Matches class names in HTML element descriptions
   * Example: 'class="example-class another-class"'
   * Captures: class name string
   */
  className: /class="([^"]+)"/,

  /**
   * Matches data attributes in HTML element descriptions
   * Example: 'data-testid="button-test"'
   * Captures: [1] attribute name, [2] attribute value
   */
  dataAttribute: /data-([a-z-]+)="([^"]+)"/g,

  /**
   * Matches React component names in stack traces
   * Example: "at Button (./src/Button.tsx:42:15)"
   * Captures: component name
   */
  reactComponent: /at\s+([A-Z][a-zA-Z0-9]*)\s+\(/,

  /**
   * Matches fiber node indicators
   * Example: "FiberNode", "_reactFiber"
   */
  fiberNode: /(?:FiberNode|_reactFiber|__reactInternalInstance)/,

  /**
   * Matches @accelint/bus channel indicators
   */
  busChannel: /(?:BroadcastChannel|@accelint\/bus|MessageChannel)/,

  /**
   * Matches portal container indicators
   */
  portalContainer: /(?:portal|Portal|PortalProvider|portalContainer)/i,

  /**
   * Matches React context indicators
   */
  reactContext: /(?:Context\.Provider|Context\.Consumer|useContext)/,
} as const;

/**
 * Type for leak pattern names
 */
export type LeakPatternName = keyof typeof LEAK_PATTERNS;

/**
 * Test a string against a leak pattern
 *
 * @param pattern - Name of the pattern to use
 * @param text - Text to test
 * @returns Whether the pattern matches
 */
export function testLeakPattern(
  pattern: LeakPatternName,
  text: string,
): boolean {
  return LEAK_PATTERNS[pattern].test(text);
}

/**
 * Match a string against a leak pattern
 *
 * @param pattern - Name of the pattern to use
 * @param text - Text to match
 * @returns Match result or null
 */
export function matchLeakPattern(
  pattern: LeakPatternName,
  text: string,
): RegExpMatchArray | null {
  return text.match(LEAK_PATTERNS[pattern]);
}

// =============================================================================
// DIRECTORY NAMES
// =============================================================================

/** Default directory name for snapshot data */
export const SNAPSHOT_DATA_DIR = 'data';

/** Subdirectory for current snapshot run */
export const SNAPSHOT_CUR_DIR = 'cur';

/** File extension for heap snapshots */
export const HEAP_SNAPSHOT_EXTENSION = '.heapsnapshot';

/** Filename for snapshot sequence metadata */
export const SNAP_SEQ_FILENAME = 'snap-seq.json';

/** Filename for run metadata */
export const RUN_META_FILENAME = 'run-meta.json';
