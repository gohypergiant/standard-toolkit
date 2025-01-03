import { createTheme } from '@vanilla-extract/css';
import {
  type ThemeContext,
  type ThemeVars,
  defaultTypographyVarValues,
  typographyVars,
} from '@accelint/design-system/vanilla';
import {
  Button,
  Checkbox,
  Chip,
  ComboBox,
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
  Tooltip,
  Tree,
} from '../theme';

export const vars: ThemeVars = {
  typography: createTheme(typographyVars, {
    ...defaultTypographyVarValues,
    mono: 'monospace',
    sans: 'sans-serif',
  }),
};

export const theme: ThemeContext = {
  Button,
  Checkbox,
  Chip,
  ComboBox,
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
  Tooltip,
  Tree,
};
