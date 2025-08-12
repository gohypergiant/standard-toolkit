# [Tailwind](https://tailwindcss.com/docs/styling-with-utility-classes)

The DesignTK heavily utilizes Tailwind (TW) as the core styling mechanism to maintain design consistency throughout. However, due to the extremely flexible implementation options that this affords us, the Core team has established opinionated patterns on how to keep code clean, readable and consistent.

## Best Practices

### Separate Concerns

To help keep components clear and concise, its best to keep the vast majority of styles (classNames) outside of the component file, in a separate file such as `styles.ts`. This allows the component to be free of conditional className logic and configuration of variants.

### Reusability

If a component is developed with all of its styles established externally rather than inline, its not just the component that becomes reusable. Having reusable styles makes it easier to build custom implementations of components or parts of components, if the need arises.

As code approaches the edges of app implementation, reusability is less of a concern. However, continuing to utilize the same patterns maintains code readability and consistency, and makes components easier to port into a reusable context, if the need arises.

## Supported

### [Tailwind Variants](https://www.tailwind-variants.org/docs/introduction)

The Core team has chosen Tailwind Variants (TV) to handle reusuable styles and styles for reusable components. It's ability to handle slots (multiple elements as part of a single component family), variants & compound variants, as well as TW class conflict resolution makes it the starting point for all styles.

Be sure to import the local instance of `tv` and not from `tailwind-variants` so your styles are configured to merge correctly with any overrides.

```jsx
// styles.ts
import { tv } from '@/lib/utils';

export const MyStyles = tv({
  slots: {
    foo: '...',
    bar: '...',
  },
  variants: {
    size: {
      medium: {
        bar: '...',
      },
      small: {
        bar: '...',
      }
    }
  },
});

// my-component.tsx
import { MyStyles } from './styles';

const { foo, bar } = MyStyles();

function MyComponent({ children, className, size }: MyComponentProps) {
  return (
    <Foo className={foo({ className, size })}>
      <Bar className={bar({ size })}>{children}</Bar>
    </Foo>
  )
}
```

Keep in mind, when implementing variants within `tv`, you should not implement a variant that is covered by one of the state classes below. Use these state classes instead of implementing a local variant, if possible.

### [RAC State Classes](https://react-spectrum.adobe.com/react-aria/styling.html#plugin)

The Core team has chosen not to implement the RAC TW plugin directly. Instead we've implemented a modified version that follows the same patterns without being locked into RAC selectors or using a prefix that separates selector types. This means that RAC state based classes are available to utilize, they're just merged with CSS pseudo selectors and will work with any component that implements the cooresponding data attributes (when CSS pseudo selectors don't work).

Because we have a custom implementation, there may be additional variants available than what is documented in RAC. Check out [variants.css](../variants/variants.css) to see the custom variants defined and the selectors associated with each.

Any reusable component that is being developed without RAC underpinning or has additional internal state which would be useful to expose to styling should implement data attributes and a custom variant. However, consider how generic the implementation is before proceeding. If the state is unique to the component being developed, using TV variants instead is likely the way to go.

```jsx
function MyComponent() {
  return (
    <ToggleButton>
      <Icon>
        <MyIcon className="transform group-selected:rotate-180" />
      <Icon>
    </ToggleButton>
  )
}
```

### [CSS Modules](https://github.com/css-modules/css-modules)

If and when it becomes necessary to create a complex style or a style override that is not possible or practical with TW, implementation of CSS Modules is the preferred solution. Due to all TW classes being assigned a CSS layer, styles written in CSS Modules should not be in a CSS layer so they are gauranteed stylistic priority over TW.

Keep in mind that TW is very flexible and capable, so this should only be a last resort for extremely complex styling scenarios or when absolutely necessary due to integration of a 3rd party library where styles need to be targetted.

Also, when creating reusable styles that accompany a reusable component, make sure that those styles are contained within a CSS layer named "components". This will allow app level overrides to continue to take priority over the base styles.

```jsx
import styles from './styles.css';

function MyComponent({ children, className }: Props) {
  return <div className={clsx(styles.className, className)}>{children}</div>
}
```

## Unsupported

### [Arbitrary Values, Properties & Variants](https://tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values)

Do not use arbitrary values, instead use values established within the theme.

```jsx
// Bad
<div className="gap-[11px]" />

// Ok, if utility class doesn't already exist
<div className="gap-(--spacing-xxl)" />

// Good, if utility class exists
<div className="gap-xxl" />
```

Do not hardcode values that match the theme, instead reference theme values.

```jsx
// Bad
<div className="[--my-font-size:12px]" />

// Good
<div className="[--my-font-size:var(--body-m-size)]" />
```

Do not use arbitrary properties unless you're 100% certain (and double checked) that TW & DTK don't provide a utility class. If the styles are sufficiently complex (beyond 1-2 properties) use CSS Modules instead. Use of arbitrary properties for local CSS variables is supported.

```jsx
// Bad
<div className="[background:--color-default-light]" />

// Good
<div className="bg-default-light" />
```

Do not use arbitrary variants, instead use TV and / or RAC state classes.

```jsx
const styles = tv({
  variants: {
    isSelected: {
      true: 'foo'
    }
    size: {
      large: 'bar'
    }
  }
});

function MyComponent({ size }: Props) {
  // Bad
  return (
    <ToggleButton
      className="data-selected:foo data-[size=large]:bar"
      data-size={size}
    />
  );

  // Ok, but custom variants aren't available
  return <ToggleButton className="selected:foo" />

  // Good, if renderProps from RAC are available (props and internal state can be used too)
  return <ToggleButton className={({ isSelected }) => styles({ size, isSelected })} />

  // Good, if renderProps from RAC are not available
  const [isSelected, setIsSelected] = useState(false);

  return <button className={styles({ size, isSelected })} />
}
```

Do not create inline selectors, unless it's impossible to target the desired element directly. Passing classes directly to the target element is the preferred solution. Do not target elements outside of the scope of the current component being rendered. That means if the element is a sub element of a child component, you shouldn't be trying to override the style from this level.

Larger scope selectors such as `@media` and `@supports` should be contained within CSS Modules if there isn't already a TW shorthand version.

```jsx
function Parent() {
  return (
    // Bad
    <div className="[&_span]:pl-s">
      {options.map(() => (
        <Child
          // Ok
          className="[&:nth-child(3n)]:bg-default-dark"
        />
      ))}
    </div>
  )
}

function Child({ children, className }: Props) {
  return (
    <div className={className}>
      <Icon><MyIcon /></Icon>
      <span>{children}</span>
    </div>
  )
}
```

### Inline Dynamic Classes

Do not include inline logic in your component to determine which classes to add / remove. Instead rely on TV (primary) or `clsx` (fallback, mostly in conjunction with CSS Modules).

```jsx
const styles = tv({
  base: 'foo',
  variants: {
    isDisabled: {
      true: 'bar'
    }
  }
});

function MyComponent({ className, isDisabled }: Props) {
  // Bad
  return <div className={`foo ${isDisabled && 'bar'} ${className}`} />

  // Bad
  return <div className={['foo', isDisabled ? 'bar' : undefined, className].join(' ')} />

  // Bad
  return <div className={clsx(['foo', isDisabled && 'bar', className])} />

  // Ok, if classes are not TW, but will fail to properly merge TW classes
  return <div className={clsx('foo', { bar: isDisabled }, className)} />

  // Good
  return <div className={styles({ className, isDisabled })} />
}
```

## Implementation Specifics

### Border vs Outline

DesignTK chooses to implement outlines instead of borders to make it so that the style doesn't impact box model dimensions. This way elements with or without a "border" are consistently sized based on content and padding alone. This also helps with sibling components rendering at the same size when their border styles may not match.

Do not implement borders, do implement outlines
