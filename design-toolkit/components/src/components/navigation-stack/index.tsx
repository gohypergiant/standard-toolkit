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
import { PressResponder } from '@react-aria/interactions';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { Pressable } from 'react-aria-components';
import type {
  NavigationStackContextValue,
  NavigationStackNavigateProps,
  NavigationStackProps,
  NavigationStackViewProps,
} from './types';

const NavigationStackContext = createContext<NavigationStackContextValue>({
  currentViewId: null,
  pushView: () => undefined,
  popView: () => undefined,
  clear: () => undefined,
  canGoBack: false,
  viewStack: [],
});

const NavigationStackView = ({ id, children }: NavigationStackViewProps) => {
  const context = useContext(NavigationStackContext);
  const isActive = context.currentViewId === id;

  return isActive ? children : null;
};
NavigationStackView.displayName = 'NavigationStack.View';

const NavigationStackNavigate = ({
  children,
  for: action,
  ...props
}: NavigationStackNavigateProps) => {
  const context = useContext(NavigationStackContext);
  const handleOnPress = useCallback(() => {
    if (action === 'back') {
      context.popView();
    } else if (action === 'clear') {
      context.clear();
    } else {
      context.pushView(action);
    }
  }, [action, context.popView, context.clear, context.pushView]);
  return (
    <PressResponder onPress={handleOnPress}>
      <Pressable {...props}>{children}</Pressable>
    </PressResponder>
  );
};
NavigationStackNavigate.displayName = 'NavigationStack.Navigate';

export const NavigationStack = ({
  children,
  defaultViewId,
}: NavigationStackProps) => {
  const [viewStack, setViewStack] = useState<string[]>(
    defaultViewId ? [defaultViewId] : [],
  );
  const currentViewId = viewStack[viewStack.length - 1] || null;
  const canGoBack = viewStack.length > 1;

  const pushView = useCallback((viewId: string) => {
    setViewStack((prev) => [...prev, viewId]);
  }, []);
  const popView = useCallback(() => {
    setViewStack((prev) => prev.slice(0, -1));
  }, []);
  const clear = useCallback(() => {
    setViewStack(defaultViewId ? [defaultViewId] : []);
  }, [defaultViewId]);

  const contextValue = useMemo(
    () => ({
      currentViewId,
      pushView,
      popView,
      clear,
      canGoBack,
      viewStack,
    }),
    [currentViewId, canGoBack, viewStack, pushView, popView, clear],
  );

  return (
    <NavigationStackContext.Provider value={contextValue}>
      {children}
    </NavigationStackContext.Provider>
  );
};
NavigationStack.displayName = 'NavigationStack';
NavigationStack.View = NavigationStackView;
NavigationStack.Navigate = NavigationStackNavigate;
