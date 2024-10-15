// Support React Aria's BaseEvent & PressEvent (and any others the might share the same interface)
type ContinuableEvent = {
  continuePropagation: () => void;
};

/**
 * The default behavior of events within React Aria is to stop progagation
 *
 * To reenable propagation, continuePropagation must be called
 */
export function continuePropagation(event: ContinuableEvent) {
  event.continuePropagation();
}
