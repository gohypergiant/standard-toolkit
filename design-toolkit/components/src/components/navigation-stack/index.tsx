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
  Children,
  type ReactNode,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useMemo,
  useState
} from "react";

import {Button} from "../button"
import {Icon} from "../icon"
import {NavigationStackStyles} from "./styles"
import type {NavigationStackProps, NavigationStackViewProps} from "./types"
import { ChevronLeft } from "@accelint/icons";

interface NavigationStackContextValue {
  currentViewId: string | null;
  pushView: (viewId: string) => void;
  popView: () => void;
  canGoBack: boolean;
  viewStack: string[];
}

export const NavigationStackContext = createContext<NavigationStackContextValue>({
  currentViewId: null,
  pushView: () => undefined,
  popView: () => undefined,
  canGoBack: false,
  viewStack: []
})

const {container, content, header, headerContent, backButton, title, view} = NavigationStackStyles();

const NavigationStackHeader = ({children, className,...props}: {children?: ReactNode, className?: string}) => {
  const context = useContext(NavigationStackContext);

  return (
    <div className={header({className})} {...props}>
      <div className={headerContent({hasBackButton: context.canGoBack})}>
        {context.canGoBack && (
          <Button slot="back" size="small" variant="flat" onPress={context.popView} className={backButton()}>
            <Icon>
              <ChevronLeft />
            </Icon>

          </Button>
        )}
        {children}
      </div>
    </div>
  );
}
NavigationStackHeader.displayName = "NavigationStack.Header";

const NavigationStackTitle = ({children, className, ...props}: {children: ReactNode, className?: string}) => {
  const context = useContext(NavigationStackContext);
  return (
    <h2 className={title({className, canGoBack: context.canGoBack})} {...props}>{children}</h2>
  );
}
NavigationStackTitle.displayName = "NavigationStack.Title"

const NavigationStackContent = ({children, className, ...props}: {children: ReactNode, className?: string}) => {
  return (
    <div className={content({className})} {...props}>{children}</div>
  )
}
NavigationStackContent.displayName = "NavigationStack.Content"

const NavigationStackView = ({
  id,
  children,
  className,
  ...props
}: NavigationStackViewProps) => {
  const context = useContext(NavigationStackContext);
  const isActive = context.currentViewId === id;

  if (!isActive) {
    return null;
  }

  return (
    <div className={view()} {...props}>
      {children}
    </div>
  );
}
NavigationStackView.displayName = "NavigationStack.View"

const NavigationStackButton = ({children, childId,...props}: {children: ReactNode, childId: string;}) => {
  const context = useContext(NavigationStackContext)
  return <Button {...props} onPress={() => context.pushView(childId)}>{children}</Button>
}
NavigationStackButton.displayName = "NavigationStack.NavigationButton";


export const NavigationStack = ({
  children,
  defaultViewId,
  className,
  ...props
}: NavigationStackProps) => {
  const [viewStack, setViewStack] = useState<string[]>(defaultViewId ? [defaultViewId]: [])
  const currentViewId = viewStack[viewStack.length - 1] || null;
  const canGoBack = viewStack.length > 1;

  const pushView = useCallback((viewId: string) => {
    setViewStack(prev => [...prev, viewId])
  }, [])
  const popView = useCallback(() => {
    setViewStack(prev => prev.slice(0, -1))
  }, [])

  const contextValue = useMemo(() => ({
    currentViewId,
    pushView,
    popView,
    canGoBack,
    viewStack
  }), [currentViewId,canGoBack,viewStack, pushView, popView])

  const header = Children.toArray(children).find(
    (child) => isValidElement(child) && child.type === NavigationStackHeader
  )

  const content = Children.toArray(children).find(
    (child) => isValidElement(child) && child.type === NavigationStackContent
  )

  const views = Children.toArray(children).filter(
    (child) => isValidElement(child) && child.type === NavigationStackView
  )

  return (
    <NavigationStackContext.Provider value={contextValue}>
      <div className={container({className})} {...props}>
        {header}
        {content}
        {views}
      </div>
    </NavigationStackContext.Provider>
  );
}
NavigationStack.displayName = "NavigationStack";
NavigationStack.Header = NavigationStackHeader;
NavigationStack.Title = NavigationStackTitle;
NavigationStack.Content = NavigationStackContent;
NavigationStack.View = NavigationStackView;
NavigationStack.NavigationButton = NavigationStackButton;
