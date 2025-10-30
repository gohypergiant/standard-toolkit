import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { afterEach, expect } from 'vitest';
import { FORCE_BOUND } from '@/constants';
import { eventStore } from '@/stores/event-store';
import { hotkeyStore } from '@/stores/hotkey-store';
import type { HotkeyConfig } from '@/types/hotkey-config';

expect.extend(matchers);

export const addHotkey = (hotkeyConfig: HotkeyConfig) => {
  hotkeyStore.getState().registerHotkey(hotkeyConfig);
  hotkeyStore.getState().activateHotkey(hotkeyConfig.id, FORCE_BOUND);
};

export const initStore = () => {
  hotkeyStore.setState(hotkeyStore.getInitialState());
  eventStore.setState(eventStore.getInitialState());
};

afterEach(() => {
  cleanup();
});
