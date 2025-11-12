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

import type { Payload } from '@accelint/bus';
import type { UniqueId } from '@accelint/core';
import type { ToastListProps } from 'react-aria-components';
import type { ButtonProps } from '../button/types';
import type { NoticeEventTypes } from './events';

export type NoticeColor =
  | 'info'
  | 'advisory'
  | 'normal'
  | 'serious'
  | 'critical';

type ActionButtonProps = Pick<ButtonProps, 'color' | 'variant'> & {
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
  color?: NoticeColor;
  size: 'small' | 'medium';
};

export type NoticeListProps = {
  id?: UniqueId;
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
  global?: boolean;
  classNames?: {
    region?: string;
    list?: ToastListProps<NoticeContent>['className'];
    button?: ButtonProps['className'];
    notice?: NoticeProps['classNames'];
  };
};

export type NoticeProps = Omit<
  NoticeContent,
  'metadata' | 'timeout' | 'target'
> & {
  id: UniqueId;
  classNames?: {
    notice?: string;
    content?: string;
    message?: string;
    actions?: string;
  };
  hideIcon?: boolean;
  showClose?: boolean;
  shouldCloseOnAction?: boolean;
  size?: 'small' | 'medium';
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onClose?: () => void;
};

export type NoticeQueueEvent = Payload<
  typeof NoticeEventTypes.queue,
  Omit<NoticeContent, 'id'> & {
    id?: UniqueId;
  }
>;

export type NoticeDequeueEvent = Payload<
  typeof NoticeEventTypes.dequeue,
  {
    id?: UniqueId;
    target?: UniqueId;
    color?: NoticeColor;
    metadata?: Record<string, unknown>;
  }
>;

export type NoticeActionEvent = Payload<
  | typeof NoticeEventTypes.actionPrimary
  | typeof NoticeEventTypes.actionSecondary
  | typeof NoticeEventTypes.close,
  { id: UniqueId }
>;
