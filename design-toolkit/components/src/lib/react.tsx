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
  Fragment,
  type JSXElementConstructor,
  type ReactNode,
  isValidElement,
} from 'react';

class ComponentStructureError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ComponentStructureError';
  }
}

type ChildrenTypes =
  | ReactNode
  | ReactNode[]
  | ((
      // biome-ignore lint/suspicious/noExplicitAny: aria render props include a generic type
      values: any & {
        defaultChildren: ReactNode | undefined;
      },
    ) => ReactNode);

function getChildren(children: ChildrenTypes) {
  const childrenArray = Children.toArray(
    typeof children === 'function'
      ? children({ state: {}, defaultChildren: <></> })
      : children,
  );
  let index = 0;

  while (index < childrenArray.length) {
    const child = childrenArray[index];

    if (
      child != null &&
      typeof child === 'object' &&
      !(child instanceof Promise) &&
      !(Symbol.iterator in child) &&
      child.type === Fragment &&
      child.props != null &&
      typeof child.props === 'object' &&
      'children' in child.props
    ) {
      childrenArray.splice(
        index,
        1,
        ...Children.toArray(child.props.children as ReactNode | ReactNode[]),
      );
    } else {
      index++;
    }
  }

  return childrenArray;
}

type ContainsExactChildrenProps = {
  componentName: string;
  children: ChildrenTypes;
  restrictions: [
    // biome-ignore lint/suspicious/noExplicitAny: allow all props
    string | JSXElementConstructor<any>,
    { min: number; max?: number },
  ][];
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
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  const childrenComponents = getChildren(children);

  if (!childrenComponents.every(isValidElement)) {
    throw new ComponentStructureError(
      `<${componentName}> received invalid children.`,
    );
  }

  const accumulationResults = childrenComponents.reduce(
    (acc: Record<string, number>, child) => {
      const name =
        // @ts-expect-error Accessing undocumented / untyped properties of React components
        child.type?.name ?? child.type?.displayName ?? child.type?.render?.name;

      if (name) {
        acc[name] = (acc[name] || 0) + 1;
      }
      return acc;
    },
    {},
  );

  const missingComponentsArray: string[] = [];
  const excessComponentsArray: string[] = [];

  for (const [component, { min, max }] of restrictions) {
    const name =
      typeof component === 'string'
        ? component
        : // @ts-expect-error Accessing undocumented / untyped properties of React components
          (component.name ?? component.displayName ?? component.render?.name);

    const found = accumulationResults[name] ?? 0;

    if (found < min) {
      missingComponentsArray.push(`${min - found} of <${name}>`);
    }

    if (max !== undefined && found > max) {
      excessComponentsArray.push(`${found - max} of <${name}>`);
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
export function expectsIconWrapper({
  children,
  componentName,
}: Omit<ContainsExactChildrenProps, 'restrictions'>) {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  const childrenComponents = Children.toArray(
    children as ReactNode | ReactNode[],
  );

  childrenComponents.map((child) => {
    if (isValidElement(child)) {
      // icons should never be a direct child of the parent
      // @ts-expect-error Accessing undocumented / untyped properties of React components
      if (child.type?.name?.startsWith('Svg')) {
        throw new Error(
          `${componentName} is using an icon without the required Icon wrapper`,
        );
      }
    }
  });
}
