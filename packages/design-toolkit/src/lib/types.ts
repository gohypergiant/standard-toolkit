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

/** Render props with optional default className merged with generic state */
export type ClassNameRenderProps<T extends object> = T & {
  /** Optional default CSS class name */
  defaultClassName?: string;
};

/** CSS class name as string or render function receiving component state */
export type RenderPropsClassName<T extends object> =
  | string
  | ((values: ClassNameRenderProps<T>) => string);

/** Render props with optional default style merged with generic state */
export type StylePropRenderProps<T extends object> = T & {
  /** Optional default inline styles */
  defaultStyle?: CSSProperties;
};

/** Inline styles as CSSProperties or render function receiving component state */
export type RenderPropsStyle<T extends object> =
  | CSSProperties
  | ((values: StylePropRenderProps<T>) => CSSProperties);

/** Render props with optional default children merged with generic state */
export type ChildrenRenderProps<T extends object> = T & {
  /** Optional default children content */
  defaultChildren?: ReactNode;
};

/** Children as ReactNode or render function receiving component state */
export type RenderPropsChildren<T extends object> =
  | ReactNode
  | ((values: ChildrenRenderProps<T>) => ReactNode);

/** Props for className and style that accept render functions */
export type StyleRenderProps<T extends object> = {
  /** The CSS [className](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) for the element. A function may be provided to compute the class based on component state. */
  className?: RenderPropsClassName<T>;
  /** The inline [style](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style) for the element. A function may be provided to compute the style based on component state. */
  style?: RenderPropsStyle<T>;
};

/** Combined render props for className, style, and children */
export type RenderProps<T extends object> = StyleRenderProps<T> & {
  /** The children of the component. A function may be provided to alter the children based on component state. */
  children?: RenderPropsChildren<T>;
};

/** Container for slot-based context values */
export type SlottedValue<T> = {
  /** Map of slot names to their values */
  slots?: Record<string | symbol, T>;
};

/** Props for context providers with slot support */
export type ProviderProps<T> = PropsWithChildren<
  Omit<T, 'children' | 'slot'> & SlottedValue<T>
>;

/** Extended ARIA attributes including role */
export type AriaAttributes = ReactAriaAttributes & {
  /** ARIA role for the element */
  role?: AriaRole;
};

/** ARIA attributes combined with ref forwarding support */
export type AriaAttributesWithRef<T> = AriaAttributes & RefAttributes<T>;
