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

type TestIdProps = {
  variant?: string;
  size?: string;
  color?: string;
  placement?: string;
  isDisabled?: boolean;
};

/**
 * Generates a data-testid string from component name and props.
 * Creates consistent, descriptive test IDs like "button-filled-small-accent".
 */
export function getTestId(component: string, props: TestIdProps): string {
  const parts = [component];

  if (props.variant) {
    parts.push(props.variant);
  }
  if (props.size) {
    parts.push(props.size);
  }
  if (props.color) {
    parts.push(props.color);
  }
  if (props.placement) {
    parts.push(props.placement);
  }
  if (props.isDisabled) {
    parts.push('disabled');
  }

  return parts.join('-');
}
