import { style } from '@vanilla-extract/css';
import { defaultSizesVarValues, semanticColorVars } from '../../styles';

export const sliderBar = style({
  backgroundColor: semanticColorVars.background.highlight.bold,
  height: defaultSizesVarValues.v02,
});
