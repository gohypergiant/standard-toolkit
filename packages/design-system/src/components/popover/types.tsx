import type {
  PopoverProps as RACPopoverProps,
  PopoverRenderProps as RACPopoverRenderProps,
} from 'react-aria-components';
import type { OverlayTriggerState } from 'react-stately';
import type { PartialDeep } from 'type-fest';
import type {
  AsType,
  OmitProtectedProps,
  RenderPropsChildren,
} from '../../types';
import type { ButtonProps } from '../button/types';
import type { GroupProps } from '../group/types';

export type PopoverClassNames = PartialDeep<{
  popover: {
    container: string;
    popover: string;
  };
  header: string;
  content: string;
  footer: string;
}>;

export type PopoverMapping = {
  heading: string;
  actions: GroupProps<ButtonProps, HTMLButtonElement>;
  primary: Partial<OmitProtectedProps<ButtonProps>>;
  secondary: Partial<OmitProtectedProps<ButtonProps>>;
};

export type PopoverRenderProps = AsType<RACPopoverRenderProps> &
  Pick<OverlayTriggerState, 'close'>;

type BasePopoverProps = {
  children?: RenderPropsChildren<PopoverRenderProps>;
  classNames?: PopoverClassNames;
  mapping?: Partial<PopoverMapping>;
};

export type PopoverProps = Omit<
  RACPopoverProps,
  'children' | 'className' | 'style'
> &
  BasePopoverProps;

export type PopoverState = Omit<PopoverRenderProps, 'trigger' | 'close'> & {
  hasHeader: boolean;
};
