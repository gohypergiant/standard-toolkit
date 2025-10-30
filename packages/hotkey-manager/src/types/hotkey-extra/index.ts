export type HotkeyExtra = {
  /**
   * Developer friendly id to identify the hotkey.
   *
   * @default Random UID
   */
  id: string;
  /**
   * Number of milliseconds before triggering the `onKeyHeld` callback.
   *
   * @default 1000
   */
  heldThresholdMs: number;
  /**
   * Always fire the `onKeyUp` action, even if an `onKeyHeld` action was triggered.
   *
   * @default false
   */
  alwaysTriggerKeyUp: boolean;
  /**
   * Skip the conflict check for this hotkey.
   *
   * @default false
   */
  ignoreConflicts: boolean;
  /**
   * Fire the events even on input fields.
   *
   * @default false
   */
  allowInputFields: boolean;
};
