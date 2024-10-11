import {
  createContainer,
  createThemeContract,
  fallbackVar,
  style,
} from '@vanilla-extract/css';
import { layers } from '../../styles';
import { containerQueries } from '../../utils';
import type { GroupClassNames, GroupState } from './types';

export const groupContainer = createContainer();

export const groupSpaceVars = createThemeContract({
  gap: '',
  x: '',
  y: '',
});

export const groupStateVars = createThemeContract({
  count: '',
  orientation: '',
  reverse: '',
  type: '',
});

export const groupClassNames: GroupClassNames = {
  container: style({
    '@layer': {
      [layers.components.l1]: {
        containerName: groupContainer,
        display: 'contents',
      },
    },
  }),
  group: style({
    '@layer': {
      [layers.components.l1]: {
        width: 'fit-content',
        display: 'flex',
        gap: groupSpaceVars.gap,
        padding: `${fallbackVar(groupSpaceVars.y, '0')} ${fallbackVar(groupSpaceVars.x, '0')}`,
        '@container': containerQueries<GroupState>(
          groupStateVars,
          {
            query: { orientation: 'horizontal', reverse: false },
            flexDirection: 'row',
          },
          {
            query: { orientation: 'horizontal', reverse: true },
            flexDirection: 'row-reverse',
          },
          {
            query: { orientation: 'vertical', reverse: false },
            flexDirection: 'column',
          },
          {
            query: { orientation: 'vertical', reverse: true },
            flexDirection: 'column-reverse',
          },
        ),
      },
    },
  }),
};
