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
import { clsx } from '@accelint/design-foundation/lib/utils';
import Cancel from '@accelint/icons/cancel';
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

/**
 * Notice - Notification component for temporary messages and alerts
 *
 * Displays messages with optional action buttons and close functionality.
 * Icons are automatically displayed based on the color variant.
 *
 * @example
 * <Notice
 *   id="notice-1"
 *   message="Operation completed"
 *   color="normal"
 * />
 *
 * @param props - {@link NoticeProps}
 * @param props.id - Unique identifier for the notice.
 * @param props.classNames - CSS class names for notice elements.
 * @param props.color - Color variant indicating severity.
 * @param props.message - Message text to display.
 * @param props.primary - Primary action button configuration.
 * @param props.secondary - Secondary action button configuration.
 * @param props.hideIcon - Whether to hide the status icon.
 * @param props.showClose - Whether to show the close button.
 * @param props.shouldCloseOnAction - Whether to close the notice when an action button is pressed.
 * @param props.size - Size variant for the notice.
 * @param props.onPrimaryAction - Callback when primary action button is pressed.
 * @param props.onSecondaryAction - Callback when secondary action button is pressed.
 * @param props.onClose - Callback when the notice is closed.
 * @returns The rendered Notice component.
 */
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
