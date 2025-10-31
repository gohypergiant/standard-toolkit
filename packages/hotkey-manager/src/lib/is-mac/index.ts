import { isClient } from '@/lib/is-client';

/**
 * Is `true` when client-side and on a Mac
 */
export const isMac =
  isClient && window.navigator.userAgent.indexOf('Mac') !== -1;
