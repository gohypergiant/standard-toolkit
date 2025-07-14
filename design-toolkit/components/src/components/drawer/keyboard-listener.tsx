'use client';

import { useEffect } from 'react';
import type { DrawerState } from './types';
import {
  toggleBottomPanel,
  toggleLeftPanel,
  toggleRightPanel,
  toggleTopPanel,
} from './toggle-utils';

const layouts = [
  'left and right',
  'top and bottom',
  'top',
  'bottom',
  'left',
  'right',
] as const;

const toggleFns = {
  left: toggleLeftPanel,
  right: toggleRightPanel,
  top: toggleTopPanel,
  bottom: toggleBottomPanel,
} as const;
const toggleOptions = ['closed', 'open'] as [DrawerState, DrawerState];

function hotKey(panel: keyof typeof toggleFns, e: KeyboardEvent) {
  e.preventDefault();
  if (e.shiftKey) {
    modeToggle(panel);
  } else {
    toggleFns[panel](toggleOptions);
  }
  console.log(`Toggled ${panel} panel`);
}

/**
 * A client component that listens for keyboard events globally.
 * This component renders nothing but attaches keyboard event listeners to the document.
 */
export function KeyboardListener() {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input field
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        (event.target instanceof HTMLElement && event.target.isContentEditable)
      ) {
        return;
      }

      // Handle panel toggle shortcuts
      switch (event.key.toLowerCase()) {
        case '1': // intentional "fallthrough"
        case '2': // intentional "fallthrough"
        case '3': // intentional "fallthrough"
        case '4': // intentional "fallthrough"
        case '5': // intentional "fallthrough"
        case '6': // intentional "fallthrough"
          document
            .querySelector('[data-id]')
            ?.setAttribute('data-extend', layouts[+event.key - 1]);
          break;
        case 'a':
          hotKey('left', event);
          break;
        case 'd':
          hotKey('right', event);
          break;
        case 'w':
          hotKey('top', event);
          break;
        case 's':
          hotKey('bottom', event);
          break;
        case 'p':
          event.preventDefault();
          modeToggle('bottom');
          modeToggle('left');
          modeToggle('right');
          modeToggle('top');
          console.log('toggled all panel modes');
          break;

        default:
        // ignored
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  // This component renders nothing - it's purely for side effects
  return null;
}

function modeToggle(panel: string) {
  const container = document.querySelector(`[data-${panel}]`) as HTMLElement;
  const state = container?.dataset?.[panel] ?? 'over-open';
  const [mode] = state.match(/^\w+/) ?? [];
  const other = ['over', 'push'].find((str) => str !== mode);

  container.setAttribute(
    `data-${panel}`,
    state?.replace(mode ?? 'over', other ?? 'push'),
  );
}
