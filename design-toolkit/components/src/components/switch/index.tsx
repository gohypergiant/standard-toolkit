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
  Switch as AriaSwitch,
  composeRenderProps,
  useContextProps,
} from 'react-aria-components';
import { SwitchContext } from './context';
import { SwitchStyles } from './styles';
import type { SwitchProps } from './types';

// "switch" is a reserved term in JS
const { switch: switchClassNames, control, label } = SwitchStyles();

/**
 * Switch - A toggle control for binary state changes
 *
 * Provides an accessible toggle switch component for enabling/disabling features
 * or settings. Offers clear visual feedback for on/off states with smooth transitions
 * and proper keyboard and screen reader support.
 *
 * @example
 * // Basic switch
 * <Switch>Enable notifications</Switch>
 *
 * @example
 * // Controlled switch
 * <Switch
 *   isSelected={isEnabled}
 *   onChange={setIsEnabled}
 * >
 *   Dark mode
 * </Switch>
 *
 * @example
 * // Switch with default state
 * <Switch defaultSelected>
 *   Auto-save documents
 * </Switch>
 *
 * @example
 * // Disabled switch
 * <Switch isDisabled>
 *   Premium feature (upgrade required)
 * </Switch>
 *
 * @example
 * // Switch without label (icon-only)
 * <Switch aria-label="Toggle sidebar" />
 */
export function Switch({ ref, ...props }: SwitchProps) {
  [props, ref] = useContextProps(props, ref ?? null, SwitchContext);

  const { children, classNames, labelPosition = 'end', ...rest } = props;

  return (
    <AriaSwitch
      {...rest}
      ref={ref}
      className={composeRenderProps(classNames?.switch, (className) =>
        switchClassNames({ className, labelPosition }),
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
