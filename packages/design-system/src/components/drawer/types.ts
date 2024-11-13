import type { AriaOverlayProps as RACOverlayProps } from '@react-aria/overlays';
import type {
  OverlayTriggerProps,
  OverlayTriggerState,
} from '@react-stately/overlays';
import type { AriaLabelingProps as RACLabelingProps } from '@react-types/shared';
import type { PropsWithChildren } from 'react';
import type { PartialDeep } from 'type-fest';
import type { OmitProtectedProps, RenderPropsChildren } from '../../types';
import type { ButtonClassNames, ButtonProps } from '../button/types';
import type {
  TabListProps,
  TabProps,
  TabRenderProps,
  TabsClassNames,
  TabsProps,
} from '../tabs/types';

export type DrawerClassNames = PartialDeep<{
  container: string;
  tabs: TabsClassNames;
  dialog: {
    container: string;
    dialog: string;
  };
  header: {
    header: string;
    back: ButtonClassNames;
    title: string;
    close: ButtonClassNames;
  };
  content: string;
  footer: string;
}>;

export type DrawerAnchor = 'left' | 'right';

export type DrawerMapping = {
  heading: {
    child: string;
    parent: string;
  };
  back: Partial<OmitProtectedProps<ButtonProps>>;
  close: Partial<OmitProtectedProps<ButtonProps>>;
};

export type DrawerRenderProps = OverlayTriggerState;

export type DrawerTabRenderProps = TabRenderProps & {
  isOpen: boolean;
};

type BaseProps = {
  classNames?: DrawerClassNames;
};

export type BaseDrawerProps = Pick<
  RACOverlayProps,
  'shouldCloseOnBlur' | 'isDismissable' | 'isKeyboardDismissDisabled'
> & {
  children?: RenderPropsChildren<DrawerRenderProps>;
  /**
   * Which side of the viewport to originate from
   */
  anchor?: DrawerAnchor;
  /**
   * If true will push sibling DOM around, else act as an independent overlay
   *
   * NOTE: Layout shift animations are less performant
   */
  layoutShift?: boolean;
};

export type BaseDrawerTabProps = {
  children?: RenderPropsChildren<DrawerTabRenderProps>;
};

export type DrawerState = Pick<DrawerRenderProps, 'isOpen'> &
  Required<Pick<BaseDrawerProps, 'anchor' | 'layoutShift'>>;

export type DrawerDialogState = {
  /**
   * If back button is present
   */
  isChild: boolean;
};

export type DrawerContextValue = DrawerRenderProps &
  Required<Pick<BaseDrawerProps, 'anchor' | 'layoutShift'>>;

export type DrawerProps = OverlayTriggerProps &
  Omit<TabsProps, 'children' | 'classNames' | 'orientation'> &
  BaseProps &
  BaseDrawerProps;

export type DrawerTabListProps<T> = Omit<
  TabListProps<T>,
  'classNames' | 'align' | 'anchor' | 'orientation'
> &
  BaseProps;

export type DrawerTabProps = Omit<TabProps, 'children'> &
  BaseDrawerTabProps &
  BaseProps;

export type DrawerDialogProps = PropsWithChildren<
  RACLabelingProps & BaseProps & { mapping?: DrawerMapping }
>;
