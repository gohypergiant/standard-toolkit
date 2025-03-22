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

import {
  type ThemeContext,
  type ThemeVars,
  defaultTypographyVarValues,
  typographyVars,
} from '@accelint/design-system/vanilla';
import { createTheme } from '@vanilla-extract/css';
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
  Slider,
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
  Slider,
  Switch,
  Tabs,
  TextArea,
  TextField,
  Tooltip,
  Tree,
};
