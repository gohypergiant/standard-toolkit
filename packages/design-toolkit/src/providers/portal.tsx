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

import { UNSAFE_PortalProvider } from '@react-aria/overlays';
import { useIsSSR } from '@react-aria/ssr';
import {
  type PropsWithChildren,
  type RefObject,
  useEffect,
  useState,
} from 'react';

export function PortalProvider({
  parentRef,
  inject,
  children,
}: PropsWithChildren<{
  parentRef?: RefObject<HTMLElement | null>;
  inject?: HTMLElement | null;
}>) {
  const isSSR = useIsSSR();
  const [portal, setPortal] = useState(isSSR ? null : document.body);

  useEffect(() => {
    const node = parentRef?.current;
    // TODO: Ensure proper ssr hydration
    const port = isSSR ? null : inject;

    if (node && port) {
      node.appendChild(port);

      setPortal(port);
    } else if (node) {
      setPortal(node);
    }

    return () => {
      port?.remove();

      setPortal(isSSR ? null : document.body);
    };
  }, [isSSR, parentRef, inject]);

  return (
    <UNSAFE_PortalProvider getContainer={() => portal}>
      {children}
    </UNSAFE_PortalProvider>
  );
}
