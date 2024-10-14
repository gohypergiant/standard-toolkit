import type { AsType } from '../../types';
import type {
  PopoverRenderProps,
  MenuItemProps as RACMenuItemProps,
  MenuItemRenderProps as RACMenuItemRenderProps,
  MenuProps as RACMenuProps,
  PopoverProps as RACPopoverProps,
} from 'react-aria-components';
import type { PartialDeep } from 'type-fest';
import type { IconClassNames } from '../icon/types';

export type MenuClassNames = PartialDeep<{
  menu: {
    container: string;
    menu: string;
  };
  list: {
    container: string;
    list: string;
    section: string;
    header: string;
    separator: string;
  };
  item: {
    container: string;
    item: string;
    icon: IconClassNames;
    label: string;
    description: string;
    more: IconClassNames;
    shortcut: string;
  };
}>;

export type MenuSizes = 'sm' | 'lg';

export type MenuMapping = {
  description: Partial<Record<MenuSizes, string>>;
  header: Partial<Record<MenuSizes, string>>;
  label: Partial<Record<MenuSizes, string>>;
  shortcut: Partial<Record<MenuSizes, string>>;
};

type BaseMenuProps = {
  classNames?: MenuClassNames;
  mapping?: Partial<MenuMapping>;
  size?: MenuSizes;
};

export type MenuProps = Omit<RACPopoverProps, 'className' | 'style'> &
  BaseMenuProps;

export type MenuListProps<T> = Omit<RACMenuProps<T>, 'className' | 'style'> &
  BaseMenuProps;

export type MenuItemProps<T> = Omit<
  RACMenuItemProps<T>,
  'className' | 'style'
> &
  BaseMenuProps;

export type MenuRenderProps = AsType<PopoverRenderProps> &
  Required<Pick<BaseMenuProps, 'size'>>;

export type MenuItemRenderProps = AsType<RACMenuItemRenderProps> &
  Required<Pick<BaseMenuProps, 'size'>>;

export type MenuState = Omit<MenuRenderProps, 'trigger'>;

export type MenuItemState = Omit<
  MenuItemRenderProps,
  'allowsDragging' | 'isDragging' | 'isDropTarget'
> & {
  hasDescription: boolean;
};
