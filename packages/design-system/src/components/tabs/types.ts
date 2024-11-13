import type { AsType } from '../../types';
import type { PropsWithChildren } from 'react';
import type { Orientation, PressEvents } from '@react-types/shared';
import type {
  TabListProps as RACTabListProps,
  TabPanelProps as RACTabPanelProps,
  TabPanelRenderProps as RACTabPanelRenderProps,
  TabProps as RACTabProps,
  TabRenderProps as RACTabRenderProps,
  TabsProps as RACTabsProps,
} from 'react-aria-components';
import type { PartialDeep } from 'type-fest';

export type TabsClassNames = PartialDeep<{
  tabs: string;
  list: {
    container: string;
    list: string;
  };
  tab: {
    container: string;
    tab: string;
  };
  panels: {
    container: string;
    panels: string;
  };
  panel: {
    container: string;
    panel: string;
  };
}>;

export type TabListVariants = 'border' | 'fill';

export type TabListAnchor = 'start' | 'end';

export type TabListAlignment = 'start' | 'center' | 'end';

export type TabListSizes = 'sm' | 'lg';

export type TabRenderProps = AsType<RACTabRenderProps>;

export type TabPanelRenderProps = AsType<RACTabPanelRenderProps>;

type BaseProps = {
  classNames?: TabsClassNames;
};

type BaseTabListProps = {
  align?: TabListAlignment;
  /**
   * To be combined with orientation, where:
   * orientation=horizontal + anchor=end = bottom
   * orientation=horizontal + anchor=start = top
   * orientation=vertical + anchor=end = right
   * orientation=vertical + anchor=start = left
   */
  anchor?: TabListAnchor;
  orientation?: Orientation;
  size?: TabListSizes;
  variant?: TabListVariants;
};

type BaseTabProps = {
  /**
   * Must match cooresponding TabPanel id, should be
   * unique to all other ids
   */
  id: string;
} & PressEvents;

type BaseTabPanelsProps = PropsWithChildren<{
  /**
   * Setting this to true will apply to all panels and
   * change the layout to a stacked approach that grows
   * to the size of the largest panel content, no matter
   * which panel is active
   */
  shouldForceMount?: boolean;
}>;

type BaseTabPanelProps = {
  /**
   * Must match cooresponding Tab id, should be unique
   * to all other ids
   */
  id: string;
};

export type TabListState = Required<BaseTabListProps> & {
  count: number;
};

export type TabState = AsType<RACTabRenderProps>;

export type TabPanelsState = Required<
  Pick<BaseTabPanelsProps, 'shouldForceMount'>
>;

export type TabPanelState = Omit<TabPanelRenderProps, 'state'> &
  Required<Pick<RACTabPanelProps, 'shouldForceMount'>>;

export type TabsProps = Omit<RACTabsProps, 'children' | 'className' | 'style'> &
  PropsWithChildren<BaseProps>;

export type TabListProps<T> = Omit<RACTabListProps<T>, 'className' | 'style'> &
  BaseTabListProps &
  BaseProps;

export type TabProps = Omit<RACTabProps, 'className' | 'style'> &
  BaseTabProps &
  BaseProps;

export type TabPanelsProps = BaseTabPanelsProps & BaseProps;

export type TabPanelProps = Omit<RACTabPanelProps, 'className' | 'style'> &
  BaseTabPanelProps &
  BaseProps;
