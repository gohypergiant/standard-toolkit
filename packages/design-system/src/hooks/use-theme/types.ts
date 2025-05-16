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

import type { CSSProperties, PropsWithChildren } from 'react';
import type { ButtonClassNames } from '../../components/button/types';
import type { CheckboxClassNames } from '../../components/checkbox/types';
import type { ChipClassNames } from '../../components/chip/types';
import type { ComboBoxClassNames } from '../../components/combo-box/types';
import type { DateFieldClassNames } from '../../components/date-field/types';
import type { DateInputClassNames } from '../../components/date-input/types';
import type { DialogClassNames } from '../../components/dialog/types';
import type { DrawerClassNames } from '../../components/drawer/types';
import type { GroupClassNames } from '../../components/group/types';
import type { IconClassNames } from '../../components/icon/types';
import type { InputClassNames } from '../../components/input/types';
import type { MenuClassNames } from '../../components/menu/types';
import type { NumberFieldClassNames } from '../../components/number-field/types';
import type { OptionsClassNames } from '../../components/options/types';
import type { PickerClassNames } from '../../components/picker/types';
import type { PopoverClassNames } from '../../components/popover/types';
import type { QueryBuilderClassNames } from '../../components/query-builder/types';
import type { RadioClassNames } from '../../components/radio/types';
import type { SearchFieldClassNames } from '../../components/search-field/types';
import type { SelectClassNames } from '../../components/select/types';
import type { SliderClassNames } from '../../components/slider/types';
import type { SwitchClassNames } from '../../components/switch/types';
import type { TabsClassNames } from '../../components/tabs/types';
import type { TextFieldClassNames } from '../../components/text-field/types';
import type { TextAreaClassNames } from '../../components/textarea/types';
import type { TimeFieldClassNames } from '../../components/time-field/types';
import type { TooltipClassNames } from '../../components/tooltip/types';
import type { TreeClassNames } from '../../components/tree/types';

export type ThemeContext = {
  /**
   * Intended as a way to pass classNames down to nested themes or global portals
   */
  className?: string;
  /**
   * Intended as a way to pass inline CSS variables down to nested themes or global portals
   */
  style?: CSSProperties;
  /**
   * Component specific classNames theme entrypoints
   */

  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  Button?: ButtonClassNames;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  Checkbox?: CheckboxClassNames;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  Chip?: ChipClassNames;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  ComboBox?: ComboBoxClassNames;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  DateField?: DateFieldClassNames;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  DateInput?: DateInputClassNames;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  Dialog?: DialogClassNames;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  Drawer?: DrawerClassNames;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  Group?: GroupClassNames;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  Icon?: IconClassNames;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  Input?: InputClassNames;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  Menu?: MenuClassNames;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  NumberField?: NumberFieldClassNames;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  Options?: OptionsClassNames;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  Picker?: PickerClassNames;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  Popover?: PopoverClassNames;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  QueryBuilder?: QueryBuilderClassNames;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  Radio?: RadioClassNames;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  SearchField?: SearchFieldClassNames;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  Select?: SelectClassNames;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  Slider?: SliderClassNames;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  Switch?: SwitchClassNames;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  Tabs?: TabsClassNames;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  TextArea?: TextAreaClassNames;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  TextField?: TextFieldClassNames;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  TimeField?: TimeFieldClassNames;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  Tooltip?: TooltipClassNames;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  Tree?: TreeClassNames;
};

export type ThemeVars = {
  colors?: {
    generic?: string;
    semantic?: string;
  };
  elevation?: string;
  focus?: string;
  radius?: string;
  sizes?: string;
  space?: string;
  typography?: string;
  zIndex?: string;
};

export type ThemeProviderProps = PropsWithChildren<{
  className?: string;
  /**
   * Set to true to skip defaults and inherit classNames, styles, theme & vars from parent
   * All other props will be merged on top of inherited theme
   */
  inherit?: boolean;
  /**
   * Use to set runtime CSS variables, not intended for other styles. Will be passed to
   * nested themes and global portals
   */
  style?: CSSProperties;
  theme?: ThemeContext;
  vars?: ThemeVars;
}>;
