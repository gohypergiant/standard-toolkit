import {
  type ForwardedRef,
  type ReactNode,
  type RefAttributes,
  createContext,
  forwardRef,
} from 'react';
import {
  type ContextValue,
  DateInput,
  FieldError,
  Group,
  Header,
  Heading,
  Keyboard,
  Label,
  Section,
  type SectionProps,
  SelectValue,
  type SelectValueProps,
  Separator,
  Text,
} from 'react-aria-components';
import { useContextProps } from '../../hooks';

/**
 * To better align with the guidance from RAC about establishing a unique
 * context for components to avoid conflict of props being provided by RAC
 * and C2DS components, this wrapping utility accepts an RAC and returns
 * a wrapped version along with the new context for the C2DS to use
 */
function wrap<P extends object, E extends HTMLElement>(
  Component: (props: P & RefAttributes<E>) => ReactNode,
) {
  const Context = createContext<ContextValue<P, E>>(null);

  return {
    // biome-ignore lint/style/useNamingConvention: intentional
    Component: forwardRef<E, P>(function WrappedComponent(props, ref) {
      [props, ref] = useContextProps(props, ref, Context);

      return <Component {...props} ref={ref} />;
    }),
    Context,
  };
}

export const { Component: AriaDateInput, Context: AriaDateInputContext } =
  wrap(DateInput);

export const { Component: AriaFieldError, Context: AriaFieldErrorContext } =
  wrap(FieldError);

export const { Component: AriaGroup, Context: AriaGroupContext } = wrap(Group);

export const { Component: AriaHeader, Context: AriaHeaderContext } =
  wrap(Header);

export const { Component: AriaHeading, Context: AriaHeadingContext } =
  wrap(Heading);

export const { Component: AriaKeyboard, Context: AriaKeyboardContext } =
  wrap(Keyboard);

export const { Component: AriaLabel, Context: AriaLabelContext } = wrap(Label);

export const { Component: AriaSeparator, Context: AriaSeparatorContext } =
  wrap(Separator);

export const { Component: AriaText, Context: AriaTextContext } = wrap(Text);

/**
 * Due to the complexity of types and technical constraints of TS, it's not
 * possible for the above wrapping utility to support components that accept
 * generic parameters. This means that these components must be manually wrapped
 */

export const AriaSectionContext =
  createContext<ContextValue<SectionProps<object>, HTMLElement>>(null);

export const AriaSection = forwardRef(function AriaSection<T extends object>(
  props: SectionProps<T>,
  ref: ForwardedRef<HTMLElement>,
) {
  [props, ref] = useContextProps(props, ref, AriaSectionContext);

  return <Section {...props} ref={ref} />;
});

export const AriaSelectValueContext =
  createContext<ContextValue<SelectValueProps<object>, HTMLSpanElement>>(null);

export const AriaSelectValue = forwardRef(function AriaSelectValue<
  T extends object,
>(props: SelectValueProps<T>, ref: ForwardedRef<HTMLSpanElement>) {
  [props, ref] = useContextProps(props, ref, AriaSelectValueContext);

  return <SelectValue {...props} ref={ref} />;
});
