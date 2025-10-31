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

import { isUUID } from '@accelint/core';
import 'client-only';
import { Fragment, useContext, useEffect } from 'react';
import { ViewStackContext } from './context';
import type { ViewStackViewProps } from './types';

/**
 * ViewStackView - Individual view in a ViewStack
 *
 * Represents a single view that can be pushed onto the ViewStack
 */
export function ViewStackView({ id, children }: ViewStackViewProps) {
  const { parent, view, register, unregister } = useContext(ViewStackContext);

  if (!parent) {
    throw new Error('ViewStackView must be implemented within a ViewStack');
  }

  if (!isUUID(id)) {
    throw new Error(`ViewStackView's id must be a UniqueId`);
  }

  useEffect(() => {
    register(id);

    return () => unregister(id);
  }, [register, unregister, id]);

  return view === id ? <Fragment key={id}>{children}</Fragment> : null;
}
