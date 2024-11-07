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
import type { SwitchClassNames } from '../../components/switch/types';
import type { TabsClassNames } from '../../components/tabs/types';
import type { TextFieldClassNames } from '../../components/text-field/types';
import type { TextAreaClassNames } from '../../components/textarea/types';
import type { TimeFieldClassNames } from '../../components/time-field';
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
  Button?: ButtonClassNames;
  Checkbox?: CheckboxClassNames;
  Chip?: ChipClassNames;
  ComboBox?: ComboBoxClassNames;
  DateField?: DateFieldClassNames;
  DateInput?: DateInputClassNames;
  Dialog?: DialogClassNames;
  Drawer?: DrawerClassNames;
  Group?: GroupClassNames;
  Icon?: IconClassNames;
  Input?: InputClassNames;
  Menu?: MenuClassNames;
  NumberField?: NumberFieldClassNames;
  Options?: OptionsClassNames;
  Picker?: PickerClassNames;
  Popover?: PopoverClassNames;
  QueryBuilder?: QueryBuilderClassNames;
  Radio?: RadioClassNames;
  SearchField?: SearchFieldClassNames;
  Select?: SelectClassNames;
  Switch?: SwitchClassNames;
  Tabs?: TabsClassNames;
  TextArea?: TextAreaClassNames;
  TextField?: TextFieldClassNames;
  TimeField?: TimeFieldClassNames;
  Tooltip?: TooltipClassNames;
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
