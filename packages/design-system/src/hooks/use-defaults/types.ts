import { type PropsWithChildren } from 'react';
import {
  type ButtonProps,
  type LinkButtonProps,
  type ToggleButtonProps,
} from '../../components/button/types';
import {
  type CheckboxGroupProps,
  type CheckboxProps,
} from '../../components/checkbox/types';
import {
  type ChipGroupProps,
  type ChipProps,
} from '../../components/chip/types';
import { type ComboBoxProps } from '../../components/combo-box/types';
import { type DialogProps } from '../../components/dialog/types';
import {
  type DrawerProps,
  type DrawerTabListProps,
  type DrawerTabProps,
} from '../../components/drawer/types';
import { type IconProps } from '../../components/icon/types';
import { type InputProps } from '../../components/input/types';
import {
  type MenuItemProps,
  type MenuListProps,
  type MenuProps,
} from '../../components/menu/types';
import {
  type OptionsItemProps,
  type OptionsListProps,
  type OptionsProps,
} from '../../components/options/types';
import { type PickerProps } from '../../components/picker/types';
import { type PopoverProps } from '../../components/popover/types';
import {
  type RadioGroupProps,
  type RadioProps,
} from '../../components/radio/types';
import { type SearchFieldProps } from '../../components/search-field/types';
import { type SelectProps } from '../../components/select/types';
import { type SwitchProps } from '../../components/switch/types';
import {
  type TabListProps,
  type TabPanelProps,
  type TabPanelsProps,
  type TabProps,
  type TabsProps,
} from '../../components/tabs/types';
import { type TextAreaProps } from '../../components/textarea/types';
import {
  type TooltipProps,
  type TooltipTargetProps,
} from '../../components/tooltip/types';
import { type TreeProps } from '../../components/tree/types';
import { type OmitProtectedProps } from '../../types';

type DefaultsOf<T extends Record<string, object>> = {
  [K in keyof T]?: OmitProtectedProps<T[K]>;
};

// TODO: Figure out a way to nest related components(?)
export type DefaultsContext = DefaultsOf<{
  Button: ButtonProps;
  Checkbox: CheckboxProps;
  CheckboxGroup: CheckboxGroupProps;
  Chip: ChipProps;
  ChipGroup: ChipGroupProps;
  ComboBox: ComboBoxProps<object>;
  Dialog: DialogProps;
  Drawer: DrawerProps;
  DrawerTab: DrawerTabProps;
  DrawerTabList: DrawerTabListProps<unknown>;
  Icon: IconProps;
  Input: InputProps;
  LinkButton: LinkButtonProps;
  Options: OptionsProps;
  OptionsList: OptionsListProps<object>;
  OptionsItem: OptionsItemProps<object>;
  Menu: MenuProps;
  MenuList: MenuListProps<unknown>;
  MenuItem: MenuItemProps<unknown>;
  Picker: PickerProps<unknown>;
  Popover: PopoverProps;
  Radio: RadioProps;
  RadioGroup: RadioGroupProps;
  SearchField: SearchFieldProps;
  Select: SelectProps<object>;
  Switch: SwitchProps;
  Tab: TabProps;
  TabList: TabListProps<unknown>;
  TabPanel: TabPanelProps;
  TabPanels: TabPanelsProps;
  Tabs: TabsProps;
  TextArea: TextAreaProps;
  ToggleButton: ToggleButtonProps;
  Tooltip: TooltipProps;
  TooltipTarget: TooltipTargetProps;
  Tree: TreeProps<unknown>;
}>;

export type DefaultsProviderProps = PropsWithChildren<{
  defaults: DefaultsContext;
}>;
