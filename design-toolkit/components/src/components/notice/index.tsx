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

'use client';

import 'client-only';
import { useBus } from '@accelint/bus/react';
import { uuid } from '@accelint/core';
import {
  Cancel,
  Information,
  Problem,
  Success,
  Warning,
} from '@accelint/icons';
import { useToastRegion } from '@react-aria/toast';
import { useToastQueue } from '@react-stately/toast';
import { isEqual } from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  composeRenderProps,
  type QueuedToast,
  Text,
  UNSTABLE_Toast as Toast,
  UNSTABLE_ToastContent as ToastContent,
  UNSTABLE_ToastList as ToastList,
  UNSTABLE_ToastQueue as ToastQueue,
  UNSTABLE_ToastRegion as ToastRegion,
  UNSTABLE_ToastStateContext as ToastStateContext,
} from 'react-aria-components';
import { Button } from '../button';
import { Icon } from '../icon';
import { NoticeEventTypes } from './events';
import { NoticeStyles } from './styles';
import type { ButtonProps } from '../button/types';
import type {
  NoticeActionEvent,
  NoticeColor,
  NoticeContent,
  NoticeDequeueEvent,
  NoticeIconProps,
  NoticeListProps,
  NoticeProps,
  NoticeQueueEvent,
} from './types';

const {
  notice,
  content,
  list,
  actions,
  region,
  message: description,
} = NoticeStyles();

function NoticeIcon({ color = 'info', size }: NoticeIconProps) {
  return (
    <Icon size={size === 'small' ? 'medium' : 'large'}>
      {color === 'info' && <Information />}
      {color === 'advisory' && <Information />}
      {color === 'normal' && <Success />}
      {color === 'serious' && <Warning />}
      {color === 'critical' && <Problem />}
    </Icon>
  );
}

const ButtonColorMap: Record<NoticeColor, ButtonProps['color']> = {
  normal: 'mono-bold',
  advisory: 'mono-bold',
  info: 'mono-bold',
  serious: 'serious',
  critical: 'critical',
};

export function Notice({
  id,
  classNames,
  color = 'info',
  message,
  primary,
  secondary,
  hideIcon,
  showClose,
  shouldCloseOnAction,
  size = 'medium',
  onPrimaryAction,
  onSecondaryAction,
  onClose,
}: NoticeProps) {
  return (
    <Toast
      className={notice({ className: classNames?.notice })}
      toast={{ key: id, content: message, onClose }}
      data-color={color}
      data-size={size}
    >
      <ToastContent className={content({ className: classNames?.content })}>
        {!hideIcon && <NoticeIcon color={color} size={size} />}
        <Text
          slot='description'
          className={description({ className: classNames?.message })}
        >
          {message}
        </Text>
        {(primary || secondary) && (
          <div className={actions({ className: classNames?.actions })}>
            {primary && (
              <Button
                variant='filled'
                color={ButtonColorMap[color]}
                {...primary}
                size={size}
                onPress={() => {
                  onPrimaryAction?.();

                  if (shouldCloseOnAction) {
                    onClose?.();
                  }
                }}
              />
            )}
            {secondary && (
              <Button
                variant='outline'
                color={ButtonColorMap[color]}
                {...secondary}
                size={size}
                onPress={() => {
                  onSecondaryAction?.();

                  if (shouldCloseOnAction) {
                    onClose?.();
                  }
                }}
              />
            )}
          </div>
        )}
        {showClose && (
          <Button
            color={ButtonColorMap[color]}
            variant='icon'
            onPress={onClose}
          >
            <Icon>
              <Cancel />
            </Icon>
          </Button>
        )}
      </ToastContent>
    </Toast>
  );
}

function matchesMetadata(
  payload: Record<string, unknown>,
  metadata?: Record<string, unknown>,
) {
  if (!metadata) {
    return false;
  }

  return Object.entries(payload).every(
    ([key, value]) => key in metadata && isEqual(metadata[key], value),
  );
}

function NoticeList({
  id,
  classNames,
  defaultColor,
  defaultTimeout,
  hideClearAll,
  limit = 3,
  global,
  placement,
  size = 'medium',
  ...rest
}: NoticeListProps) {
  const queue = useMemo(
    () => new ToastQueue<NoticeContent>({ maxVisibleToasts: limit }),
    [limit],
  );
  const state = useToastQueue(queue);

  const [hasNotices, setHasNotices] = useState(false);
  const ref = useRef(null);
  const { regionProps } = useToastRegion(rest, queue, ref);

  const { useEmit, useOn } = useBus<
    NoticeQueueEvent | NoticeDequeueEvent | NoticeActionEvent
  >();
  const emitActionPrimary = useEmit(NoticeEventTypes.actionPrimary);
  const emitActionSecondary = useEmit(NoticeEventTypes.actionSecondary);
  const emitClose = useEmit(NoticeEventTypes.close);

  useOn(NoticeEventTypes.queue, (data) => {
    if ((id && data.payload.target === id) || !id) {
      queue.add(
        {
          ...data.payload,
          id: data.payload.id || uuid(),
          color: defaultColor || data.payload.color,
        },
        {
          timeout: defaultTimeout ?? data.payload.timeout,
        },
      );
    }
  });

  useOn(NoticeEventTypes.dequeue, (data) => {
    // @ts-expect-error : queue.queue exists, but is not currently documented
    const queuedNotices = queue.queue;

    const dequeue = queuedNotices.filter((toast: QueuedToast<NoticeContent>) =>
      matchesMetadata(data.payload, toast.content),
    );

    if (dequeue.length && dequeue.length === queuedNotices.length) {
      queue.clear();
    } else {
      for (const toast of dequeue) {
        queue.close(toast.key);
      }
    }
  });

  useEffect(() => {
    queue.subscribe(() => {
      setHasNotices(queue.visibleToasts.length > 0);
    });
  });

  const children = (
    <>
      {!hideClearAll && hasNotices && (
        <Button
          className={composeRenderProps(
            classNames?.button,
            (className) => className ?? '',
          )}
          variant='outline'
          onPress={queue.clear}
        >
          Clear All
        </Button>
      )}
      <ToastList
        className={composeRenderProps(classNames?.list, (className) =>
          list({ className }),
        )}
      >
        {({ toast }: { toast: QueuedToast<NoticeContent> }) => (
          <Notice
            {...toast.content}
            key={toast.key}
            showClose={
              !(
                toast.timeout &&
                toast.content.primary &&
                toast.content.secondary
              )
            }
            classNames={classNames?.notice}
            size={size}
            onPrimaryAction={() => emitActionPrimary({ id: toast.content.id })}
            onSecondaryAction={() =>
              emitActionSecondary({ id: toast.content.id })
            }
            onClose={() => {
              toast.onClose?.();
              queue.close(toast.key);
              emitClose({ id: toast.content.id });
            }}
          />
        )}
      </ToastList>
    </>
  );

  return global ? (
    <ToastRegion
      className={region({ className: classNames?.region })}
      data-placement={placement}
      queue={queue}
    >
      {children}
    </ToastRegion>
  ) : (
    <div
      {...regionProps}
      className={region({ className: classNames?.region })}
      data-placement={placement}
      ref={ref}
    >
      <ToastStateContext.Provider value={state}>
        {children}
      </ToastStateContext.Provider>
    </div>
  );
}

Notice.List = NoticeList;
