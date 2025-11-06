import type { Payload } from '@accelint/bus';
import type { UniqueId } from '@accelint/core';
import type { MapCursorEvents } from './events';

export type CursorDefaults = {
  default: string;
  hover: string;
  drag: string;
};

export type CursorState = keyof CursorDefaults;

/**
 * Payload emitted when the map cursor has successfully changed.
 */
export type CursorChangedPayload = {
  /** The cursor before the change */
  previousCursor: string;
  /** The cursor after the change */
  currentCursor: string;
  /** The ID of the map this event is for */
  id: UniqueId;
};

/**
 * Payload for requesting a map cursor change.
 * This initiates the cursor change flow.
 */
export type CursorChangeRequestPayload = {
  /** The cursor being requested */
  desiredCursor: string;
  /** The identifier of the component requesting the cursor change */
  owner: string;
  /** The ID of the map this event is for */
  id: UniqueId;
};

export type MapCursorStateChangePayload = {
  /** The next map cursor state */
  state: CursorState;
  /** The ID of the map this event is for */
  id: UniqueId;
};

/**
 * Event type for mode change notifications.
 * Emitted when the map mode has successfully changed.
 */
export type CursorChangedEvent = Payload<
  typeof MapCursorEvents.changed,
  CursorChangedPayload
>;

/**
 * Event type for cursor change requests.
 * Emitted when a component requests a cursor change.
 */
export type CursorChangeRequestEvent = Payload<
  typeof MapCursorEvents.changeRequest,
  CursorChangeRequestPayload
>;

/**
 * Event type for mode change authorization requests.
 * Emitted when a mode change requires approval from the current mode owner.
 */
export type MapCursorStateChangeEvent = Payload<
  typeof MapCursorEvents.changeState,
  MapCursorStateChangePayload
>;

/**
 * Union type of all map cursor event types that can be emitted through the event bus.
 */
export type MapCursorEventType =
  | CursorChangedEvent
  | CursorChangeRequestEvent
  | MapCursorStateChangeEvent;
