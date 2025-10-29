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

import { Add } from '@accelint/icons';
import { Button } from '../button';
import { Icon } from '../icon';
import { KanbanStyles } from './styles';
import type { KanbanColContentActionProps } from './types';

const { colHeader } = KanbanStyles();

export function KanbanColumnActions({
  className,
  onAddCard,
  ...rest
}: KanbanColContentActionProps) {
  return (
    <div className={colHeader({ className })} {...rest}>
      <Button variant='flat' onPress={onAddCard} {...rest}>
        <Icon>
          <Add />
        </Icon>
        Add Card
      </Button>
    </div>
  );
}
