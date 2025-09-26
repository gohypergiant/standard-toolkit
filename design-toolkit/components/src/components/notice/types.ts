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

import type { Payload } from '@accelint/bus';
import type { UniqueId } from '@accelint/core';
import type { RefObject } from 'react';
import type { ButtonProps } from '../button/types';
import type { NoticeEventTypes } from './events';

export type NoticeColor =
  | 'info'
  | 'advisory'
  | 'normal'
  | 'critical'
  | 'serious';

type ActionButtonProps = Pick<ButtonProps, 'color' | 'size' | 'variant'> & {
  children: string;
};

export type NoticeContent = {
  id: UniqueId;
  message: string;
  color?: NoticeColor;
  primary?: ActionButtonProps;
  secondary?: ActionButtonProps;
  timeout?: number;
  target?: UniqueId;
  metadata?: Record<string, unknown>;
};

export type NoticeIconProps = {
  variant?: 'info' | 'advisory' | 'normal' | 'critical' | 'serious';
  size: 'small' | 'medium';
};

export type NoticeListProps = {
  id?: UniqueId;
  parentRef?: RefObject<HTMLElement | null>;
  placement?:
    | 'top left'
    | 'top'
    | 'top right'
    | 'right'
    | 'bottom right'
    | 'bottom'
    | 'bottom left'
    | 'left';
  limit?: number;
  defaultColor?: NoticeColor;
  defaultTimeout?: number;
  hideClearAll?: boolean;
  size?: 'small' | 'medium';
  classNames?: {
    region?: string;
    list?: string;
    button?: string;
    notice?: {
      notice?: string;
      content?: string;
      actions?: string;
    };
  };
};

export type NoticeProps = Omit<
  NoticeContent,
  'timeout' | 'target' | 'metadata'
> & {
  id: UniqueId;
  showClose?: boolean;
  hideIcon?: boolean;
  shouldCloseOnAction?: boolean;
  size?: 'small' | 'medium';
  classNames?: {
    notice?: string;
    content?: string;
    actions?: string;
  };
};

export type NoticeQueueEvent = Payload<
  typeof NoticeEventTypes.queue,
  Omit<NoticeContent, 'id'> & {
    id?: UniqueId;
  }
>;

export type DequeueId = { id: UniqueId };
export type DequeueList = { target: UniqueId };
export type DequeueColor = { color: NoticeColor };
export type DequeueMetadata = { metadata: Record<string, unknown> };

type DequeuePayload = DequeueId | DequeueList | DequeueColor | DequeueMetadata;

export type NoticeDequeueEvent = Payload<
  typeof NoticeEventTypes.dequeue,
  DequeuePayload
>;

export type NoticePressEvent = Payload<
  | typeof NoticeEventTypes.primaryOnPress
  | typeof NoticeEventTypes.secondaryOnPress
  | typeof NoticeEventTypes.close,
  { id: UniqueId }
>;
