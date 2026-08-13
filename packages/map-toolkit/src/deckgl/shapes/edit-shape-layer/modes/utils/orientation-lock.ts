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

import { BBOX_ORIENTATION_CONFIG_KEY } from '../oriented-scale-mode';
import { SessionCache } from './session-cache';
import type {
  FeatureCollection,
  ModeProps,
} from '@deck.gl-community/editable-layers';
import type { Feature } from 'geojson';

/**
 * Snapshot-on-enter, clear-on-exit lock. Captures a value on the first
 * frame `active` is true, holds it across subsequent active frames,
 * clears when `active` flips false. Used to freeze the oriented bounding
 * box at the start of a scale drag so the scale-origin lookup anchors
 * at a fixed world position.
 */
class TransientLock<TValue> {
  private value: TValue | null = null;

  sync(active: boolean, snapshot: () => TValue | null): TValue | null {
    if (!active) {
      this.value = null;

      return null;
    }

    if (this.value === null) {
      this.value = snapshot();
    }

    return this.value;
  }

  reset(): void {
    this.value = null;
  }
}

/**
 * Set→unset edge detector for deck.gl's transient property semantics.
 * `RotateMode` writes `properties.rotationAngle` during a rotate drag
 * and deletes it on completion; the value at the moment of deletion is
 * the gesture's cumulative delta. This class returns that committed
 * value once, on the frame the transition is observed.
 */
class TransitionDetector<TValue> {
  private last: TValue | undefined;

  observe(current: TValue | undefined): TValue | undefined {
    const committed =
      this.last !== undefined && current === undefined ? this.last : undefined;
    this.last = current;

    return committed;
  }

  reset(): void {
    this.last = undefined;
  }
}

/**
 * Per-frame snapshot returned by {@link OrientationLock.observe}. The
 * caller computes the live oriented bounding box itself; the lock only
 * exposes the cumulative angle (so the caller can recompute the box at
 * the right orientation) and the *locked* box (non-null only during a
 * scale drag, used to patch ScaleMode's corner-origin cache).
 */
export type OrientationSnapshot<TBoundingBox> = {
  angleDeg: number;
  lockedBoundingBox: TBoundingBox | null;
};

function readShapeId(feature: Feature | undefined): string | undefined {
  const shapeId = feature?.properties?.shapeId;

  return typeof shapeId === 'string' ? shapeId : undefined;
}

function readRotationAngle(feature: Feature | undefined): number | undefined {
  const angle = feature?.properties?.rotationAngle;

  return typeof angle === 'number' ? angle : undefined;
}

/**
 * Normalize a compass-positive angle into `[0, 360)`. Cosine/sine work
 * on any value, so this is purely about keeping the stored angle bounded
 * across long edit sessions: 10 full rotations otherwise leave the
 * cumulative angle at 3600 degrees, which is correct but surprising if
 * the value ever leaks into UI, logs, or serialization.
 *
 * Handles negative inputs via the `((x % 360) + 360) % 360` idiom (JS's
 * `%` returns the dividend's sign, which would leave −90 as −90).
 */
function normalizeAngle(angleDeg: number): number {
  return ((angleDeg % 360) + 360) % 360;
}

/**
 * Tracks the cumulative session rotation angle and the scale-drag
 * snapshot of the oriented bounding box for a single editing shape.
 * Composed of three internal primitives that match the actual seams in
 * the problem: shape-identity caching ({@link SessionCache}), drag
 * lifecycle ({@link TransientLock}), and deck.gl's transient-property
 * edge semantics ({@link TransitionDetector}).
 *
 * Generic over the bounding-box type so the lock stays decoupled from
 * the OBB math module — callers inject a `computeBoundingBox` closure.
 *
 * Lifecycle (one frame, called from `getGuides`):
 *
 * 1. `observe({ feature, isScaling, computeBoundingBox })` advances the
 *    state machine and returns `{ angleDeg, lockedBoundingBox }`.
 * 2. Caller computes the *live* bounding box at `angleDeg` for chrome.
 * 3. Caller uses `lockedBoundingBox` (if non-null) to patch the
 *    scale-origin cache; falls back to the live box otherwise.
 *
 * `decorateProps` runs from drag handlers to pipe `angleDeg` into deck.gl's
 * `modeConfig` so sibling sub-modes (`OrientedScaleMode`) can read it.
 *
 * `reset` is called when the React layer detects a shape-id change, so
 * a freshly-opened edit session starts at `angleDeg = 0`.
 */
export class OrientationLock<TBoundingBox> {
  private orientation = new SessionCache<{ angleDeg: number }>();
  private scaleLock = new TransientLock<TBoundingBox>();
  private rotationDelta = new TransitionDetector<number>();

  observe(args: {
    feature: Feature | undefined;
    isScaling: boolean;
    computeBoundingBox: (angleDeg: number) => TBoundingBox | null;
  }): OrientationSnapshot<TBoundingBox> {
    const { feature, isScaling, computeBoundingBox } = args;
    const shapeId = readShapeId(feature);
    const liveDelta = readRotationAngle(feature);

    if (shapeId !== undefined) {
      this.orientation.getOrInit(shapeId, () => ({ angleDeg: 0 }));
    }

    const committed = this.rotationDelta.observe(liveDelta);

    if (committed !== undefined && shapeId !== undefined) {
      this.orientation.update(shapeId, (value) => {
        value.angleDeg = normalizeAngle(value.angleDeg + committed);
      });
    }

    const angleDeg = this.orientation.peek(shapeId)?.angleDeg ?? 0;
    const lockedBoundingBox = this.scaleLock.sync(isScaling, () =>
      computeBoundingBox(angleDeg),
    );

    return { angleDeg, lockedBoundingBox };
  }

  /**
   * Wrap `props` so its `modeConfig` carries the cumulative rotation
   * angle. Returns the original reference unchanged when the angle is
   * zero — keeps the no-op path allocation-free for the common case
   * (no rotation has occurred yet).
   */
  decorateProps(
    props: ModeProps<FeatureCollection>,
  ): ModeProps<FeatureCollection> {
    const angleDeg = this.orientation.peek()?.angleDeg ?? 0;

    if (angleDeg === 0) {
      return props;
    }

    return {
      ...props,
      modeConfig: {
        ...props.modeConfig,
        [BBOX_ORIENTATION_CONFIG_KEY]: angleDeg,
      },
    };
  }

  /**
   * Clear the entire session state — cumulative rotation angle, in-flight
   * rotation delta, and scale-drag bounding-box snapshot. Called by the
   * React layer when the editing shape ID changes so a freshly-opened
   * shape starts at `angleDeg === 0` with no leftover scale lock.
   */
  reset(): void {
    this.orientation.reset();
    this.scaleLock.reset();
    this.rotationDelta.reset();
  }
}
