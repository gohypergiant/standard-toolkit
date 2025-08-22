// __private-exports
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

import { Hide, Show } from '@accelint/icons';
import type { Key } from '@react-types/shared';
import { useContext } from 'react';
import { isSlottedContextValue } from '../../lib/utils';
import { Button } from '../button';
import type { ButtonProps } from '../button/types';
import { Icon } from '../icon';
import { TreeContext } from './index';
import { TreeStyles } from './styles';

type VisibilityToggleProps = Omit<ButtonProps, 'id'> & {
  id: Key;
  isVisible: boolean;
  isViewable: boolean;
  onChange?: (keys: Set<Key>) => void;
};

const { visibility } = TreeStyles();

export const VisibilityToggle = (props: VisibilityToggleProps) => {
  const context = useContext(TreeContext);
  const { id, size, isVisible, isViewable, isDisabled, onChange } = props;

  const visibleKeys =
    (isSlottedContextValue(context) ? undefined : context?.visibleKeys) ??
    new Set();

  const handlePress = () => {
    const keys = new Set<Key>(visibleKeys);
    visibleKeys.has(id) ? keys.delete(id) : keys.add(id);
    onChange?.(keys);
  };

  return (
    <Button
      variant='icon'
      color='info'
      size={size}
      onPress={handlePress}
      isDisabled={isDisabled}
      className={visibility({ isViewable, isVisible, isDisabled })}
    >
      <Icon>{isVisible ? <Show /> : <Hide />}</Icon>
    </Button>
  );
};
