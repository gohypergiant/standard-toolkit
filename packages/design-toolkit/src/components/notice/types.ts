// __private-exports NoticeColor, NoticeIconProps
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

import type { Payload, StructuredCloneableData } from '@accelint/bus';
import type { UniqueId } from '@accelint/core';
import type { ToastListProps } from 'react-aria-components';
import type { ButtonProps } from '../button/types';
import type { NoticeEventTypes } from './events';

/**
 * Color variant for notices indicating severity level.
 */
export type NoticeColor =
  | 'info'
  | 'advisory'
  | 'normal'
  | 'serious'
  | 'critical';

type ActionButtonProps = Pick<ButtonProps, 'color' | 'variant'> & {
  children: string;
};

/**
 * Data structure for notice content in the queue.
 */
export type NoticeContent = {
  /** Unique identifier for the notice. */
  id: UniqueId;
  /** Message text to display. */
  message: string;
  /** Color variant indicating severity. */
  color?: NoticeColor;
  /** Primary action button configuration. */
  primary?: ActionButtonProps;
  /** Secondary action button configuration. */
  secondary?: ActionButtonProps;
  /** Auto-dismiss timeout in milliseconds. */
  timeout?: number;
  /** Target NoticeList ID for routing. */
  target?: UniqueId;
  /** Custom metadata for filtering and matching. */
  metadata?: Record<string, StructuredCloneableData>;
};

/**
 * Props for the NoticeIcon component.
 */
export type NoticeIconProps = {
  /** Color variant determining which icon to display. */
  color?: NoticeColor;
  /** Size of the icon. */
  size: 'small' | 'medium';
};

/**
 * Props for the NoticeList component.
 */
export type NoticeListProps = {
  /** Unique identifier for targeting notices to this list. */
  id?: UniqueId;
  /** Position of the notice list on screen. */
  placement?:
    | 'top left'
    | 'top'
    | 'top right'
    | 'right'
    | 'bottom right'
    | 'bottom'
    | 'bottom left'
    | 'left';
  /** Maximum number of visible notices. */
  limit?: number;
  /** Default color for notices without explicit color. */
  defaultColor?: NoticeColor;
  /** Default timeout for notices without explicit timeout. */
  defaultTimeout?: number;
  /** Whether to hide the "Clear All" button. */
  hideClearAll?: boolean;
  /** Size variant for notices in the list. */
  size?: 'small' | 'medium';
  /** Whether to use global ToastRegion for portal rendering. */
  global?: boolean;
  /** CSS class names for list elements. */
  classNames?: {
    /** Class name for the region container. */
    region?: string;
    /** Class name for the toast list. */
    list?: ToastListProps<NoticeContent>['className'];
    /** Class name for the clear all button. */
    button?: ButtonProps['className'];
    /** Class names for individual notices. */
    notice?: NoticeProps['classNames'];
  };
};

/**
 * Props for the Notice component.
 */
export type NoticeProps = Omit<
  NoticeContent,
  'metadata' | 'timeout' | 'target'
> & {
  /** Unique identifier for the notice. */
  id: UniqueId;
  /** CSS class names for notice elements. */
  classNames?: {
    /** Class name for the notice container. */
    notice?: string;
    /** Class name for the content wrapper. */
    content?: string;
    /** Class name for the message text. */
    message?: string;
    /** Class name for the actions container. */
    actions?: string;
  };
  /** Whether to hide the status icon. */
  hideIcon?: boolean;
  /** Whether to show the close button. */
  showClose?: boolean;
  /** Whether to close the notice when an action button is pressed. */
  shouldCloseOnAction?: boolean;
  /** Size variant for the notice. */
  size?: 'small' | 'medium';
  /** Callback when primary action button is pressed. */
  onPrimaryAction?: () => void;
  /** Callback when secondary action button is pressed. */
  onSecondaryAction?: () => void;
  /** Callback when the notice is closed. */
  onClose?: () => void;
};

/**
 * Event payload for queuing a new notice via the bus.
 */
export type NoticeQueueEvent = Payload<
  typeof NoticeEventTypes.queue,
  Omit<NoticeContent, 'id'> & {
    id?: UniqueId;
  }
>;

/**
 * Event payload for removing notices from the queue via the bus.
 */
export type NoticeDequeueEvent = Payload<
  typeof NoticeEventTypes.dequeue,
  {
    id?: UniqueId;
    target?: UniqueId;
    color?: NoticeColor;
    metadata?: Record<string, StructuredCloneableData>;
  }
>;

/**
 * Event payload for notice action events via the bus.
 */
export type NoticeActionEvent = Payload<
  | typeof NoticeEventTypes.actionPrimary
  | typeof NoticeEventTypes.actionSecondary
  | typeof NoticeEventTypes.close,
  { id: UniqueId }
>;
