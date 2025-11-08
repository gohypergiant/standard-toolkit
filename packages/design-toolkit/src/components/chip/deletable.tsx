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
import { CancelFill } from '@accelint/icons';
import {
  Tag as AriaTag,
  composeRenderProps,
  useContextProps,
} from 'react-aria-components';
import { Button } from '../button';
import { Icon } from '../icon';
import { ChipContext } from './context';
import { DeletableChipStyles } from './styles';
import type { DeletableChipProps } from './types';

const { chip: deletableChip, remove } = DeletableChipStyles();

export function DeletableChip({ ref, ...props }: DeletableChipProps) {
  [props, ref] = useContextProps(props, ref ?? null, ChipContext);

  const {
    children,
    classNames,
    size = 'medium',
    textValue = typeof children === 'string' ? children : undefined,
    ...rest
  } = props;

  const iconSize = size === 'small' ? 'xsmall' : 'small';

  return (
    <AriaTag
      {...rest}
      ref={ref}
      className={composeRenderProps(classNames?.chip, (className) =>
        deletableChip({ className, size }),
      )}
      textValue={textValue}
      data-size={size}
    >
      {composeRenderProps(children, (children, { allowsRemoving }) => {
        if (!allowsRemoving) {
          throw new Error(
            'You have a <DeletableChip> in a <ChipList> that does not specify an onRemove handler.',
          );
        }

        return (
          <>
            {children}
            <Button
              variant='icon'
              size={size}
              slot='remove'
              className={composeRenderProps(classNames?.remove, (className) =>
                remove({ className }),
              )}
            >
              <Icon size={iconSize}>
                <CancelFill />
              </Icon>
            </Button>
          </>
        );
      })}
    </AriaTag>
  );
}
