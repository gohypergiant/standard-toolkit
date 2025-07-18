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

import { mergeProps as mergePropsWithoutStyles } from '@react-aria/utils';
import { clsx } from 'clsx';
import { mergeWith } from 'lodash';
import { composeRenderProps } from 'react-aria-components';
import { z } from 'zod';
import type { CSSProperties } from 'react';
import type { AsType } from '../../types/generic';
import type { ClassNames } from '../../types/props';
import type {
  ClassNameRenderProps,
  RenderProps,
  StylePropRenderProps,
} from '../../types/react-aria';

type Props<T extends object> = AsType<T> | null | undefined;

/**
 * Recursively process merging of all class name render props
 */
function processClassNameRenderProps<T extends RenderProps<object>>(
  value: string,
  renderProps: ClassNameRenderProps<object>,
  ...propsToMerge: Props<T>[]
): string {
  if (!propsToMerge.length) {
    return '';
  }

  const [props, ...rest] = propsToMerge;

  return clsx(
    value,
    composeRenderProps<string, ClassNameRenderProps<object>, string>(
      props?.className ?? '',
      (prev) => processClassNameRenderProps(prev, renderProps, ...rest),
    )(renderProps),
  );
}

/**
 * Compose class name render props to be processed and merged
 */
function mergeRenderClassName<T extends RenderProps<object>>(
  ...propsToMerge: Props<T>[]
) {
  return composeRenderProps<string, ClassNameRenderProps<object>, string>(
    (renderProps) => renderProps.defaultClassName ?? '',
    (prev, renderProps) =>
      processClassNameRenderProps(prev, renderProps, ...propsToMerge),
  );
}

/**
 * Merge static class names
 */
function mergeStaticClassName<T extends RenderProps<object>>(
  ...propsToMerge: Props<T>[]
) {
  return clsx(
    propsToMerge.reduce<string[]>((acc, props) => {
      if (typeof props?.className !== 'string') {
        return acc;
      }

      acc.push(props.className);

      return acc;
    }, []),
  );
}

/**
 * Determine if a static or composed merge of class names is necesary based on the presence of functions
 */
function mergeClassNameProps<T extends RenderProps<object>>(
  ...propsToMerge: Props<T>[]
) {
  const anyFunctions = propsToMerge.some(
    (props) => typeof props?.className === 'function',
  );

  const anyPrimitives = propsToMerge.some(
    (props) => typeof props?.className === 'string',
  );

  if (!(anyFunctions || anyPrimitives)) {
    return undefined;
  }

  return anyFunctions
    ? mergeRenderClassName(...propsToMerge)
    : mergeStaticClassName(...propsToMerge);
}

const classNamesValidator: z.ZodType<ClassNames> = z.record(
  z.string(),
  z.union([z.string(), z.lazy(() => classNamesValidator)]),
);

const propsValidator = z.object({
  classNames: classNamesValidator,
});

/**
 * Deep merges classNames objects within props
 */
function mergeClassNamesProps<T extends object>(...propsToMerge: Props<T>[]) {
  return propsToMerge.reduce<ClassNames | undefined>((acc, props) => {
    const result = propsValidator.safeParse(props);

    if (result.success) {
      return acc
        ? mergeWith(acc, result.data.classNames, (accValue, srcValue) =>
            (!accValue || typeof accValue === 'string') &&
            (!srcValue || typeof srcValue === 'string')
              ? clsx(accValue, srcValue)
              : undefined,
          )
        : result.data.classNames;
    }

    return acc;
  }, undefined);
}

/**
 * Deep merges classNames objects by concatenating class values
 *
 * @example
 * mergeClassNames({ foo: 'foo' }, { foo: 'FOO', bar: 'bar' })
 * // returns { foo: 'foo FOO', bar: 'bar' }
 */
export function mergeClassNames<T extends ClassNames>(
  ...classNamesToMerge: (T | null | undefined)[]
) {
  return mergeClassNamesProps(
    ...classNamesToMerge.map((classNames) => ({ classNames })),
  ) as T | undefined;
}

/**
 * Recursively process merging of all style render props
 */
function processStyleRenderProps<T extends RenderProps<object>>(
  value: CSSProperties,
  renderProps: StylePropRenderProps<object>,
  ...propsToMerge: Props<T>[]
): CSSProperties {
  if (!propsToMerge.length) {
    return {};
  }

  const [props, ...rest] = propsToMerge;

  return {
    ...value,
    ...composeRenderProps<
      CSSProperties,
      StylePropRenderProps<object>,
      CSSProperties
    >(props?.style ?? {}, (prev) =>
      processStyleRenderProps(prev, renderProps, ...rest),
    )(renderProps),
  };
}

/**
 * Compose style render props to be processed and merged
 */
function mergeRenderStyle<T extends RenderProps<object>>(
  ...propsToMerge: Props<T>[]
) {
  return composeRenderProps<
    CSSProperties,
    StylePropRenderProps<object>,
    CSSProperties
  >(
    (renderProps) => renderProps.defaultStyle ?? {},
    (prev, renderProps) =>
      processStyleRenderProps(prev, renderProps, ...propsToMerge),
  );
}

/**
 * Merge static styles
 */
function mergeStaticStyle<T extends RenderProps<object>>(
  ...propsToMerge: Props<T>[]
) {
  return propsToMerge.reduce<CSSProperties>((acc, props) => {
    if (!props?.style) {
      return acc;
    }

    Object.assign(acc, props.style);

    return acc;
  }, {});
}

/**
 * Determine if a static or composed merge of styles is necesary based on the presence of functions
 */
function mergeStyleProps<T extends RenderProps<object>>(
  ...propsToMerge: Props<T>[]
) {
  const anyFunctions = propsToMerge.some(
    (props) => typeof props?.style === 'function',
  );

  const anyObjects = propsToMerge.some(
    (props) => typeof props?.style === 'object' && props.style != null,
  );

  if (!(anyFunctions || anyObjects)) {
    return undefined;
  }

  return anyFunctions
    ? mergeRenderStyle(...propsToMerge)
    : mergeStaticStyle(...propsToMerge);
}

/**
 * Extends the base margeProps functionality to also merge styles and handle class/style render props
 */
export function mergeProps<T extends object>(...propsToMerge: Props<T>[]): T {
  const className = mergeClassNameProps(...propsToMerge);
  const classNames = mergeClassNamesProps(...propsToMerge);
  const style = mergeStyleProps(...propsToMerge);

  return {
    ...(mergePropsWithoutStyles(...propsToMerge) as T),
    ...(className ? { className } : {}),
    ...(classNames ? { classNames } : {}),
    ...(style ? { style } : {}),
  };
}

/**
 * A helper for not having to reimplement the type check for a renderProp value being a function or not everywhere
 */
export function callRenderProps<T extends object, R>(
  value: R | ((renderProps: T) => R),
  values: T,
) {
  if (typeof value === 'function') {
    return (value as (renderProps: T) => R)(values);
  }

  return value;
}

/**
 * A helper function to pair with React Aria's render props. Typically
 * implemented with children, className and styles
 *
 * Allows for the injection of additional renderProps that a component
 * from React Aria may not already provide
 *
 * If the value isn't a renderProp function, then it is passed through unchanged
 */
export function wrapRenderProps<T extends object, U extends object, R>(
  value: R | ((renderProps: T & U) => R),
  inject?: U,
) {
  if (typeof value === 'function') {
    return (renderProps: T) =>
      (value as (renderProps: T & U) => R)({
        ...renderProps,
        ...inject,
      } as T & U);
  }

  return value;
}
