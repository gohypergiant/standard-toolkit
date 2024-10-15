import type { Orientation } from 'react-aria';
import type {
  CheckboxGroupProps as RACCheckboxGroupProps,
  CheckboxGroupRenderProps as RACCheckboxGroupRenderProps,
  CheckboxProps as RACCheckboxProps,
  CheckboxRenderProps as RACCheckboxRenderProps,
} from 'react-aria-components';
import type { PartialDeep } from 'type-fest';
import type { RenderPropsChildren } from '../../types';
import type { IconClassNames } from '../icon/types';

export type CheckboxClassNames = PartialDeep<{
  group: {
    container: string;
    group: string;
    label: string;
  };
  checkbox: {
    container: string;
    checkbox: string;
    icon: IconClassNames;
    label: string;
  };
}>;

export type CheckboxAlignment = 'start' | 'end';

export type CheckboxRenderProps = RACCheckboxRenderProps;

type BaseCheckboxProps = {
  children?: RenderPropsChildren<CheckboxRenderProps>;
  label?: string;
  classNames?: CheckboxClassNames;
  alignInput?: CheckboxAlignment;
};

export type CheckboxState = Omit<CheckboxRenderProps, 'state'> &
  Required<Pick<BaseCheckboxProps, 'alignInput'>>;

export type CheckboxProps = Omit<
  RACCheckboxProps,
  'children' | 'className' | 'style'
> &
  BaseCheckboxProps;

export type CheckboxGroupRenderProps = RACCheckboxGroupRenderProps;

type BaseCheckboxGroupProps = {
  children?: RenderPropsChildren<CheckboxGroupRenderProps>;
  classNames?: CheckboxClassNames;
  label?: string;
  orientation?: Orientation;
} & Pick<BaseCheckboxProps, 'alignInput'>;

export type CheckboxGroupProps = Omit<
  RACCheckboxGroupProps,
  'children' | 'className' | 'style'
> &
  BaseCheckboxGroupProps;

export type CheckboxGroupState = Omit<CheckboxGroupRenderProps, 'state'> &
  Pick<BaseCheckboxGroupProps, 'orientation'>;
