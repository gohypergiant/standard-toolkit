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

// @ts-nocheck
import { Children, type ReactNode, isValidElement } from 'react';

class ComponentStructureError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ComponentStructureError';
  }
}

type ContainsExactChildrenProps = {
  componentName: string;
  // biome-ignore lint/suspicious/noExplicitAny: aria render props include a generic type
  children:
    | ReactNode
    | ReactNode[]
    | ((
        values: any & {
          defaultChildren: ReactNode | undefined;
        },
      ) => ReactNode);
  restrictions: Record<string, { min: number; max?: number }>;
};

/**
 * Validates the intended composite component structure.
 *
 * @param children the children of the component
 * @param componentName the displayName of the component
 * @param restrictions the record of validation rules
 */
export function containsExactChildren({
  children,
  componentName,
  restrictions,
}: ContainsExactChildrenProps) {
  const childrenComponents = Children.toArray(children);

  if (!childrenComponents.every(isValidElement)) {
    throw new ComponentStructureError(
      `<${componentName}> received invalid children.`,
    );
  }

  const accumulationResults = childrenComponents.reduce((acc, child) => {
    const name = child?.type?.displayName;
    if (name) {
      acc[name] = (acc[name] || 0) + 1;
    }
    return acc;
  }, {});

  const missingComponentsArray: string[] = [];
  const excessComponentsArray: string[] = [];

  for (const [key, { min, max }] of Object.entries(restrictions)) {
    const found = accumulationResults[key] ?? 0;

    if (found < min) {
      missingComponentsArray.push(`${min - found} of <${key}>`);
    }

    if (max !== undefined && found > max) {
      excessComponentsArray.push(`${found - max} of <${key}>`);
    }
  }

  if (missingComponentsArray.length || excessComponentsArray.length) {
    const formatList = (label: string, items: string[]) =>
      items.length ? `\t${label}:\n\t\t${items.join(', ')}\n` : '';

    const errorMessage =
      `Invalid <${componentName}> structure \n` +
      `${formatList('Missing the following', missingComponentsArray)}` +
      `${formatList('Excess of the following', excessComponentsArray)}`;

    throw new ComponentStructureError(errorMessage.trim());
  }
}

/**
 * I look for svgIcons exported from the @accelint/icons library
 * and ensure that they are wrapped in an Icon component in order
 * to get the classes and styles they need in context.
 *
 * Using isValidElement means we will filter out strings, boolean, etc.
 * that are valid nodes but not elements.
 *
 * @example
 *   expectsIconWrapper({
 *     children,
 *     componentName: Button.displayName,
 *   });
 *
 *
 * @param children the children of the calling component
 * @param componentName the displayName of the calling component
 */
export function expectsIconWrapper({ children, componentName }) {
  const childrenComponents = Children.toArray(children);

  childrenComponents.map((child) => {
    if (isValidElement(child)) {
      // icons should never be a direct child of the parent
      if (child.type.name?.startsWith('Svg')) {
        throw new Error(
          `${componentName} is using an icon without the required Icon wrapper`,
        );
      }
    }
  });
}
