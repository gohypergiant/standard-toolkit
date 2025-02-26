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

import type { PropsWithChildren } from 'react';
import type {
  ButtonProps,
  LinkButtonProps,
  ToggleButtonProps,
} from '../../components/button/types';
import type {
  CheckboxGroupProps,
  CheckboxProps,
} from '../../components/checkbox/types';
import type { ChipGroupProps, ChipProps } from '../../components/chip/types';
import type { ComboBoxProps } from '../../components/combo-box/types';
import type { DialogProps } from '../../components/dialog/types';
import type {
  DrawerProps,
  DrawerTabListProps,
  DrawerTabProps,
} from '../../components/drawer/types';
import type { IconProps } from '../../components/icon/types';
import type { InputProps } from '../../components/input/types';
import type {
  MenuItemProps,
  MenuListProps,
  MenuProps,
} from '../../components/menu/types';
import type { NumberFieldProps } from '../../components/number-field';
import type {
  OptionsItemProps,
  OptionsListProps,
  OptionsProps,
} from '../../components/options/types';
import type { PickerProps } from '../../components/picker/types';
import type { PopoverProps } from '../../components/popover/types';
import type { RadioGroupProps, RadioProps } from '../../components/radio/types';
import type { SearchFieldProps } from '../../components/search-field/types';
import type { SelectProps } from '../../components/select/types';
import type {
  SliderBarProps,
  SliderInputProps,
  SliderOutputProps,
  SliderProps,
  SliderThumbProps,
  SliderTrackProps,
} from '../../components/slider/types';
import type { SwitchProps } from '../../components/switch/types';
import type {
  TabListProps,
  TabPanelProps,
  TabPanelsProps,
  TabProps,
  TabsProps,
} from '../../components/tabs/types';
import type { TextFieldProps } from '../../components/text-field/types';
import type { TextAreaProps } from '../../components/textarea/types';
import type {
  TooltipProps,
  TooltipTargetProps,
} from '../../components/tooltip/types';
import type { TreeProps } from '../../components/tree/types';
import type { OmitProtectedProps } from '../../types';

type DefaultsOf<T extends Record<string, object>> = {
  [K in keyof T]?: OmitProtectedProps<T[K]>;
};

// TODO: Figure out a way to nest related components(?)
export type DefaultsContext = DefaultsOf<{
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  Button: ButtonProps;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  Checkbox: CheckboxProps;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  CheckboxGroup: CheckboxGroupProps;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  Chip: ChipProps;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  ChipGroup: ChipGroupProps;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  ComboBox: ComboBoxProps<object>;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  Dialog: DialogProps;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  Drawer: DrawerProps;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  DrawerTab: DrawerTabProps;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  DrawerTabList: DrawerTabListProps<unknown>;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  Icon: IconProps;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  Input: InputProps;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  LinkButton: LinkButtonProps;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  Menu: MenuProps;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  MenuList: MenuListProps<unknown>;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  MenuItem: MenuItemProps<unknown>;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  NumberField: NumberFieldProps;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  Options: OptionsProps;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  OptionsList: OptionsListProps<object>;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  OptionsItem: OptionsItemProps<object>;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  Picker: PickerProps<unknown>;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  Popover: PopoverProps;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  Radio: RadioProps;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  RadioGroup: RadioGroupProps;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  SearchField: SearchFieldProps;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  Select: SelectProps<object>;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  Slider: SliderProps;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  SliderBar: SliderBarProps;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  SliderInput: SliderInputProps;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  SliderOutput: SliderOutputProps;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  SliderThumb: SliderThumbProps;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  SliderTrack: SliderTrackProps;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  Switch: SwitchProps;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  Tab: TabProps;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  TabList: TabListProps<unknown>;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  TabPanel: TabPanelProps;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  TabPanels: TabPanelsProps;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  Tabs: TabsProps;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  TextArea: TextAreaProps;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  TextField: TextFieldProps;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  ToggleButton: ToggleButtonProps;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  Tooltip: TooltipProps;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  TooltipTarget: TooltipTargetProps;
  // biome-ignore lint/style/useNamingConvention: component name should be PascalCase
  Tree: TreeProps<unknown>;
}>;

export type DefaultsProviderProps = PropsWithChildren<{
  defaults: DefaultsContext;
}>;
