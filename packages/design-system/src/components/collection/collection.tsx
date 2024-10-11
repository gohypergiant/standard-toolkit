import { useContext, type Context } from 'react';
import type { CollectionRenderer } from 'react-aria-components';
import type { Collection, Node } from 'react-stately';
import { useCollectionRender } from '../../hooks';
import { MergeProvider, type MergeProviderProps } from '../merge-provider';

/**
 * Replace the default collection renderer to allow for injection of
 * context props for multiple composed components. Also enables use of
 * Section as wrapper of list items at the top level as a styleable
 * element within the RAC container
 */
export function createCollectionRenderer<
  C extends { readonly collection: Collection<Node<unknown>> },
  V extends MergeProviderProps['values'],
>(context: Context<C>, values: V): CollectionRenderer {
  return {
    CollectionRoot: ({ renderDropIndicator }) => (
      <MergeProvider values={values}>
        {useCollectionRender(
          useContext(context)?.collection,
          null,
          renderDropIndicator,
        )}
      </MergeProvider>
    ),
    CollectionBranch: ({ collection, parent, renderDropIndicator }) => (
      <MergeProvider values={values}>
        {useCollectionRender(collection, parent, renderDropIndicator)}
      </MergeProvider>
    ),
  };
}
