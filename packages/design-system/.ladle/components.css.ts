import '@fontsource/roboto-flex';
import '@fontsource/roboto-mono';
import { createTheme, globalStyle } from '@vanilla-extract/css';
import {
  type ThemeContext,
  type ThemeVars,
  defaultTypographyVarValues,
  typographyVars,
} from '../src';
import {
  Button,
  Checkbox,
  Chip,
  ComboBox,
  DateField,
  Dialog,
  Drawer,
  Group,
  Icon,
  Input,
  Menu,
  NumberField,
  Options,
  Picker,
  Popover,
  QueryBuilder,
  Radio,
  SearchField,
  Select,
  Switch,
  Tabs,
  TextArea,
  TextField,
  TimeField,
  Tooltip,
  Tree,
} from './theme';

// Maintain a consistent layout whether in fullscreen mode or not
globalStyle('body, #ladle-root, .ladle-main', {
  height: '100vh',
  padding: 0,
  overflow: 'hidden',
});

globalStyle('[data-testid="ladle-dialog-overlay"]', {
  pointerEvents: 'none',
});

globalStyle('[data-testid="ladle-dialog-overlay"] > div', {
  pointerEvents: 'auto',
});

export const vars: ThemeVars = {
  typography: createTheme(typographyVars, {
    ...defaultTypographyVarValues,
    mono: `'Roboto MonoVariable', monospace`,
    sans: `'Roboto FlexVariable', sans-serif`,
  }),
};

export const theme: ThemeContext = {
  Button,
  Checkbox,
  Chip,
  ComboBox,
  DateField,
  Dialog,
  Drawer,
  Group,
  Icon,
  Input,
  Menu,
  NumberField,
  Options,
  Picker,
  Popover,
  QueryBuilder,
  Radio,
  SearchField,
  Select,
  Switch,
  Tabs,
  TextArea,
  TextField,
  TimeField,
  Tooltip,
  Tree,
};
