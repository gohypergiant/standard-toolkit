import {
  buttonStateVars,
  containerQueries,
  elevationVars,
  type ButtonClassNames,
  type ButtonState,
} from '@accelint/design-system';
import { style } from '@vanilla-extract/css';

type ClassNames = {
  container: string;
  trigger: ButtonClassNames;
};

export const classNames: ClassNames = {
  container: style({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  }),
  trigger: {
    button: style({
      '@container': containerQueries<ButtonState>(buttonStateVars, {
        query: {
          isHovered: true,
        },
        boxShadow: elevationVars.raised.shadow,
      }),
    }),
  },
};
