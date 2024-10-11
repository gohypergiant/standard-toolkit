import type { Context, CSSProperties, ReactNode } from 'react';

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

export type ProviderValue<T> = [Context<T>, T];

export type ProviderValues<A, B, C, D, E, F, G, H, I, J, K> =
  | [ProviderValue<A>]
  | [ProviderValue<A>, ProviderValue<B>]
  | [ProviderValue<A>, ProviderValue<B>, ProviderValue<C>]
  | [ProviderValue<A>, ProviderValue<B>, ProviderValue<C>, ProviderValue<D>]
  | [
      ProviderValue<A>,
      ProviderValue<B>,
      ProviderValue<C>,
      ProviderValue<D>,
      ProviderValue<E>,
    ]
  | [
      ProviderValue<A>,
      ProviderValue<B>,
      ProviderValue<C>,
      ProviderValue<D>,
      ProviderValue<E>,
      ProviderValue<F>,
    ]
  | [
      ProviderValue<A>,
      ProviderValue<B>,
      ProviderValue<C>,
      ProviderValue<D>,
      ProviderValue<E>,
      ProviderValue<F>,
      ProviderValue<G>,
    ]
  | [
      ProviderValue<A>,
      ProviderValue<B>,
      ProviderValue<C>,
      ProviderValue<D>,
      ProviderValue<E>,
      ProviderValue<F>,
      ProviderValue<G>,
      ProviderValue<H>,
    ]
  | [
      ProviderValue<A>,
      ProviderValue<B>,
      ProviderValue<C>,
      ProviderValue<D>,
      ProviderValue<E>,
      ProviderValue<F>,
      ProviderValue<G>,
      ProviderValue<H>,
      ProviderValue<I>,
    ]
  | [
      ProviderValue<A>,
      ProviderValue<B>,
      ProviderValue<C>,
      ProviderValue<D>,
      ProviderValue<E>,
      ProviderValue<F>,
      ProviderValue<G>,
      ProviderValue<H>,
      ProviderValue<I>,
      ProviderValue<J>,
    ]
  | [
      ProviderValue<A>,
      ProviderValue<B>,
      ProviderValue<C>,
      ProviderValue<D>,
      ProviderValue<E>,
      ProviderValue<F>,
      ProviderValue<G>,
      ProviderValue<H>,
      ProviderValue<I>,
      ProviderValue<J>,
      ProviderValue<K>,
    ];
