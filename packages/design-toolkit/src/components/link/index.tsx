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
import {
  Link as AriaLink,
  composeRenderProps,
  LinkContext,
  useContextProps,
} from 'react-aria-components';
import { LinkStyles } from './styles';
import type { ProviderProps } from '@/lib/types';
import type { LinkProps } from './types';

function LinkProvider({ children, ...props }: ProviderProps<LinkProps>) {
  return <LinkContext.Provider value={props}>{children}</LinkContext.Provider>;
}
LinkProvider.displayName = 'Link.Provider';

export function Link({ ref, ...props }: LinkProps) {
  [props, ref] = useContextProps(props, ref ?? null, LinkContext);

  const {
    allowsVisited = false,
    className,
    isVisited = false,
    ...rest
  } = props;

  return (
    <AriaLink
      {...rest}
      ref={ref}
      className={composeRenderProps(className, (className) =>
        LinkStyles({ className }),
      )}
      data-visited={(allowsVisited && isVisited) || null}
    />
  );
}
Link.displayName = 'Link';
Link.Provider = LinkProvider;
