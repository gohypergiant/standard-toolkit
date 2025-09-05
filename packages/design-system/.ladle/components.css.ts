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

import '@fontsource/roboto-flex';
import '@fontsource/roboto-mono';
import { createTheme, globalStyle } from '@vanilla-extract/css';
import {
  defaultTypographyVarValues,
  type ThemeContext,
  type ThemeVars,
  typographyVars,
} from '../src';
import {
  Button,
  Checkbox,
  Chip,
  ComboBox,
  DateField,
  DateInput,
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
  Slider,
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
  DateInput,
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
  Slider,
  Switch,
  Tabs,
  TextArea,
  TextField,
  TimeField,
  Tooltip,
  Tree,
};
