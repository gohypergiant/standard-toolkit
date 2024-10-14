import 'react';

declare module 'react' {
  // Redeclare to support generics being passed through component to props
  function forwardRef<T, P = object>(
    render: (props: P, ref: ForwardedRef<T>) => ReactElement | null,
  ): (props: P & RefAttributes<T>) => ReactElement | null;
}
