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

import {
  type DOMAttributes,
  type ReactElement,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { PressResponder } from '@react-aria/interactions';
import type { FocusableElement } from '@react-types/shared';
import { Pressable } from 'react-aria-components';
import type { NavigationStackProps, NavigationStackViewProps } from './types';

interface NavigationStackContextValue {
  currentViewId: string | null;
  pushView: (viewId: string) => void;
  popView: () => void;
  canGoBack: boolean;
  viewStack: string[];
}

const NavigationStackContext = createContext<NavigationStackContextValue>({
  currentViewId: null,
  pushView: () => undefined,
  popView: () => undefined,
  canGoBack: false,
  viewStack: [],
});

const NavigationStackView = ({
  id,
  children,
  className,
}: NavigationStackViewProps) => {
  const context = useContext(NavigationStackContext);
  const isActive = context.currentViewId === id;

  if (!isActive) {
    return null;
  }

  return <div className={className}>{children}</div>;
};
NavigationStackView.displayName = 'NavigationStack.View';

const NavigationStackNavigate = ({
  children,
  childId,
  ...props
}: {
  children: ReactElement<DOMAttributes<FocusableElement>, string>;
  childId: string;
}) => {
  const context = useContext(NavigationStackContext);
  return (
    <PressResponder onPress={() => context.pushView(childId)}>
      <Pressable {...props}>{children}</Pressable>
    </PressResponder>
  );
};
NavigationStackNavigate.displayName = 'NavigationStack.Navigate';

const NavigationStackBack = ({
  children,
  ...props
}: {
  children: ReactElement<DOMAttributes<FocusableElement>, string>;
}) => {
  const context = useContext(NavigationStackContext);
  return context.canGoBack ? (
    <PressResponder onPress={context.popView}>
      <Pressable {...props}>{children}</Pressable>
    </PressResponder>
  ) : null;
};
NavigationStackBack.displayName = 'NavigationStack.BackButton';

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

  const contextValue = useMemo(
    () => ({
      currentViewId,
      pushView,
      popView,
      canGoBack,
      viewStack,
    }),
    [currentViewId, canGoBack, viewStack, pushView, popView],
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
NavigationStack.Back = NavigationStackBack;
