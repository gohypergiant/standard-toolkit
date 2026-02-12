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

import { getLogger } from '@accelint/logger';
import type { IHeapEdge, IHeapNode, IHeapSnapshot } from '@memlab/core';

/**
 * Retained size thresholds (in bytes) for leak detection.
 * These values filter out small/insignificant nodes to reduce false positives.
 */

/** Minimum retained size to flag detached HTML elements */
const MIN_DETACHED_DOM_ELEMENT_SIZE = 500;

/** Minimum retained size to flag React component instances */
const MIN_COMPONENT_RETAINED_SIZE = 1000;

/** Minimum retained size to flag retained event listener arrays */
const MIN_LISTENERS_RETAINED_SIZE = 1000;

/** Minimum retained size to flag portal container elements */
const MIN_PORTAL_RETAINED_SIZE = 1000;

/** Minimum retained size to flag Broadcast singleton references */
const MIN_BROADCAST_RETAINED_SIZE = 5000;

/** Minimum retained size to flag Context objects with consumer references */
const MIN_CONTEXT_RETAINED_SIZE = 10000;

/**
 * Logger for filter debug output
 */
const logger = getLogger({
  enabled: !!process.env.DEBUG_MEMLAB,
  level: 'debug',
  prefix: '[MemLab:Filters]',
});

/**
 * Custom leak filter interface matching MemLab's ILeakFilter
 */
export interface CustomLeakFilter {
  /** Called once before filtering begins */
  beforeLeakFilter?: (
    snapshot: IHeapSnapshot,
    leakedNodeIds: Set<number>,
  ) => void;

  /** Determines if a node should be considered a leak */
  leakFilter?: (
    node: IHeapNode,
    snapshot: IHeapSnapshot,
    leakedNodeIds: Set<number>,
  ) => boolean;

  /** Determines if an edge should be included in retainer traces */
  retainerReferenceFilter?: (
    edge: IHeapEdge,
    snapshot: IHeapSnapshot,
    isReferenceUsedByDefault: boolean,
  ) => boolean;
}

/**
 * Filter for detecting React Fiber node leaks
 *
 * React maintains a Fiber tree for rendering. When components unmount,
 * their Fiber nodes should be garbage collected. This filter detects
 * Fiber nodes that are retained after unmount.
 */
export const fiberNodeFilter: CustomLeakFilter = {
  beforeLeakFilter: (_snapshot, leakedNodeIds) => {
    logger.debug(
      `🔍 Analyzing ${leakedNodeIds.size} potential leaks for Fiber nodes`,
    );
  },

  leakFilter: (node) => {
    const name = node.name || '';

    // Detect FiberNode objects
    if (name === 'FiberNode' || name === 'FiberRootNode') {
      return true;
    }

    // Detect React component instances that weren't cleaned up
    if (
      name.includes('Component') &&
      node.retainedSize > MIN_COMPONENT_RETAINED_SIZE
    ) {
      return true;
    }

    // Detect detached DOM elements by checking for HTMLElement types
    // that are retained but no longer in the document
    if (
      name.startsWith('HTML') &&
      name.endsWith('Element') &&
      node.retainedSize > MIN_DETACHED_DOM_ELEMENT_SIZE
    ) {
      return true;
    }

    return false;
  },

  retainerReferenceFilter: (edge, _snapshot, isReferenceUsedByDefault) => {
    const edgeName = edge.name_or_index?.toString() || '';

    // Include React-related references in traces
    if (
      edgeName.includes('fiber') ||
      edgeName.includes('stateNode') ||
      edgeName.includes('alternate')
    ) {
      return true;
    }

    return isReferenceUsedByDefault;
  },
};

/**
 * Filter for detecting @accelint/bus subscription leaks
 *
 * The Broadcast class uses BroadcastChannel for inter-context communication.
 * Components using useOn/useEmit must properly clean up their subscriptions
 * when unmounting.
 */
export const busSubscriptionFilter: CustomLeakFilter = {
  beforeLeakFilter: (_snapshot, leakedNodeIds) => {
    logger.debug(
      `🔍 Analyzing ${leakedNodeIds.size} potential leaks for bus subscriptions`,
    );
  },

  leakFilter: (node) => {
    const name = node.name || '';
    const type = node.type || '';

    // Detect BroadcastChannel instances that weren't closed
    if (name === 'BroadcastChannel') {
      return true;
    }

    // Detect Broadcast singleton references
    if (name === 'Broadcast' || name.includes('Broadcast')) {
      // Only flag if retained size is significant
      if (node.retainedSize > MIN_BROADCAST_RETAINED_SIZE) {
        return true;
      }
    }

    // Detect event listener closures that weren't removed
    if (type === 'closure') {
      const closureName = name.toLowerCase();
      if (
        closureName.includes('listener') ||
        closureName.includes('handler') ||
        closureName.includes('callback') ||
        closureName.includes('onmessage')
      ) {
        return true;
      }
    }

    // Detect retained listeners array entries
    if (
      name === 'listeners' &&
      node.retainedSize > MIN_LISTENERS_RETAINED_SIZE
    ) {
      return true;
    }

    return false;
  },

  retainerReferenceFilter: (edge, _snapshot, isReferenceUsedByDefault) => {
    const edgeName = edge.name_or_index?.toString() || '';

    // Include bus-related references in traces for debugging
    if (
      edgeName.includes('bus') ||
      edgeName.includes('broadcast') ||
      edgeName.includes('channel') ||
      edgeName.includes('listener') ||
      edgeName.includes('emit')
    ) {
      return true;
    }

    return isReferenceUsedByDefault;
  },
};

/**
 * Filter for detecting React Context provider leaks
 *
 * Context providers can retain references to their consumers.
 * When components unmount, context subscriptions should be cleaned up.
 */
export const contextLeakFilter: CustomLeakFilter = {
  leakFilter: (node) => {
    const name = node.name || '';

    // Detect Context objects
    if (name === 'Context' || name.includes('Context')) {
      // Only flag if retained size suggests consumer references
      if (node.retainedSize > MIN_CONTEXT_RETAINED_SIZE) {
        return true;
      }
    }

    // Detect Provider/Consumer pairs
    if (name === 'Provider' || name === 'Consumer') {
      return true;
    }

    return false;
  },
};

/**
 * Filter for detecting portal/overlay leaks
 *
 * Components like Drawer, Dialog, Tooltip use portals to render
 * outside the normal DOM hierarchy. Portal containers should be
 * properly cleaned up when the component unmounts.
 */
export const portalLeakFilter: CustomLeakFilter = {
  leakFilter: (node) => {
    const name = node.name || '';

    // Detect portal container elements (div elements with significant retained size)
    if (
      name === 'HTMLDivElement' &&
      node.retainedSize > MIN_PORTAL_RETAINED_SIZE
    ) {
      return true;
    }

    // Detect React portal root references
    if (name.includes('portal') || name.includes('Portal')) {
      return true;
    }

    // Detect overlay container leaks
    if (name.includes('overlay') || name.includes('Overlay')) {
      return true;
    }

    return false;
  },
};

/**
 * Composite filter that combines all design-toolkit specific filters
 *
 * This is the recommended filter to use for comprehensive leak detection
 * across all design-toolkit components.
 */
export const designToolkitFilter: CustomLeakFilter = {
  beforeLeakFilter: (_snapshot, leakedNodeIds) => {
    logger.debug(
      `🔍 [design-toolkit] Analyzing ${leakedNodeIds.size} potential leaks`,
    );
  },

  leakFilter: (node, snapshot, leakedNodeIds) => {
    // Apply all filters and return true if any match
    return (
      (fiberNodeFilter.leakFilter?.(node, snapshot, leakedNodeIds) ?? false) ||
      (busSubscriptionFilter.leakFilter?.(node, snapshot, leakedNodeIds) ??
        false) ||
      (contextLeakFilter.leakFilter?.(node, snapshot, leakedNodeIds) ??
        false) ||
      (portalLeakFilter.leakFilter?.(node, snapshot, leakedNodeIds) ?? false)
    );
  },

  retainerReferenceFilter: (edge, snapshot, isReferenceUsedByDefault) => {
    // Apply all retainer filters
    return (
      (fiberNodeFilter.retainerReferenceFilter?.(
        edge,
        snapshot,
        isReferenceUsedByDefault,
      ) ??
        isReferenceUsedByDefault) ||
      (busSubscriptionFilter.retainerReferenceFilter?.(
        edge,
        snapshot,
        isReferenceUsedByDefault,
      ) ??
        isReferenceUsedByDefault)
    );
  },
};

/**
 * Export a map of all available filters for easy selection
 */
export const filters = {
  fiber: fiberNodeFilter,
  bus: busSubscriptionFilter,
  context: contextLeakFilter,
  portal: portalLeakFilter,
  designToolkit: designToolkitFilter,
} as const;

export type FilterName = keyof typeof filters;
