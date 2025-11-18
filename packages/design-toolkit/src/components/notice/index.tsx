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

import { Cancel } from '@accelint/icons';
import 'client-only';
import { clsx } from 'clsx';
import {
  Text,
  UNSTABLE_Toast as Toast,
  UNSTABLE_ToastContent as ToastContent,
} from 'react-aria-components';
import { Button } from '../button';
import { Icon } from '../icon';
import { NoticeIcon } from './notice-icon';
import styles from './styles.module.css';
import type { ButtonProps } from '../button/types';
import type { NoticeColor, NoticeProps } from './types';

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
      className={clsx('group/notice', styles.notice, classNames?.notice)}
      toast={{ key: id, content: message, onClose }}
      data-color={color}
      data-size={size}
    >
      <ToastContent className={clsx(styles.content, classNames?.content)}>
        {!hideIcon && size === 'medium' && (
          <NoticeIcon color={color} size={size} />
        )}
        <Text
          slot='description'
          className={clsx(styles.message, classNames?.message)}
        >
          {message}
        </Text>
        {(primary || secondary) && (
          <div className={clsx(styles.actions, classNames?.actions)}>
            {primary && (
              <Button
                color={ButtonColorMap[color]}
                variant='filled'
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
                color={ButtonColorMap[color]}
                variant='outline'
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
