import type {
  RadioGroupProps as RACRadioGroupProps,
  RadioGroupRenderProps as RACRadioGroupRenderProps,
  RadioProps as RACRadioProps,
  RadioRenderProps as RACRadioRenderProps,
} from 'react-aria-components';
import type { PartialDeep } from 'type-fest';
import type { RenderPropsChildren } from '../../types';

export type RadioAlignment = 'start' | 'end';

export type RadioClassNames = PartialDeep<{
  group: {
    container: string;
    group: string;
  };
  radio: {
    container: string;
    radio: string;
  };
  label: string;
}>;

export type RadioGroupRenderProps = RACRadioGroupRenderProps;

export type RadioGroupProps = Omit<RACRadioGroupProps, 'className' | 'style'> &
  Pick<BaseRadioProps, 'alignInput' | 'classNames' | 'label'>;

export type RadioGroupState = Omit<RadioGroupRenderProps, 'state'>;

export type RadioRenderProps = Omit<RACRadioRenderProps, 'state'>;

type BaseRadioProps = {
  children?: RenderPropsChildren<RadioRenderProps>;
  label?: string;
  classNames?: RadioClassNames;
  alignInput?: RadioAlignment;
};

export type RadioProps = Omit<
  RACRadioProps,
  'children' | 'className' | 'style'
> &
  BaseRadioProps;

export type RadioContextProps = Omit<RadioProps, 'value'>;

export type RadioState = RadioRenderProps & Pick<BaseRadioProps, 'alignInput'>;
