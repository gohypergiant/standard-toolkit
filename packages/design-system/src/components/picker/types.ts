import type {
  ListBoxProps,
  ListBoxItemProps,
  ListBoxItemRenderProps,
  ListBoxRenderProps,
} from 'react-aria-components';
import type { PartialDeep } from 'type-fest';

export type PickerClassNames = PartialDeep<{
  list: {
    container: string;
    list: string;
  };
  item: {
    container: string;
    item: string;
  };
}>;

type BaseProps = {
  classNames?: PickerClassNames;
};

type BasePickerProps = BaseProps & {
  /**
   * Only applicable if layout='grid'
   */
  columns?: number;
};

export type PickerState = Omit<ListBoxRenderProps, 'state' | 'isDropTarget'> &
  Required<Pick<PickerProps<unknown>, 'columns' | 'layout' | 'orientation'>>;

export type PickerProps<T> = Omit<
  ListBoxProps<T>,
  'className' | 'dragAndDropHooks' | 'style'
> &
  BasePickerProps;

export type BasePickerItemProps = BaseProps;

export type PickerItemRenderProps = Omit<
  ListBoxItemRenderProps,
  'allowsDragging' | 'isDragging' | 'isDropTarget'
>;

export type PickerItemState = PickerItemRenderProps;

export type PickerItemProps<T> = Omit<
  ListBoxItemProps<T>,
  'className' | 'style'
> &
  BasePickerItemProps;
