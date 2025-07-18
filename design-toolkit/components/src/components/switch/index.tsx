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
import { createContext } from 'react';
import {
  Switch as AriaSwitch,
  type ContextValue,
  composeRenderProps,
  useContextProps,
} from 'react-aria-components';
import { SwitchStyles } from './styles';
import type { SwitchProps, SwitchProviderProps } from './types';

// "switch" is a reserved term in JS
const { switch: switchClassNames, control, label } = SwitchStyles();

export const SwitchContext =
  createContext<ContextValue<SwitchProps, HTMLLabelElement>>(null);

function SwitchProvider({ children, ...props }: SwitchProviderProps) {
  return (
    <SwitchContext.Provider value={props}>{children}</SwitchContext.Provider>
  );
}
SwitchProvider.displayName = 'Switch.Provider';

export function Switch({ ref, ...props }: SwitchProps) {
  [props, ref] = useContextProps(props, ref ?? null, SwitchContext);

  const { children, classNames, ...rest } = props;

  return (
    <AriaSwitch
      {...rest}
      ref={ref}
      className={composeRenderProps(classNames?.switch, (className) =>
        switchClassNames({ className }),
      )}
    >
      {composeRenderProps(children, (children) => (
        <>
          <span className={control({ className: classNames?.control })} />
          {children && (
            <span className={label({ className: classNames?.label })}>
              {children}
            </span>
          )}
        </>
      ))}
    </AriaSwitch>
  );
}
Switch.displayName = 'Switch';
Switch.Provider = SwitchProvider;
