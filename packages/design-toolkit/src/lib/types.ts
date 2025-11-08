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

import type {
  AriaRole,
  CSSProperties,
  PropsWithChildren,
  AriaAttributes as ReactAriaAttributes,
  ReactNode,
  RefAttributes,
} from 'react';

/**
 * Re-export due to not being exported by library
 */

export type ClassNameRenderProps<T extends object> = T & {
  defaultClassName?: string;
};

export type RenderPropsClassName<T extends object> =
  | string
  | ((values: ClassNameRenderProps<T>) => string);

export type StylePropRenderProps<T extends object> = T & {
  defaultStyle?: CSSProperties;
};

export type RenderPropsStyle<T extends object> =
  | CSSProperties
  | ((values: StylePropRenderProps<T>) => CSSProperties);

export type ChildrenRenderProps<T extends object> = T & {
  defaultChildren?: ReactNode;
};

export type RenderPropsChildren<T extends object> =
  | ReactNode
  | ((values: ChildrenRenderProps<T>) => ReactNode);

export type StyleRenderProps<T extends object> = {
  /** The CSS [className](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) for the element. A function may be provided to compute the class based on component state. */
  className?: RenderPropsClassName<T>;
  /** The inline [style](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style) for the element. A function may be provided to compute the style based on component state. */
  style?: RenderPropsStyle<T>;
};

export type RenderProps<T extends object> = StyleRenderProps<T> & {
  /** The children of the component. A function may be provided to alter the children based on component state. */
  children?: RenderPropsChildren<T>;
};

export type SlottedValue<T> = {
  slots?: Record<string | symbol, T>;
};

export type ProviderProps<T> = PropsWithChildren<
  Omit<T, 'children' | 'slot'> & SlottedValue<T>
>;

export type AriaAttributes = ReactAriaAttributes & {
  role?: AriaRole;
};

export type AriaAttributesWithRef<T> = AriaAttributes & RefAttributes<T>;
