import { createContext } from 'react';
import type { QueryBuilderContextValue } from './types';

export const defaultSize = 'sm';

export const QueryBuilderContext = createContext<QueryBuilderContextValue>({
  controlElements: {
    ruleGroupBodyElements: () => null,
    ruleGroupFooterElements: () => null,
    ruleGroupHeaderElements: () => null,
  },
  size: defaultSize,
});

export const multiValueOperators = [
  'between',
  'notBetween',
  'during',
  'overlapped',
  'overlaps',
];
