# React

## Best Practices

### Components

#### ClassName(s)

When a component implements multiple elements, it should not support `className` and instead implement `classNames`. `classNames` is an optional object with properties that allow passing of class names to each of the elements that need to be addressable
 
When a component is only a single element, it should implement `className` and not `classNames`, no need for the extra complexity for simple components

```jsx
type MyComponentProps = {
  className?: string;
}

function MyComponent({ className }: MyComponentProps) {
  return <div className={className} />
}

type MyComplexComponentProps = {
  classNames?: {
    container?: string;
    foo?: string;
    bar?: string;
  }
}

function MyComplexComponent({ classNames }: MyComplexComponentProps) {
  return (
    <div className={classNames?.container}>
      <span className={classNames?.foo} />
      <span className={classNames?.bar} />
    </div>
  );
}
```

#### Display Name

All components should have a `displayName` attached for identification and debugging purposes. When viewing components rendered in devtools it's challenging to correctly identify anonymous functions. By attaching a `displayName` this name makes identification trivial. When providing a `displayName` be sure to follow the export structure when sub components are involved.

```jsx
function MySubComponent() {
  //...
}
MySubComponent.displayName = 'MyComponent.Sub';

export function MyComponent() {
  //...
}
MyComponent.displayName = 'MyComponent';
MyComponent.Sub = MySubComponent;
```

Notice how the `displayName` of the sub component matches the relationship of to the main exported component.

#### Subcomponents

Be mindful of creating subcomponents unnecessarily. It's often times possible to avoid creating custom subcomponents by using an existing RAC and context.

```jsx
// Bad
function MySubComponent({ className, ...rest }) {
  return <Button {...rest} className={item({ className })} />
}
MySubComponent.displayName = 'MyComponent.Item';

export function MyComponent({ children, classNames, ...rest}) {
  return (
    <header {...rest} className={header({ className: classNames?.header })}>
      <nav className={nav({ className: classNames?.nav })}>{children}</nav>
    </header>
  )
}
MyComponent.displayName = 'MyComponent';
MyComponent.Item = MySubComponent;

// Better (RAC)
export function MyComponent({ children, classNames, ...rest}) {
  return (
    <ButtonContext.Provider value={{
      className: item({ classNames?.item })
    }}>
      <header {...rest} className={header({ className: classNames?.header })}>
        <nav className={nav({ className: classNames?.nav })}>{children}</nav>
      </header>
    </ButtonContext.Provider>
  )
}
MyComponent.displayName = 'MyComponent';
MyComponent.Item = Button; // Only do this if the component is straight from RAC
MySubComponent.displayName = 'MyComponent.Item';

// Better (non-RAC)
export function MyComponent({ children, classNames, ...rest}) {
  return (
    <ButtonProvider className={item({ classNames?.item })}>
      <header {...rest} className={header({ className: classNames?.header })}>
        <nav className={nav({ className: classNames?.nav })}>{children}</nav>
      </header>
    </ButtonProvider>
  )
}
MyComponent.displayName = 'MyComponent';
```

Notice that because the sub component was just a basic passthrough component with a className applied, it's possible to eliminate this component and provide the className through the provider instead. Also, when the sub component is based on a DesignTK component, it should not be attached to the main export.

### Context

RAC utilizes context heavily in their components. Understanding the patterns they've established is critical to understanding how slots and prop inheritance works.

In typical React patterns, context is provided at the top of the application or relatively high in the rendering hierarchy and focuses mainly on global state. However, in RAC, the utilization of context is brought to the component level and often times represents the internal state of the component and / or slots to pass props down to composed components. This means that it's common for components to implement 1 or more contexts.

The other side of this is that you'll often see components consuming these contexts as a first step. This is necessary to maintain correct prop inheritance order. Here's an example:

```jsx
<NumberField>
  <Button slot="decrease">Decrease</Button>
  <Input />
  <Button slot="increase">Increase</Button>
</NumberField>
```

In this scenario, `NumberField` is wrapping it's `children` with multiple contexts, for example purposes we're just going to identify a couple: `ButtonContext` & `InputContext`. From a compositional perspective this is invisible to the implementor except through documentation and reading the source code.

`ButtonContext` is providing two `slot`s, which are named `decrease` & `increase`. Each of these slots are being provide a set of `ButtonProps`, such as aria / data attributes, classNames and event handlers. This makes it so that these buttons "just work" and there's no need for the implementor to bind things up manually. Here's a simplified look at how that looks on both sides:

```jsx
function NumberField({ children, defaultValue, value, onChange }: NumberFieldProps) {
  const [val, setVal] = useControlledState(defaultValue, value, onChange);

  return (
    <ButtonContext.Provider value={{
      slots: {
        decrease: {
          onPress: () => setVal(value - 1)
        }
      }
    }}>
      {children}
    </ButtonContext.Provider>
  )
}

function Button({ ref, ...props }: ButtonProps) {
  [props, ref] = useContextProps(props, ref ?? null, ButtonContext);
}
```

The context providing the slot defines what is necessary to bind to that component in order to have a functional component. The component consuming the context identifies itself with a `slot` prop, pulls in the props off the context and then merges those props with it's own. It's important to note that not all props get merged, some get overridden. The main props being merged are: `ref`, `id`, `className`, `style` and event handlers that follow the pattern `on[A-Z]`, [documented here](https://github.com/adobe/react-spectrum/blob/main/packages/react-aria-components/src/utils.tsx#L183) & [here](https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/utils/src/mergeProps.ts#L36).

If you implement defaults in a component, these definitions must come after `useContextProps`, otherwise it is guaranteed to override and wipe out any props being passed by context (unless they're merged). You should follow this pattern:

```jsx
const MyComponentContext = createContext<ContextValue<MyComponentProps, HTMLDivElement>>(null);

function MyComponent({ ref, ...props }: MyComponentProps) {
  [props, ref] = useContextProps(props, ref ?? null, MyComponentContext);

  const { size = 'medium' } = props;
}
```

Because a prop like `size` isn't one of the merged props it's important that the default get's set after the context consumption. Here's a few different possible scenarios and what the resulting value would be:

- `<MyComponent />` that isn't composed within a context providing one: `medium` (fallback to default implemented in the component)
- `<MyComponent />` that is composed within a context providing `large`: `large` (assuming that the context isn't slotted or that `<MyComponent slot="foo" />`'s slot matches a slot provided in the context)
- `<MyComponent size="small" />`: `small` (doesn't matter if it was composed in a context or not, local overrides always take highest precedence)

### Directives

Be sure to implement the [`use client` directive](https://react.dev/reference/rsc/use-client) when developing components with context, state, event handling or references to objects like `window`. Keep in mind that (almost?) all of RACs components are client only.

We also choose to utilize the "poison pill" approach of using `import 'client-only'` in case the directive is stripped for any reason. [https://nextjs.org/docs/app/getting-started/server-and-client-components#preventing-environment-poisoning](https://nextjs.org/docs/app/getting-started/server-and-client-components#preventing-environment-poisoning)

### Props
<!--
In light of lack of tooling support to enforce this approach, it will remain unenforced for the time being.

#### Order

For the sake of readability and consistency, prop ordering helps to be able to quickly scan a component to find what you're looking for. The order which follows a sense of uniqueness, priority, and alphabetization is as follows:

- key
- id
- className
- (everything else not present in another group, in alpha order)
- state flags (is[A-Z] in alpha order)
- event handlers (on[A-Z] in alpha order)
- aria attributes (in alpha order)
- data attributes (in alpha order)

What that looks like:

```jsx
<MyComponent
  key="bar"
  id="foo"
  className="foo bar"
  size="small"
  variant="outline"
  isDisabled
  isOpen
  onChange={() => {}}
  onPress={() => {}}
  aria-labeledby="foobar"
  data-testid="foobar"
/>
```

Having implementations where prop order is scrambled adds undue burden to the reader and often times leads to mistakes and / or bugs. This same ordering is the approach to be taking when destructing props as well, with the only addition being `children` which jumps to the top, and the only caveat being that `ref` needs to be destructured separately for other purposes. Seen here:

```jsx
function MyComponent({ ref, ...props }: MyComponentProps) {
  [props, ref] = useContextProps(props, ref ?? null, MyComponentContext);

  const {
    children,
    id,
    className,
    size,
    variant,
    isDisabled,
    isOpen,
    onChange,
    onPress,
    ...rest,
  } = props;
}
```
-->
#### Spread

When spreading `...rest` on a component, this should be done before the implementation of any props that are being implemented, unless it's acceptable to override them. Here's an example:

```jsx
function MyComponent({ children, ...rest }: MyComponentProps) {
  return (
    <Button {...rest} onPress={() => doSometingImportant()}>
      {children}
    </Button>
  )
}
```

Notice that if the spread of `rest` came afterwards, the `onPress` would be wiped out and the important functionality would never occur. There are rare occurences where the spread will happen in the middle or end of props, but that's the exception to the rule.

### Refs

Make sure to include a ref for the top most element / component being rendered. In your props, include `RefAttributes` and pass the HTML element that matches. If this ref is being passed to an RAC component, the element type will have to match the ref element that RAC has already defined.

```jsx
import type { RefAttributes } from 'react';
import { Button, type ButtonProps } from 'react-aria-components';

type MyComponentProps = ButtonProps & RefAttributes<HTMLButtonElement>;

function MyComponent({ ref }: MyComponentProps) {
  return <Button ref={ref} />
}
```

If developing a more complex component such as a Field where access to an internal element / component may be relevent to the functionality / state of the component, adding additional refs as props is handy. But this should be limited in scope, not every sub element / component should receive a ref.

```jsx
import type { Ref, RefAttributes } from 'react';

type MyComponentProps = RefAttributes<HTMLDivElement> & {
  inputRef?: Ref<HTMLInputElement>
}
```

### Render Props

RAC introduces the concept of render props, where `className`, `style` and/or `children` can be a function provided the internal state of the RAC component as parameters. This is a powerful accessor into that state, but there are some caveats to be aware of:

- Not all components provide the same render props. Certain components will not have `children` as a render prop. This is often times because `children` is serving a differnt function type, typically related to collection rendering.
- When a component is composed within another component, the sub component will not have direct access to the internal state of it's parent, even if it's slotted in. This means that a `FieldError` inside of a `TextField` has different render props and therefore access to a different set of state, even though `TextField` is the state owner in this context.

When developing a component that wraps a component that provides render props, as much as possible, maintain that access to state outwards. Here's what that looks like:

```jsx
import { composeRenderProps, ToggleButton, ToggleButtonProps } from 'react-aria-components';
import { MyComponentStyles } from './styles';

type MyComponentProps = Pick<ToggleButtonProps, 'className' | 'style'>;

function MyComponent({ className }: MyComponentProps) {
  return (
    <ToggleButton
      className={composeRenderProps(className, (className, { isSelected }) =>
        MyComponentStyles({ className, isSelected })
      )}
    />
  );
}
```

This has made it so that your component's styles received the internal state and you've also left the `className` render prop exposed for anybody implementing your component in case they need access to that internal state for their style overrides as well. Keep in mind that it will not always be possible or desirable to maintain all props. The most common scenario where a render prop is replaced is when `children` is removed as a prop due to a specific implementation of sub elements / components.

### Testing

When writing tests for components make sure to follow these dos & donts:

#### DOs

- Create a setup function that cleanly abstracts the initial render
- Test for state through existance of elements, content, or properties
- Prioritize user action based tests over prop configuration tests

#### DONTs

- Test 3rd party code, focus only on code we've developed
- Test for existance of classNames or styles, instead test for state (as described above)
